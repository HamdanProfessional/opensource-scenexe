#include <math.h>
#include <stdlib.h>
#include <string.h>
#include "scenexe.h"

#define WIRE 12
#define LEVELS 3

typedef struct {
  uint8_t *data;
  size_t capacity;
  size_t length;
} writer_t;

typedef struct {
  int32_t parent;
  int32_t first;
  double key;
  double value;
} group_t;

typedef struct {
  const double *order;
  int levels;
} sort_context_t;

static void put(writer_t *w, uint8_t byte)
{
  if(w->length < w->capacity) {
    w->data[w->length] = byte;
  }
  w->length++;
}

static void put_be(writer_t *w, uint64_t value, int bytes)
{
  int i;
  for(i = bytes - 1; i >= 0; i--) {
    put(w, (uint8_t)(value >> (i * 8)));
  }
}

static void put_array(writer_t *w, size_t count)
{
  if(count < 16) {
    put(w, (uint8_t)(0x90 | count));
  } else if(count < 0x10000) {
    put(w, 0xdc);
    put_be(w, count, 2);
  } else {
    put(w, 0xdd);
    put_be(w, count, 4);
  }
}

static void put_number(writer_t *w, double value)
{
  if(value >= 0 && value <= 4294967295.0 && value == floor(value)) {
    uint32_t u = (uint32_t)value;
    if(u < 0x80) {
      put(w, (uint8_t)u);
    } else if(u < 0x100) {
      put(w, 0xcc);
      put(w, (uint8_t)u);
    } else if(u < 0x10000) {
      put(w, 0xcd);
      put_be(w, u, 2);
    } else {
      put(w, 0xce);
      put_be(w, u, 4);
    }
  } else if(value < 0 && value >= -2147483648.0 && value == floor(value)) {
    int32_t s = (int32_t)value;
    if(s >= -0x20) {
      put(w, (uint8_t)(0x100 + s));
    } else if(s >= -0x80) {
      put(w, 0xd0);
      put(w, (uint8_t)(s + 0x100));
    } else if(s >= -0x8000) {
      put(w, 0xd1);
      put_be(w, (uint16_t)(int16_t)s, 2);
    } else {
      put(w, 0xd2);
      put_be(w, (uint32_t)s, 4);
    }
  } else {
    uint64_t bits;
    memcpy(&bits, &value, sizeof bits);
    put(w, 0xcb);
    put_be(w, bits, 8);
  }
}

static double normal_key(double key)
{
  if(key == 0) {
    return 0;
  }
  return key;
}

static int same_key(double a, double b)
{
  return a == b || (a != a && b != b);
}

static uint32_t hash_group(int32_t parent, double key)
{
  uint64_t bits;
  if(key != key) {
    bits = 0x7ff8000000000000ULL;
  } else {
    memcpy(&bits, &key, sizeof bits);
  }
  bits ^= (uint64_t)(uint32_t)parent * 0x9e3779b97f4a7c15ULL;
  bits ^= bits >> 33;
  bits *= 0xff51afd7ed558ccdULL;
  bits ^= bits >> 33;
  bits *= 0xc4ceb9fe1a85ec53ULL;
  bits ^= bits >> 33;
  return (uint32_t)bits;
}

static int32_t group_of(int32_t *table, uint32_t mask, group_t *groups, int32_t *group_count, int32_t parent, double value, int32_t position)
{
  double key = normal_key(value);
  uint32_t slot = hash_group(parent, key) & mask;
  for(;;) {
    int32_t at = table[slot];
    if(at == 0) {
      group_t *g = groups + *group_count;
      g->parent = parent;
      g->first = position;
      g->key = key;
      g->value = value;
      table[slot] = ++*group_count;
      return *group_count - 1;
    }
    if(groups[at - 1].parent == parent && same_key(groups[at - 1].key, key)) {
      return at - 1;
    }
    slot = (slot + 1) & mask;
  }
}

static double order_key(const group_t *g)
{
  double key = g->key;
  if(key >= 0 && key <= 4294967294.0 && key == floor(key)) {
    return key;
  }
  return 4294967296.0 + (double)g->first;
}

static int compare(const sort_context_t *context, int32_t a, int32_t b)
{
  int level;
  for(level = 0; level < context->levels; level++) {
    double x = context->order[(size_t)a * LEVELS + level], y = context->order[(size_t)b * LEVELS + level];
    if(x < y) {
      return -1;
    }
    if(x > y) {
      return 1;
    }
  }
  return a < b ? -1 : a > b;
}

static void merge_sort(int32_t *items, int32_t *work, size_t count, const sort_context_t *context)
{
  size_t width, i;
  int32_t *source = items, *target = work, *swap;
  for(width = 1; width < count; width *= 2) {
    for(i = 0; i < count; i += 2 * width) {
      size_t left = i, middle = i + width < count ? i + width : count, end = i + 2 * width < count ? i + 2 * width : count;
      size_t right = middle, k = i;
      while(left < middle && right < end) {
        if(compare(context, source[right], source[left]) < 0) {
          target[k++] = source[right++];
        } else {
          target[k++] = source[left++];
        }
      }
      while(left < middle) {
        target[k++] = source[left++];
      }
      while(right < end) {
        target[k++] = source[right++];
      }
    }
    swap = source;
    source = target;
    target = swap;
  }
  if(source != items) {
    memcpy(items, source, count * sizeof(int32_t));
  }
}

static void put_bullet(writer_t *w, const double *row, const double *turrets)
{
  int i, turret_count = row[9] >= 0 ? (int)row[9] : -1;
  put_array(w, turret_count >= 0 ? 8 : 7);
  for(i = 2; i <= 8; i++) {
    put_number(w, row[i]);
  }
  if(turret_count >= 0) {
    const double *list = turrets + (size_t)row[10];
    put_array(w, (size_t)turret_count);
    for(i = 0; i < turret_count; i++) {
      put_number(w, list[i]);
    }
  }
}

static void put_polygon(writer_t *w, const double *row)
{
  int i;
  put_array(w, 8);
  for(i = 2; i <= 9; i++) {
    put_number(w, row[i]);
  }
}

static size_t run_end(const int32_t *items, const int32_t *group, size_t from, size_t count)
{
  size_t end = from + 1;
  while(end < count && group[items[end]] == group[items[from]]) {
    end++;
  }
  return end;
}

napi_value js_encode(napi_env env, napi_callback_info info)
{
  args_t a;
  int32_t kind, count, *rows, group_count = 0, *table = NULL, *items, *work, *level_group[LEVELS];
  double *wire, *turrets, *order;
  uint8_t *out;
  size_t wire_length, turret_length, out_length, capacity = 2, i, block;
  int levels;
  group_t *groups;
  char *memory;
  writer_t w;
  sort_context_t context;

  if(!args_load(&a, env, info, 6)) {
    return NULL;
  }
  kind = args_int(&a, 0);
  count = args_int(&a, 1);
  if(a.failed) {
    return NULL;
  }
  if((kind != 1 && kind != 2) || count < 0 || count > (1 << 24)) {
    return args_fail(&a, "bad encode arguments");
  }
  rows = args_i32(&a, 2, (size_t)count, NULL);
  wire = args_f64(&a, 3, 0, &wire_length);
  turrets = args_f64(&a, 4, 0, &turret_length);
  out = args_u8(&a, 5, 0, &out_length);
  if(a.failed) {
    return NULL;
  }
  for(i = 0; i < (size_t)count; i++) {
    const double *row;
    if(rows[i] < 0 || ((size_t)rows[i] + 1) * WIRE > wire_length) {
      return args_fail(&a, "encode row is out of range");
    }
    row = wire + (size_t)rows[i] * WIRE;
    if(kind == 1 && row[9] >= 0) {
      if(row[9] != floor(row[9]) || row[10] < 0 || row[10] != floor(row[10]) || row[9] > 65535 || row[10] + row[9] > (double)turret_length) {
        return args_fail(&a, "encode turret list is out of range");
      }
    }
  }

  levels = kind == 1 ? 2 : 3;
  while(capacity < (size_t)count * levels * 2) {
    capacity *= 2;
  }
  block = capacity * sizeof(int32_t) + (size_t)count * levels * sizeof(group_t) + (size_t)count * LEVELS * sizeof(double) + (size_t)count * (2 + LEVELS) * sizeof(int32_t);
  memory = (char *)malloc(block > 0 ? block : 1);
  if(!memory) {
    return args_fail(&a, "out of memory");
  }
  table = (int32_t *)memory;
  groups = (group_t *)(memory + capacity * sizeof(int32_t));
  order = (double *)((char *)groups + (size_t)count * levels * sizeof(group_t));
  items = (int32_t *)((char *)order + (size_t)count * LEVELS * sizeof(double));
  work = items + count;
  level_group[0] = work + count;
  level_group[1] = level_group[0] + count;
  level_group[2] = level_group[1] + count;
  memset(table, 0, capacity * sizeof(int32_t));

  for(i = 0; i < (size_t)count; i++) {
    const double *row = wire + (size_t)rows[i] * WIRE;
    int32_t parent = -1;
    int level;
    for(level = 0; level < levels; level++) {
      int32_t g = group_of(table, (uint32_t)(capacity - 1), groups, &group_count, parent, row[level], (int32_t)i);
      level_group[level][i] = g;
      order[i * LEVELS + level] = order_key(groups + g);
      parent = g;
    }
    items[i] = (int32_t)i;
  }
  context.order = order;
  context.levels = levels;
  merge_sort(items, work, (size_t)count, &context);

  w.data = out;
  w.capacity = out_length;
  w.length = 0;
  {
    size_t top = 0, p, b, e;
    for(p = 0; p < (size_t)count; p = run_end(items, level_group[0], p, (size_t)count)) {
      top++;
    }
    put_array(&w, 1 + top);
    put_number(&w, kind == 1 ? 3 : 4);
    for(p = 0; p < (size_t)count;) {
      size_t p_end = run_end(items, level_group[0], p, (size_t)count), middle = 0;
      for(b = p; b < p_end; b = run_end(items, level_group[1], b, p_end)) {
        middle++;
      }
      put_array(&w, 1 + middle);
      put_number(&w, groups[level_group[0][items[p]]].value);
      for(b = p; b < p_end;) {
        size_t b_end = run_end(items, level_group[1], b, p_end), entries = 0;
        if(kind == 1) {
          entries = b_end - b;
        } else {
          for(e = b; e < b_end; e = run_end(items, level_group[2], e, b_end)) {
            entries++;
          }
        }
        put_array(&w, 1 + entries);
        put_number(&w, groups[level_group[1][items[b]]].value);
        if(kind == 1) {
          for(e = b; e < b_end; e++) {
            put_bullet(&w, wire + (size_t)rows[items[e]] * WIRE, turrets);
          }
        } else {
          for(e = b; e < b_end;) {
            size_t e_end = run_end(items, level_group[2], e, b_end);
            put_polygon(&w, wire + (size_t)rows[items[e_end - 1]] * WIRE);
            e = e_end;
          }
        }
        b = b_end;
      }
      p = p_end;
    }
  }
  free(memory);
  if(w.length > 0x7fffffff) {
    return args_fail(&a, "encoded section is too large");
  }
  return result_int(env, (int32_t)w.length);
}
