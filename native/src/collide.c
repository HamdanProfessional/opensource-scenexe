#include <stdlib.h>
#include <math.h>
#include "scenexe.h"

#define GEO_STRIDE 5
#define PAIR_STRIDE 7

typedef struct {
  double *keys, *left, *right, *bottom, *top, *x, *y, *size;
  int32_t *low, *high, *slice_min, *slice_max, *starts, *fill, *slice_order;
  uint32_t *included, *order, *work, *origin, *entries;
  uint8_t *type, *rect, *seen;
} collide_memory;

static void release(collide_memory *m)
{
  free(m->keys); free(m->left); free(m->right); free(m->bottom); free(m->top); free(m->x); free(m->y); free(m->size);
  free(m->low); free(m->high); free(m->slice_min); free(m->slice_max); free(m->starts); free(m->fill); free(m->slice_order);
  free(m->included); free(m->order); free(m->work); free(m->origin); free(m->entries);
  free(m->type); free(m->rect); free(m->seen);
}

static int reserve(collide_memory *m, size_t count, size_t slots)
{
  size_t n = count ? count : 1, s = slots ? slots : 1;
  m->keys = malloc(n * sizeof(double));
  m->left = malloc(n * sizeof(double));
  m->right = malloc(n * sizeof(double));
  m->bottom = malloc(n * sizeof(double));
  m->top = malloc(n * sizeof(double));
  m->x = malloc(n * sizeof(double));
  m->y = malloc(n * sizeof(double));
  m->size = malloc(n * sizeof(double));
  m->low = malloc(n * sizeof(int32_t));
  m->high = malloc(n * sizeof(int32_t));
  m->slice_min = malloc(n * sizeof(int32_t));
  m->slice_max = malloc(n * sizeof(int32_t));
  m->starts = calloc(s + 1, sizeof(int32_t));
  m->fill = calloc(s + 1, sizeof(int32_t));
  m->slice_order = malloc(s * sizeof(int32_t));
  m->included = malloc(n * sizeof(uint32_t));
  m->order = malloc(n * sizeof(uint32_t));
  m->work = malloc(n * sizeof(uint32_t));
  m->origin = malloc(n * sizeof(uint32_t));
  m->type = malloc(n);
  m->rect = malloc(n);
  m->seen = calloc(s, 1);
  return m->keys && m->left && m->right && m->bottom && m->top && m->x && m->y && m->size &&
    m->low && m->high && m->slice_min && m->slice_max && m->starts && m->fill && m->slice_order &&
    m->included && m->order && m->work && m->origin && m->type && m->rect && m->seen;
}

napi_value js_collide(napi_env env, napi_callback_info info)
{
  args_t a;
  collide_memory m = { 0 };
  int32_t n, limit, type_count, base, s;
  double width, inv;
  double *geo, *out;
  uint8_t *kind, *rules;
  size_t out_length = 0, capacity, count, slots, included = 0, slice_count = 0, total = 0, i, k;
  int32_t pairs = 0;

  if(!args_load(&a, env, info, 8)) {
    return NULL;
  }
  n = args_int(&a, 0);
  limit = args_int(&a, 3);
  width = args_num(&a, 4);
  type_count = args_int(&a, 6);
  if(a.failed) {
    return NULL;
  }
  if(n < 0 || limit < 0 || limit > 1000000 || type_count < 1 || type_count > 254 || !(width > 0)) {
    return args_fail(&a, "bad collide arguments");
  }
  count = (size_t)n;
  geo = args_f64(&a, 1, count * GEO_STRIDE, NULL);
  kind = args_u8(&a, 2, count * 2, NULL);
  rules = args_u8(&a, 5, (size_t)type_count * (size_t)type_count, NULL);
  out = args_f64(&a, 7, 0, &out_length);
  if(a.failed) {
    return NULL;
  }
  capacity = out_length / PAIR_STRIDE;
  slots = (size_t)limit * 2;
  base = 1 - limit;
  inv = 1.0 / width;

  if(!reserve(&m, count, slots)) {
    release(&m);
    return args_fail(&a, "out of memory");
  }

  for(i = 0; i < count; i++) {
    const double *g = geo + i * GEO_STRIDE;
    double x = g[0], y = g[1], w = g[2], h = g[3];
    double low = 1 + floor((x - w) * inv), high = 1 + floor((x + w) * inv);
    if(low > limit || high < base) {
      continue;
    }
    if(high > limit) {
      high = limit;
    }
    if(low < base) {
      low = base;
    }
    m.included[included] = (uint32_t)i;
    m.keys[included] = y - h;
    if(low == low && high == high) {
      m.low[included] = (int32_t)low;
      m.high[included] = (int32_t)high;
    } else {
      m.low[included] = 1;
      m.high[included] = 0;
    }
    included++;
  }

  sort_indices(m.order, m.work, included, m.keys);

  for(k = 0; k < included; k++) {
    uint32_t j = m.order[k];
    uint32_t index = m.included[j];
    const double *g = geo + (size_t)index * GEO_STRIDE;
    double x = g[0], y = g[1], w = g[2], h = g[3];
    m.left[k] = x - w;
    m.right[k] = x + w;
    m.bottom[k] = y - h;
    m.top[k] = y + h;
    m.x[k] = x;
    m.y[k] = y;
    m.size[k] = g[4];
    m.type[k] = kind[(size_t)index * 2];
    if(m.type[k] != 255 && m.type[k] >= type_count) {
      m.type[k] = 255;
    }
    m.rect[k] = kind[(size_t)index * 2 + 1] ? 1 : 0;
    m.origin[k] = index;
    m.slice_min[k] = m.low[j];
    m.slice_max[k] = m.high[j];
    for(s = m.low[j]; s <= m.high[j]; s++) {
      int32_t id = s - base;
      if(!m.seen[id]) {
        m.seen[id] = 1;
        m.slice_order[slice_count++] = id;
      }
      m.starts[id + 1]++;
      total++;
    }
  }

  for(i = 0; i < slots; i++) {
    m.starts[i + 1] += m.starts[i];
    m.fill[i] = m.starts[i];
  }
  m.entries = malloc((total ? total : 1) * sizeof(uint32_t));
  if(!m.entries) {
    release(&m);
    return args_fail(&a, "out of memory");
  }
  for(k = 0; k < included; k++) {
    for(s = m.slice_min[k]; s <= m.slice_max[k]; s++) {
      m.entries[m.fill[s - base]++] = (uint32_t)k;
    }
  }

  for(i = 0; i < slice_count; i++) {
    int32_t id = m.slice_order[i];
    int32_t slice_id = id + base;
    const uint32_t *slice = m.entries + m.starts[id];
    int32_t last = m.starts[id + 1] - m.starts[id] - 1, p, u;
    if(last < 1) {
      continue;
    }
    for(p = 0; p < last; p++) {
      uint32_t first = slice[p];
      uint8_t type_a = m.type[first];
      double top, left, right;
      int32_t min_a;
      const uint8_t *row;
      if(type_a == 255) {
        continue;
      }
      top = m.top[first];
      left = m.left[first];
      right = m.right[first];
      min_a = m.slice_min[first];
      row = rules + (size_t)type_a * (size_t)type_count;
      for(u = p + 1; u <= last; u++) {
        uint32_t second = slice[u];
        uint8_t type_b;
        if(m.bottom[second] > top) {
          break;
        }
        if(right < m.left[second] || left > m.right[second]) {
          continue;
        }
        type_b = m.type[second];
        if(type_b == 255 || !row[type_b]) {
          continue;
        }
        if((min_a > m.slice_min[second] ? min_a : m.slice_min[second]) != slice_id) {
          continue;
        }
        if(m.rect[first] || m.rect[second]) {
          if(m.rect[first] != m.rect[second]) {
            if((size_t)pairs < capacity) {
              double *o = out + (size_t)pairs * PAIR_STRIDE;
              o[0] = m.origin[first];
              o[1] = m.origin[second];
              o[2] = 1;
              o[3] = 0;
              o[4] = 0;
              o[5] = 0;
              o[6] = 0;
            }
            pairs++;
          }
        } else {
          double dx = m.x[first] - m.x[second], dy = m.y[first] - m.y[second];
          double size = m.size[first] + m.size[second];
          double distance = dx * dx + dy * dy;
          if(distance < size * size) {
            if(dx == 0 && dy == 0) {
              dy = 1;
            }
            if((size_t)pairs < capacity) {
              double *o = out + (size_t)pairs * PAIR_STRIDE;
              o[0] = m.origin[first];
              o[1] = m.origin[second];
              o[2] = 0;
              o[3] = dx;
              o[4] = dy;
              o[5] = distance;
              o[6] = size;
            }
            pairs++;
          }
        }
      }
    }
  }

  release(&m);
  return result_int(env, pairs);
}
