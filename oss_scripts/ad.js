const { Worker, workerData, parentPort } = require('worker_threads');
const sp = require('../script_processor/sp_extensions');

//issue event message
var message = `Activity Descripton script activated at ${new Date(sp.getTime())}`;
sp.issueEventMessage(message);

sp.setTelemetryParameter("param_1");
var param1 = sp.getTelemetry(1);

console.log(`param1: ${param1}`);

//based on the activity info...
sp.setCommandParameterValue("param_1", 1);
console.log("parameter set");

sp.sendCommand("param_1");
console.log("command sent");

var telemetryCheck = setInterval(function() {
    if(param1 != 1) {
        param1 = sp.getTelemetry(1);
        parentPort.postMessage(`param1: ${param1}`);
    }
    else 
        clearInterval(telemetryCheck);
}, 1000);


