#include <math.h>
#include "scenexe.h"

napi_value js_wake(napi_env env, napi_callback_info info)
{
  args_t a;
  int32_t n, wake_count, i, k;
  double *polygons, *wake;
  uint8_t *out;

  if(!args_load(&a, env, info, 5)) {
    return NULL;
  }
  n = args_int(&a, 0);
  wake_count = args_int(&a, 2);
  if(n < 0 || wake_count < 0) {
    return args_fail(&a, "bad wake arguments");
  }
  polygons = args_f64(&a, 1, (size_t)n * 3, NULL);
  wake = args_f64(&a, 3, (size_t)wake_count * 4, NULL);
  out = args_u8(&a, 4, (size_t)n, NULL);
  if(a.failed) {
    return NULL;
  }
  for(i = 0; i < n; i++) {
    const double *p = polygons + (size_t)i * 3;
    double x = p[0], y = p[1], size = p[2];
    uint8_t awake = 0;
    for(k = 0; k < wake_count; k++) {
      const double *w = wake + (size_t)k * 4;
      if(fabs(x - w[0]) < w[2] + size && fabs(y - w[1]) < w[3] + size) {
        awake = 1;
        break;
      }
    }
    out[i] = awake;
  }
  return result_int(env, n);
}
