const { Worker, isMainThread } = require('worker_threads');
const fileSystem = require('fs'); 
const flightSoftware = require('../build/Release/flightsoftware');
   
var commandParameterDictionary = {"key1": "value1", "key2": "value2"};

if (isMainThread) {      
                              
    const worker = new Worker('../oss_scripts/ope.js', { workerData: 'yo' });

    worker.on('message', console.log);
    worker.on('error', console.error);
    worker.on('exit', code => console.log('OPE completed with code: ', code));    
} 
else {}
 
module.exports.flightSoftware = flightSoftware;
module.exports.fileSystem = fileSystem;
module.exports.commandParameterDictionary = commandParameterDictionary;
