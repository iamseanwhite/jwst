#include <node.h>
#include <chrono>
#include <iostream>

using namespace v8;

void GetTelemetry(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Returning telemetry...").ToLocalChecked());
}

//Retrieve system time as ms since epoch incd ope UTC
void GetTime(const FunctionCallbackInfo<Value>& args) {
  auto now = std::chrono::system_clock::now();
  std::time_t currentTime = std::chrono::system_clock::to_time_t(now);
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(Number::New(isolate, currentTime * 1000));
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "getTelemetry", GetTelemetry);
  NODE_SET_METHOD(exports, "getTime", GetTime);
}

NODE_MODULE(flightsoftware, Initialize)
