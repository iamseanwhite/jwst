const { Worker, isMainThread, parentPort } = require('worker_threads');
const sp_app = require('./sp_app');
const flightSoftware = sp_app.flightSoftware;
const fileSystem = sp_app.fileSystem;
const commandParameterDictionary = sp_app.commandParameterDictionary;

// Get the system time
var getTime = function () {
    return flightSoftware.getTime();
}
// Open a visit file
var openFile = function (visitFileName) {       
    return fileSystem.openSync(`../visit_files/${visitFileName}.vst`, 'r');
}
// Read a visit file
var readFile = function (visitFileName) {         
    return fileSystem.readFileSync(`../visit_files/${visitFileName}.vst`, { encoding: 'ascii' });
}
// Close a file
var closeFile = function (fd) {
    fileSystem.close(fd, (err) => {
        if (err) console.error(err);
      });
}
// Activate specified script in a separate execution thread
var processScript = function (fileName, activityInfo) {
    const worker = new Worker(`../oss_scripts/${fileName}`, { workerData: activityInfo });

    worker.on('message', console.log);
    worker.on('error', console.error);
    worker.on('exit', code => console.log(`${fileName} completed with code: `, code));  
}
// Construct one textual event message telemetry packet
var issueEventMessage = function (message) {
    //TODO: implement event logging
    console.log(message);
}
// Construct one command parameter field 
var setCommandParameterValue = function (key, value) {
    commandParameterDictionary[key] = value;
}
// Deliver constructed command to router 
var sendCommand = function(key) {
    //TODO: implement this in the flight software
    //return flightSoftware.sendCommand(key, commandParameterDictionary[key]);
    console.log(`${key} command sent`);
}

// Expose the extension methods to the OSS Scripts
module.exports.getTime = getTime;
module.exports.openFile = openFile;
module.exports.readFile = readFile;
module.exports.closeFile = closeFile;
module.exports.processScript = processScript;
module.exports.issueEventMessage = issueEventMessage;
module.exports.setCommandParameterValue = setCommandParameterValue;
module.exports.sendCommand = sendCommand;