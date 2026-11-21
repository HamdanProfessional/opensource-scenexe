#include <string.h>
#include "scenexe.h"

static void merge(const uint32_t *source, uint32_t *target, size_t from, size_t middle, size_t to, sort_less less, const void *context)
{
  size_t left = from, right = middle, k;
  for(k = from; k < to; k++) {
    if(left < middle && (right >= to || !less(context, source[right], source[left]))) {
      target[k] = source[left++];
    } else {
      target[k] = source[right++];
    }
  }
}

static void merge_sort(uint32_t *source, size_t from, size_t to, uint32_t *target, sort_less less, const void *context)
{
  size_t middle = from + ((to - from) >> 1);
  if(middle - from > 1) {
    merge_sort(target, from, middle, source, less, context);
  }
  if(to - middle > 1) {
    merge_sort(target, middle, to, source, less, context);
  }
  merge(source, target, from, middle, to, less, context);
}

void sort_items(uint32_t *items, uint32_t *work, size_t count, sort_less less, const void *context)
{
  if(count > 1) {
    memcpy(work, items, count * sizeof(uint32_t));
    merge_sort(work, 0, count, items, less, context);
  }
}

static int key_less(const void *context, uint32_t a, uint32_t b)
{
  const double *keys = (const double *)context;
  return keys[a] < keys[b];
}

void sort_indices(uint32_t *result, uint32_t *work, size_t count, const double *keys)
{
  size_t i;
  for(i = 0; i < count; i++) {
    result[i] = (uint32_t)i;
  }
  sort_items(result, work, count, key_less, keys);
}
