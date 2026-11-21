#include <math.h>
#include <string.h>
#include "scenexe.h"

#define ROW 12
#define ENTRY 14
#define PI 3.14159265358979323846

static uint32_t hash_id(double id)
{
  uint64_t bits;
  if(id == 0) {
    id = 0;
  }
  memcpy(&bits, &id, sizeof bits);
  return (uint32_t)mix64(bits);
}

static int32_t find(const int32_t *index, uint32_t mask, const double *entries, int32_t count, double id)
{
  uint32_t slot = hash_id(id) & mask, probes = 0;
  for(;;) {
    int32_t value = index[slot];
    if(value <= 0 || value > count) {
      return -1;
    }
    if(entries[(size_t)(value - 1) * ENTRY] == id) {
      return value - 1;
    }
    slot = (slot + 1) & mask;
    if(++probes > mask) {
      return -1;
    }
  }
}

static void insert(int32_t *index, uint32_t mask, double id, int32_t position)
{
  uint32_t slot = hash_id(id) & mask;
  while(index[slot] != 0) {
    slot = (slot + 1) & mask;
  }
  index[slot] = position + 1;
}

static void fill(double *entry, const double *row, double seq)
{
  entry[0] = row[0];
  entry[1] = row[1];
  entry[2] = row[2];
  entry[3] = row[3];
  entry[4] = seq;
  entry[5] = seq;
  entry[6] = row[4];
  memcpy(entry + 7, row + 5, 7 * sizeof(double));
}

static int predicted(const double *k, const double *row, double seq, double keyframe, double seq_time)
{
  const double *m = row + 5;
  double t, ex, ey, ed;
  if(k[6] == 0 || row[4] == 0 || seq - k[4] >= keyframe) {
    return 0;
  }
  t = (seq - k[4]) * seq_time;
  ex = k[7] + k[10] * t - m[0];
  ey = k[8] + k[11] * t - m[1];
  ed = fmod(k[9] + k[12] * t - m[2], 2 * PI);
  if(ed > PI) {
    ed -= 2 * PI;
  } else if(ed < -PI) {
    ed += 2 * PI;
  }
  return ex * ex + ey * ey < 9 && fabs(ed) < 0.03;
}

static int power_of_two(size_t value)
{
  return value > 0 && (value & (value - 1)) == 0;
}

static int overlaps(const void *a, size_t a_size, const void *b, size_t b_size)
{
  const char *x = (const char *)a, *y = (const char *)b;
  if(a_size == 0 || b_size == 0) {
    return 0;
  }
  return x < y + b_size && y < x + a_size;
}

napi_value js_pick(napi_env env, napi_callback_info info)
{
  args_t a;
  int32_t count, old_count, fresh = 0, survivors = 0, sent = 0, removed_count = 0, total, c, i, j;
  int32_t *candidates, *old_index, *new_index, *out, *state;
  double *table, *old_entries, *new_entries, *removed, seq, keyframe, seq_time;
  size_t table_length, old_index_length, old_entries_length, new_index_length, new_entries_length, removed_length;
  uint32_t old_mask, new_mask;

  if(!args_load(&a, env, info, 13)) {
    return NULL;
  }
  count = args_int(&a, 0);
  seq = args_num(&a, 7);
  keyframe = args_num(&a, 8);
  seq_time = args_num(&a, 9);
  if(count < 0) {
    return args_fail(&a, "bad pick count");
  }
  candidates = args_i32(&a, 1, (size_t)count, NULL);
  table = args_f64(&a, 2, 0, &table_length);
  old_index = args_i32(&a, 3, 0, &old_index_length);
  old_entries = args_f64(&a, 4, 0, &old_entries_length);
  new_index = args_i32(&a, 5, 0, &new_index_length);
  new_entries = args_f64(&a, 6, (size_t)count * ENTRY, &new_entries_length);
  out = args_i32(&a, 10, (size_t)count, NULL);
  removed = args_f64(&a, 11, 0, &removed_length);
  state = args_i32(&a, 12, 4, NULL);
  if(a.failed) {
    return NULL;
  }
  old_count = state[0];
  if(old_count < 0 || (size_t)old_count * ENTRY > old_entries_length) {
    return args_fail(&a, "bad pick table size");
  }
  if(old_count > 0 && (!power_of_two(old_index_length) || old_index_length <= (size_t)old_count)) {
    return args_fail(&a, "bad pick table index");
  }
  if(!power_of_two(new_index_length) || new_index_length < (size_t)count * 2) {
    return args_fail(&a, "pick index is too small");
  }
  if(removed_length < (size_t)count + (size_t)old_count) {
    return args_fail(&a, "pick removed list is too small");
  }
  if(overlaps(old_entries, old_entries_length * sizeof(double), new_entries, new_entries_length * sizeof(double)) ||
     overlaps(old_index, old_index_length * sizeof(int32_t), new_index, new_index_length * sizeof(int32_t))) {
    return args_fail(&a, "pick tables share memory");
  }
  for(c = 0; c < count; c++) {
    if(candidates[c] < 0 || ((size_t)candidates[c] + 1) * ROW > table_length) {
      return args_fail(&a, "pick row is out of range");
    }
  }

  old_mask = old_count > 0 ? (uint32_t)(old_index_length - 1) : 0;
  new_mask = (uint32_t)(new_index_length - 1);
  memset(new_index, 0, new_index_length * sizeof(int32_t));

  for(c = 0; c < count; c++) {
    const double *row = table + (size_t)candidates[c] * ROW;
    double id = row[0];
    double *k = NULL;
    int32_t at = old_count > 0 ? find(old_index, old_mask, old_entries, old_count, id) : -1;
    int forced;
    if(at >= 0) {
      k = old_entries + (size_t)at * ENTRY;
      k[5] = seq;
    } else {
      at = find(new_index, new_mask, new_entries, fresh, id);
      if(at >= 0) {
        k = new_entries + (size_t)at * ENTRY;
      }
    }
    if(k && k[1] != row[1]) {
      removed[removed_count++] = id;
      fill(k, row, seq);
      out[sent++] = c;
      continue;
    }
    if(!k) {
      k = new_entries + (size_t)fresh * ENTRY;
      fill(k, row, seq);
      insert(new_index, new_mask, id, fresh);
      fresh++;
      out[sent++] = c;
      continue;
    }
    forced = row[2] > k[2] || row[3] != k[3];
    k[2] = row[2];
    k[3] = row[3];
    if(!forced && predicted(k, row, seq, keyframe, seq_time)) {
      continue;
    }
    k[6] = row[4];
    memcpy(k + 7, row + 5, 7 * sizeof(double));
    k[4] = seq;
    out[sent++] = c;
  }

  for(i = 0; i < old_count; i++) {
    if(old_entries[(size_t)i * ENTRY + 5] == seq) {
      survivors++;
    }
  }
  total = survivors + fresh;
  if(total > count) {
    return args_fail(&a, "pick table overflow");
  }
  if(fresh > 0 && survivors > 0) {
    memmove(new_entries + (size_t)survivors * ENTRY, new_entries, (size_t)fresh * ENTRY * sizeof(double));
  }
  for(i = 0, j = 0; i < old_count; i++) {
    const double *entry = old_entries + (size_t)i * ENTRY;
    if(entry[5] == seq) {
      memcpy(new_entries + (size_t)j * ENTRY, entry, ENTRY * sizeof(double));
      j++;
    } else {
      removed[removed_count++] = entry[0];
    }
  }
  memset(new_index, 0, new_index_length * sizeof(int32_t));
  for(i = 0; i < total; i++) {
    insert(new_index, new_mask, new_entries[(size_t)i * ENTRY], i);
  }
  state[1] = sent;
  state[2] = removed_count;
  state[3] = total;
  return result_int(env, sent);
}
