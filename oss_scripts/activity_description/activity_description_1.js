var path = require('path');
const { Worker, workerData, parentPort } = require('worker_threads');
const sp = require('../../script_processor/sp_extensions');

sp.setTelemetryParameter("param_1");
var param1 = sp.getTelemetry(1);

//based on the activity info...
sp.setCommandParameterValue("param_1", 1);

sp.sendCommand("param_1");

var telemetryCheck = setInterval(function() {
    if(param1 != 1) {
        param1 = sp.getTelemetry(1);        
    }
    else {
        parentPort.postMessage(`${path.basename(__filename)}: Telemetry OK`);
        clearInterval(telemetryCheck);
    }
        
}, 1000);