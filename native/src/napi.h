#ifndef SCENEXE_NAPI_H
#define SCENEXE_NAPI_H

#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>

#ifdef _WIN32
#define NAPI_IMPORT __declspec(dllimport)
#define MODULE_EXPORT __declspec(dllexport)
#else
#define NAPI_IMPORT
#define MODULE_EXPORT __attribute__((visibility("default")))
#endif

typedef struct napi_env__ *napi_env;
typedef struct napi_value__ *napi_value;
typedef struct napi_callback_info__ *napi_callback_info;
typedef napi_value (*napi_callback)(napi_env env, napi_callback_info info);
typedef int napi_status;

#define napi_ok 0

typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array
} napi_typedarray_type;

NAPI_IMPORT napi_status napi_get_cb_info(napi_env env, napi_callback_info info, size_t *argc, napi_value *argv, napi_value *this_arg, void **data);
NAPI_IMPORT napi_status napi_get_typedarray_info(napi_env env, napi_value typedarray, napi_typedarray_type *type, size_t *length, void **data, napi_value *arraybuffer, size_t *byte_offset);
NAPI_IMPORT napi_status napi_get_value_double(napi_env env, napi_value value, double *result);
NAPI_IMPORT napi_status napi_get_value_int32(napi_env env, napi_value value, int32_t *result);
NAPI_IMPORT napi_status napi_create_int32(napi_env env, int32_t value, napi_value *result);
NAPI_IMPORT napi_status napi_create_function(napi_env env, const char *name, size_t length, napi_callback cb, void *data, napi_value *result);
NAPI_IMPORT napi_status napi_set_named_property(napi_env env, napi_value object, const char *name, napi_value value);
NAPI_IMPORT napi_status napi_throw_error(napi_env env, const char *code, const char *message);

#endif
