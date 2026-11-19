#include <string.h>
#include "scenexe.h"

static void define(napi_env env, napi_value exports, const char *name, napi_callback fn)
{
  napi_value value;
  if(napi_create_function(env, name, strlen(name), fn, NULL, &value) == napi_ok) {
    napi_set_named_property(env, exports, name, value);
  }
}

MODULE_EXPORT napi_value napi_register_module_v1(napi_env env, napi_value exports)
{
  napi_value version;
  define(env, exports, "collide", js_collide);
  define(env, exports, "view", js_view);
  define(env, exports, "wake", js_wake);
  define(env, exports, "pick", js_pick);
  define(env, exports, "encode", js_encode);
  if(napi_create_int32(env, SCENEXE_VERSION, &version) == napi_ok) {
    napi_set_named_property(env, exports, "version", version);
  }
  return exports;
}
