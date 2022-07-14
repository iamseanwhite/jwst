#include <node.h>
#include <chrono>
#include <iostream>
#include <thread>
#include <map>

using namespace v8;

std::map<std::string,int> parameterMap = {{"param_1", 0}, {"param_2", 0}, {"param_1", 0}};

// Sleep for a random amount of time
void SimulateExecutionTime() {
  srand(time(NULL));
  std::this_thread::sleep_for(std::chrono::milliseconds(rand() % 8500 + 500));
}

// Retrieve system time as ms since epoch in UTC
void GetTime(const FunctionCallbackInfo<Value>& args) {
  auto now = std::chrono::system_clock::now();
  std::time_t currentTime = std::chrono::system_clock::to_time_t(now);
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(Number::New(isolate, currentTime * 1000));
}

// Execute Command
void ExecuteCommand(const FunctionCallbackInfo<Value>& args) {
  // Simulate the time taken to execute the command
  SimulateExecutionTime();
  // Execute the command
  Isolate* isolate = args.GetIsolate();  
  String::Utf8Value str(isolate, args[0]);
  std::string parameterName(*str);
  parameterMap[parameterName] = args[1].As<Number>()->Value();
}

// Get Telemetry
void GetTelemetry(const FunctionCallbackInfo<Value>& args) {
  // TODO: handle multiple parameters at once
  Isolate* isolate = args.GetIsolate();
  String::Utf8Value str(isolate, args[0]);
  std::string parameterName(*str);
  auto parameterValue = parameterMap[parameterName];
  args.GetReturnValue().Set(Number::New(isolate, parameterValue));
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