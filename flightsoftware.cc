#include <node.h>
#include <chrono>
#include <iostream>
#include <thread>
#include <map>

using namespace v8;

enum CommandStatus { 
  Idle = 0, 
  Processing = 1, 
  Succeeded = 3, 
  Failed = 4
};

struct parameterInfo { 
  int value; 
  CommandStatus commandStatus; 
  
  parameterInfo() : value(0), commandStatus(CommandStatus::Idle) {}
};

// Maps a given parameter to its current value and command status
std::map<std::string, parameterInfo> parameterMap = {
  {"param_1", parameterInfo()},
  {"param_2", parameterInfo()},
  {"param_1", parameterInfo()}
};

// Sleep for a random amount of time
void SimulateExecutionTime() { 
  srand(time(NULL));
  std::this_thread::sleep_for(std::chrono::milliseconds(rand() % 8500 + 500));  
}

// Simulates success or failure of command
bool ShouldSucceed() {
  srand(time(NULL));
  return rand() % 10 > 3;
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
  // Parse parameter name
  Isolate* isolate = args.GetIsolate();  
  String::Utf8Value str(isolate, args[0]);
  std::string parameterName(*str);
  // Set the Commmand Status
  parameterMap[parameterName].commandStatus = CommandStatus::Processing;
  // Determine whether command should execute successfully
  bool shouldSucceed = ShouldSucceed();
    if (shouldSucceed) {
    // Simulate the time taken to execute the command
    SimulateExecutionTime();    
    // Execute the command and/or set the appropriate Command Status 
    parameterMap[parameterName].value = args[1].As<Number>()->Value();
    parameterMap[parameterName].commandStatus = CommandStatus::Succeeded;
  }
  else {
    parameterMap[parameterName].commandStatus = CommandStatus::Failed;
  }
}

// Get Telemetry
void GetTelemetry(const FunctionCallbackInfo<Value>& args) {
  // TODO: handle multiple parameters at once
  Isolate* isolate = args.GetIsolate();
  String::Utf8Value str(isolate, args[0]);
  std::string parameterName(*str);
  auto commandStatus = parameterMap[parameterName].commandStatus;
  args.GetReturnValue().Set(Number::New(isolate, commandStatus));
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