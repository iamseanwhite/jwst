var path = require('path');
const { Worker, workerData, parentPort } = require('worker_threads');
const sp = require('../../script_processor/sp_extensions');

sp.setTelemetryParameter("param_2");
var param2 = sp.getTelemetry(1);

//based on the activity info...
sp.setCommandParameterValue("param_2", 2);

sp.sendCommand("param_2");

var telemetryCheck = setInterval(function() {
    if(param2 != 1) {
        param2 = sp.getTelemetry(1);        
    }
    else {
        parentPort.postMessage(`${path.basename(__filename)}: Telemetry OK`);
        clearInterval(telemetryCheck);
    }
}, 1000);