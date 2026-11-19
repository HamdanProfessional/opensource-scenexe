#ifndef SCENEXE_H
#define SCENEXE_H

#include "napi.h"

#ifndef SCENEXE_VERSION
#define SCENEXE_VERSION 0
#endif

#define ARGS_MAX 16

typedef struct {
  napi_env env;
  napi_value argv[ARGS_MAX];
  size_t argc;
  int failed;
} args_t;

int args_load(args_t *a, napi_env env, napi_callback_info info, size_t need);
double *args_f64(args_t *a, size_t index, size_t need, size_t *length);
int32_t *args_i32(args_t *a, size_t index, size_t need, size_t *length);
uint8_t *args_u8(args_t *a, size_t index, size_t need, size_t *length);
double args_num(args_t *a, size_t index);
int32_t args_int(args_t *a, size_t index);
napi_value args_fail(args_t *a, const char *message);
napi_value result_int(napi_env env, int32_t value);

void sort_indices(uint32_t *result, uint32_t *work, size_t count, const double *keys);

napi_value js_collide(napi_env env, napi_callback_info info);
napi_value js_view(napi_env env, napi_callback_info info);
napi_value js_wake(napi_env env, napi_callback_info info);
napi_value js_pick(napi_env env, napi_callback_info info);
napi_value js_encode(napi_env env, napi_callback_info info);

#endif
