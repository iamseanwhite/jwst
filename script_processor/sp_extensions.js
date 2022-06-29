const { Worker, isMainThread, parentPort } = require('worker_threads');
const sp_app = require('./sp_app');
const flightSoftware = sp_app.flightSoftware;
const fileSystem = sp_app.fileSystem;
const commandParameterDictionary = sp_app.commandParameterDictionary;
const telemetryItems = sp_app.telemetryItems;

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
    return new Promise((resolve, reject) => {
        const worker = new Worker(`../oss_scripts/activity_description/${fileName}`, { 
            workerData: activityInfo 
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
            console.log(`${fileName} completed with code: `, code);
        });
    }); 
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
    return flightSoftware.executeCommand(key, commandParameterDictionary[key]);
}

// Identify one engineering telemetry item
var setTelemetryParameter = function (telemetryItem) {
    // add the item to the list if it does not already exist
    if (!telemetryItems.some(x => x == telemetryItem)) 
        telemetryItems.push(telemetryItem);
    // maintain a list of ten previously identified items
    if (telemetryItems.length > 10) 
        telemetryItems.shift();
}

// Retrieve up to 10 previously identified telemetry items
var getTelemetry = function(numberOfItems) {
    var telem = flightSoftware.getTelemetry(numberOfItems);
    return telem;
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
module.exports.setTelemetryParameter = setTelemetryParameter;
module.exports.getTelemetry = getTelemetry;