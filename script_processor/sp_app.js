const { Worker, isMainThread } = require('worker_threads');
const fileSystem = require('fs'); 
const flightSoftware = require('../build/Release/flightsoftware');
   
var commandParameterDictionary = {"param_1": 0, "param_2": 0};
var telemetryItems = [];
const CommandStatus = Object.freeze({
    Idle: 0, 
    Processing: 1, 
    Succeeded: 3, 
    Failed: 4
});

if (isMainThread) { 
    const worker = new Worker('../oss_scripts/ope.js');

    worker.on('message', console.log);
    worker.on('error', console.error);
    worker.on('exit', code => console.log('Observation Plan is empty. OPE completed with code: ', code, '\n'));    
} 
else {}
 
module.exports.flightSoftware = flightSoftware;
module.exports.fileSystem = fileSystem;
module.exports.commandParameterDictionary = commandParameterDictionary;
module.exports.telemetryItems = telemetryItems;
module.exports.CommandStatus = CommandStatus;

