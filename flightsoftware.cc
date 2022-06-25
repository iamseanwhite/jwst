#include <node.h>
#include <chrono>
#include <iostream>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

void GetTelemetry(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Returning telemetry...").ToLocalChecked());
}

//Retrieve system time as ms since epoch in UTC
void GetTime(const FunctionCallbackInfo<Value>& args) {
  auto now = std::chrono::system_clock::now();
  std::time_t currentTime = std::chrono::system_clock::to_time_t(now);
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(Number::New(isolate, currentTime * 1000));
}

NODE_MODULE_INIT() {
  Isolate* isolate = context->GetIsolate();
  AddonData* data = new AddonData(isolate);
  Local<External> external = External::New(isolate, data);

  exports->Set(context,
               String::NewFromUtf8(isolate, "getTelemetry").ToLocalChecked(),
               FunctionTemplate::New(isolate, GetTelemetry, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
  exports->Set(context,
              String::NewFromUtf8(isolate, "getTime").ToLocalChecked(),
              FunctionTemplate::New(isolate, GetTime, external)
                ->GetFunction(context).ToLocalChecked()).FromJust();
}
