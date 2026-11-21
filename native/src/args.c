#include <stdio.h>
#include "scenexe.h"

int args_load(args_t *a, napi_env env, napi_callback_info info, size_t need)
{
  a->env = env;
  a->argc = ARGS_MAX;
  a->failed = 0;
  if(napi_get_cb_info(env, info, &a->argc, a->argv, NULL, NULL) != napi_ok) {
    args_fail(a, "could not read arguments");
    return 0;
  }
  if(a->argc > ARGS_MAX) {
    a->argc = ARGS_MAX;
  }
  if(a->argc < need) {
    args_fail(a, "not enough arguments");
    return 0;
  }
  return 1;
}

napi_value args_fail(args_t *a, const char *message)
{
  if(!a->failed) {
    a->failed = 1;
    napi_throw_error(a->env, NULL, message);
  }
  return NULL;
}

static void *typed(args_t *a, size_t index, napi_typedarray_type want, size_t need, size_t *length)
{
  napi_typedarray_type type;
  size_t count = 0, offset = 0;
  void *data = NULL;
  napi_value buffer;
  char message[96];
  if(a->failed) {
    return NULL;
  }
  if(index >= a->argc || napi_get_typedarray_info(a->env, a->argv[index], &type, &count, &data, &buffer, &offset) != napi_ok || type != want) {
    snprintf(message, sizeof(message), "argument %d has the wrong array type", (int)index);
    args_fail(a, message);
    return NULL;
  }
  if(count < need) {
    snprintf(message, sizeof(message), "argument %d is too short", (int)index);
    args_fail(a, message);
    return NULL;
  }
  if(length) {
    *length = count;
  }
  return data;
}

double *args_f64(args_t *a, size_t index, size_t need, size_t *length)
{
  return (double *)typed(a, index, napi_float64_array, need, length);
}

int32_t *args_i32(args_t *a, size_t index, size_t need, size_t *length)
{
  return (int32_t *)typed(a, index, napi_int32_array, need, length);
}

uint8_t *args_u8(args_t *a, size_t index, size_t need, size_t *length)
{
  return (uint8_t *)typed(a, index, napi_uint8_array, need, length);
}

double args_num(args_t *a, size_t index)
{
  double value = 0;
  if(a->failed) {
    return 0;
  }
  if(index >= a->argc || napi_get_value_double(a->env, a->argv[index], &value) != napi_ok) {
    args_fail(a, "expected a number");
    return 0;
  }
  return value;
}

int32_t args_int(args_t *a, size_t index)
{
  int32_t value = 0;
  if(a->failed) {
    return 0;
  }
  if(index >= a->argc || napi_get_value_int32(a->env, a->argv[index], &value) != napi_ok) {
    args_fail(a, "expected an integer");
    return 0;
  }
  return value;
}

napi_value result_int(napi_env env, int32_t value)
{
  napi_value result = NULL;
  napi_create_int32(env, value, &result);
  return result;
}
