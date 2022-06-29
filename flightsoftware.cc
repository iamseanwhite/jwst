#include <node.h>
#include <chrono>
#include <iostream>

using namespace v8;

int param_1, param_2, param3 = 0;

// Retrieve system time as ms since epoch in UTC
void GetTime(const FunctionCallbackInfo<Value>& args) {
  auto now = std::chrono::system_clock::now();
  std::time_t currentTime = std::chrono::system_clock::to_time_t(now);
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(Number::New(isolate, currentTime * 1000));
}

// Execute Command
void ExecuteCommand(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();  
  // TODO: asynchronously simulate the time taken to execute the command
  //sleep(5);
  param_1 = args[1].As<Number>()->Value();
  std::string message = "param_1: " + std::to_string(param_1);
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, message.c_str()).ToLocalChecked());
}

// Get Telemetry
void GetTelemetry(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  // TODO: pass param and target value, return status
  //std::string message = "param_1: " + std::to_string(param_1);
  args.GetReturnValue().Set(param_1);
}

NODE_MODULE_INIT() {
  Isolate* isolate = context->GetIsolate();

  exports->Set(context,
               String::NewFromUtf8(isolate, "getTime").ToLocalChecked(),
               FunctionTemplate::New(isolate, GetTime)->GetFunction(context).ToLocalChecked()
              ).FromJust();
  exports->Set(context,
               String::NewFromUtf8(isolate, "executeCommand").ToLocalChecked(),
               FunctionTemplate::New(isolate, ExecuteCommand)->GetFunction(context).ToLocalChecked()
              ).FromJust();
  exports->Set(context,
               String::NewFromUtf8(isolate, "getTelemetry").ToLocalChecked(),
               FunctionTemplate::New(isolate, GetTelemetry)->GetFunction(context).ToLocalChecked()
              ).FromJust();
}