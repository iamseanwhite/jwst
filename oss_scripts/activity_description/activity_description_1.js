const path = require('path');
const { parentPort } = require('worker_threads');
const { CommandStatus } = require('../../script_processor/sp_app');
const sp = require('../../script_processor/sp_extensions');

// TODO: use values passed from visit files
sp.setCommandParameterValue("param_1", 1);
sp.sendCommand("param_1");

sp.setTelemetryParameter("param_1");
var param1Status = sp.getTelemetry(1); 

var timer = 0;
var telemetryCheck = setInterval(function() {
    if (param1Status == CommandStatus.Succeeded || param1Status == CommandStatus.Failed) {
        parentPort.postMessage([path.basename(__filename), param1Status]);
        clearInterval(telemetryCheck);        
    }
    else if (timer == 10){
        parentPort.postMessage([path.basename(__filename), CommandStatus.Failed]);      
        clearInterval(telemetryCheck);       
    }
    else {
        param1Status = sp.getTelemetry(1);
        timer +=.5;              
    }        
}, 500);