#include "scenexe.h"

static void merge(const uint32_t *source, uint32_t *target, size_t from, size_t middle, size_t to, const double *keys)
{
  size_t left = from, right = middle, k;
  for(k = from; k < to; k++) {
    if(left < middle && right >= to) {
      target[k] = source[left++];
    } else if(left < middle) {
      if(!(keys[source[left]] - keys[source[right]] > 0)) {
        target[k] = source[left++];
      } else {
        target[k] = source[right++];
      }
    } else {
      target[k] = source[right++];
    }
  }
}

static void merge_sort(uint32_t *source, size_t from, size_t to, uint32_t *target, const double *keys)
{
  size_t middle = from + ((to - from) >> 1);
  if(middle - from > 1) {
    merge_sort(target, from, middle, source, keys);
  }
  if(to - middle > 1) {
    merge_sort(target, middle, to, source, keys);
  }
  merge(source, target, from, middle, to, keys);
}

void sort_indices(uint32_t *result, uint32_t *work, size_t count, const double *keys)
{
  size_t i;
  for(i = 0; i < count; i++) {
    result[i] = (uint32_t)i;
    work[i] = (uint32_t)i;
  }
  if(count > 1) {
    merge_sort(work, 0, count, result, keys);
  }
}
