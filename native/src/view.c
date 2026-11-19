#include <stdlib.h>
#include <math.h>
#include "scenexe.h"

#define GEO_STRIDE 4
#define CELL_LIMIT 4096.0
#define COORD_LIMIT 1099511627776.0
#define ID_SPAN 1099511627776.0

typedef struct {
  int64_t cx, cy;
  int32_t used, start, count, fill;
} cell;

typedef struct {
  cell *cells;
  size_t mask;
} grid;

static size_t cell_hash(int64_t cx, int64_t cy)
{
  uint64_t h = (uint64_t)cx * 0x9E3779B97F4A7C15ULL ^ (uint64_t)cy * 0xC2B2AE3D27D4EB4FULL;
  h ^= h >> 29;
  h *= 0xBF58476D1CE4E5B9ULL;
  h ^= h >> 32;
  return (size_t)h;
}

static cell *grid_find(grid *g, int64_t cx, int64_t cy, int insert)
{
  size_t i = cell_hash(cx, cy) & g->mask;
  for(;;) {
    cell *c = g->cells + i;
    if(!c->used) {
      if(!insert) {
        return NULL;
      }
      c->used = 1;
      c->cx = cx;
      c->cy = cy;
      return c;
    }
    if(c->cx == cx && c->cy == cy) {
      return c;
    }
    i = (i + 1) & g->mask;
  }
}

static int outside(double left, double right, int32_t limit, double inv)
{
  double low, high;
  if(limit < 0) {
    return 0;
  }
  low = 1 + floor(left * inv);
  high = 1 + floor(right * inv);
  return low > limit || high < 1 - limit;
}

static int cell_range(double left, double right, double bottom, double top, double inv_cell, int64_t *range)
{
  double x0 = floor(left * inv_cell), x1 = floor(right * inv_cell);
  double y0 = floor(bottom * inv_cell), y1 = floor(top * inv_cell);
  if(!(x0 >= -COORD_LIMIT && x1 <= COORD_LIMIT && y0 >= -COORD_LIMIT && y1 <= COORD_LIMIT)) {
    return -1;
  }
  range[0] = (int64_t)x0;
  range[1] = (int64_t)x1;
  range[2] = (int64_t)y0;
  range[3] = (int64_t)y1;
  if(range[1] < range[0] || range[3] < range[2]) {
    return 0;
  }
  if((x1 - x0 + 1) * (y1 - y0 + 1) > CELL_LIMIT) {
    return 2;
  }
  return 1;
}

static double item_key(uint8_t list, double id)
{
  if(!(id >= 0 && id < ID_SPAN && id == floor(id))) {
    id = ID_SPAN - 1;
  }
  return (double)list * ID_SPAN + id;
}

napi_value js_view(napi_env env, napi_callback_info info)
{
  args_t a;
  int32_t n, limit;
  double slice_width, cell_size, inv, inv_cell;
  double *geo, *ids;
  uint8_t *kind, *list;
  int32_t *offsets, *out;
  size_t offsets_length = 0, out_length = 0, count, i, fov_count = 0, entry_count = 0, big_count = 0, total = 0, f = 0;
  int64_t *ranges = NULL;
  uint8_t *mode = NULL;
  uint32_t *entry_item = NULL, *buckets = NULL, *big = NULL, *found = NULL, *order = NULL, *work = NULL;
  cell **entry_cell = NULL;
  int32_t *stamp = NULL;
  double *keys = NULL;
  grid g = { NULL, 0 };
  int failed = 0;

  if(!args_load(&a, env, info, 10)) {
    return NULL;
  }
  n = args_int(&a, 0);
  limit = args_int(&a, 5);
  slice_width = args_num(&a, 6);
  cell_size = args_num(&a, 7);
  if(a.failed) {
    return NULL;
  }
  if(n < 0 || !(slice_width > 0) || !(cell_size > 0)) {
    return args_fail(&a, "bad view arguments");
  }
  count = (size_t)n;
  geo = args_f64(&a, 1, count * GEO_STRIDE, NULL);
  kind = args_u8(&a, 2, count, NULL);
  list = args_u8(&a, 3, count, NULL);
  ids = args_f64(&a, 4, count, NULL);
  offsets = args_i32(&a, 8, 1, &offsets_length);
  out = args_i32(&a, 9, 0, &out_length);
  if(a.failed) {
    return NULL;
  }
  for(i = 0; i < count; i++) {
    if(kind[i] == 1) {
      fov_count++;
    }
  }
  if(offsets_length < fov_count + 1) {
    return args_fail(&a, "offsets array is too short");
  }
  inv = 1.0 / slice_width;
  inv_cell = 1.0 / cell_size;

  ranges = malloc((count ? count : 1) * 4 * sizeof(int64_t));
  mode = calloc(count ? count : 1, 1);
  stamp = malloc((count ? count : 1) * sizeof(int32_t));
  if(!ranges || !mode || !stamp) {
    failed = 1;
    goto done;
  }

  for(i = 0; i < count; i++) {
    const double *p = geo + i * GEO_STRIDE;
    double left, right, bottom, top;
    int r;
    stamp[i] = -1;
    if(kind[i] != 2) {
      continue;
    }
    left = p[0] - p[2];
    right = p[0] + p[2];
    bottom = p[1] - p[3];
    top = p[1] + p[3];
    if(outside(left, right, limit, inv)) {
      continue;
    }
    r = cell_range(left, right, bottom, top, inv_cell, ranges + i * 4);
    if(r == 1) {
      int64_t *q = ranges + i * 4;
      mode[i] = 1;
      entry_count += (size_t)((q[1] - q[0] + 1) * (q[3] - q[2] + 1));
    } else if(r == 2) {
      mode[i] = 2;
      big_count++;
    }
  }

  {
    size_t capacity = 16;
    while(capacity < entry_count * 2) {
      capacity <<= 1;
    }
    g.cells = calloc(capacity, sizeof(cell));
    g.mask = capacity - 1;
  }
  entry_item = malloc((entry_count ? entry_count : 1) * sizeof(uint32_t));
  entry_cell = malloc((entry_count ? entry_count : 1) * sizeof(cell *));
  buckets = malloc((entry_count ? entry_count : 1) * sizeof(uint32_t));
  big = malloc((big_count ? big_count : 1) * sizeof(uint32_t));
  found = malloc((count ? count : 1) * sizeof(uint32_t));
  order = malloc((count ? count : 1) * sizeof(uint32_t));
  work = malloc((count ? count : 1) * sizeof(uint32_t));
  keys = malloc((count ? count : 1) * sizeof(double));
  if(!g.cells || !entry_item || !entry_cell || !buckets || !big || !found || !order || !work || !keys) {
    failed = 1;
    goto done;
  }

  {
    size_t e = 0, b = 0, j;
    int32_t running = 0;
    for(i = 0; i < count; i++) {
      if(mode[i] == 1) {
        int64_t *q = ranges + i * 4, cx, cy;
        for(cx = q[0]; cx <= q[1]; cx++) {
          for(cy = q[2]; cy <= q[3]; cy++) {
            cell *c = grid_find(&g, cx, cy, 1);
            c->count++;
            entry_item[e] = (uint32_t)i;
            entry_cell[e] = c;
            e++;
          }
        }
      } else if(mode[i] == 2) {
        big[b++] = (uint32_t)i;
      }
    }
    for(j = 0; j <= g.mask; j++) {
      cell *c = g.cells + j;
      if(c->used) {
        c->start = running;
        c->fill = running;
        running += c->count;
      }
    }
    for(j = 0; j < entry_count; j++) {
      buckets[entry_cell[j]->fill++] = entry_item[j];
    }
  }

  for(i = 0; i < count; i++) {
    const double *p = geo + i * GEO_STRIDE;
    double left, right, bottom, top;
    int64_t range[4];
    size_t hits = 0, j, written = 0;
    int r;
    if(kind[i] != 1) {
      continue;
    }
    offsets[f] = (int32_t)total;
    left = p[0] - p[2];
    right = p[0] + p[2];
    bottom = p[1] - p[3];
    top = p[1] + p[3];
    if(!outside(left, right, limit, inv)) {
      r = cell_range(left, right, bottom, top, inv_cell, range);
      if(r == 1) {
        int64_t cx, cy;
        for(cx = range[0]; cx <= range[1]; cx++) {
          for(cy = range[2]; cy <= range[3]; cy++) {
            cell *c = grid_find(&g, cx, cy, 0);
            int32_t k, end;
            if(!c) {
              continue;
            }
            for(k = c->start, end = c->start + c->count; k < end; k++) {
              uint32_t t = buckets[k];
              const double *q;
              if(stamp[t] == (int32_t)f) {
                continue;
              }
              stamp[t] = (int32_t)f;
              q = geo + (size_t)t * GEO_STRIDE;
              if(right >= q[0] - q[2] && left <= q[0] + q[2] && bottom <= q[1] + q[3] && q[1] - q[3] <= top) {
                found[hits++] = t;
              }
            }
          }
        }
      } else if(r == 2) {
        for(j = 0; j < count; j++) {
          const double *q;
          if(mode[j] == 0 || stamp[j] == (int32_t)f) {
            continue;
          }
          stamp[j] = (int32_t)f;
          q = geo + j * GEO_STRIDE;
          if(right >= q[0] - q[2] && left <= q[0] + q[2] && bottom <= q[1] + q[3] && q[1] - q[3] <= top) {
            found[hits++] = (uint32_t)j;
          }
        }
      }
      if(r >= 0) {
        for(j = 0; j < big_count; j++) {
          uint32_t t = big[j];
          const double *q;
          if(stamp[t] == (int32_t)f) {
            continue;
          }
          stamp[t] = (int32_t)f;
          q = geo + (size_t)t * GEO_STRIDE;
          if(right >= q[0] - q[2] && left <= q[0] + q[2] && bottom <= q[1] + q[3] && q[1] - q[3] <= top) {
            found[hits++] = t;
          }
        }
      }
    }
    for(j = 0; j < hits; j++) {
      keys[j] = item_key(list[found[j]], ids[found[j]]);
    }
    sort_indices(order, work, hits, keys);
    for(j = 0; j < hits; j++) {
      uint32_t t = found[order[j]];
      if(j > 0 && keys[order[j]] == keys[order[j - 1]]) {
        continue;
      }
      if(total + written < out_length) {
        out[total + written] = (int32_t)t;
      }
      written++;
    }
    total += written;
    f++;
  }
  offsets[f] = (int32_t)total;

done:
  free(ranges);
  free(mode);
  free(stamp);
  free(g.cells);
  free(entry_item);
  free(entry_cell);
  free(buckets);
  free(big);
  free(found);
  free(order);
  free(work);
  free(keys);
  if(failed) {
    return args_fail(&a, "out of memory");
  }
  return result_int(env, (int32_t)total);
}
