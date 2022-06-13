#include <node.h>

using namespace v8;

void GetTelemetry(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Returning telemetry...").ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "getTelemetry", GetTelemetry);
}

NODE_MODULE(scriptprocessor, Initialize)
