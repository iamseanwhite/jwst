const { Worker, workerData, parentPort } = require('worker_threads');
const sp = require('../script_processor/sp_extensions');

console.log(workerData);

//based on the activity info...
sp.setCommandParameterValue("key1","someNewValue");
sp.sendCommand("key1");
