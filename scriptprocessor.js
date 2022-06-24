const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {                    
    const worker = new Worker('./oss_scripts/ope.js', { workerData: 'yo' });
    
    worker.on('message', console.log);
    worker.on('error', console.error);
    worker.on('exit', code => console.log('OPE completed with code: ', code));    
} 
else {
    const flightSoftware = require('./build/Release/flightsoftware');
    const fileSystem = require('fs'); 
    var commandParameterDictionary = {"key1": "value1", "key2": "value2"};

    // Get the system time
    var getTime = function () {
        return flightSoftware.getTime();
    }
    // Open a visit file
    var openFile = function (visitFileName) {       
        return fileSystem.openSync(`./visit_files/${visitFileName}.vst`, 'r');
    }
    // Read a visit file
    var readFile = function (visitFileName) {         
        return fileSystem.readFileSync(`./visit_files/${visitFileName}.vst`, { encoding: 'ascii' });
    }
    // Close a file
    var closeFile = function (fd) {
        fileSystem.close(fd, (err) => {
            if (err) console.error(err);
          });
    }
    // Activate specified script in a separate execution thread
    var processScript = function (filePath, activityInfo) {
        const worker = new Worker(filePath, { workerData: activityInfo });
    
        worker.on('message', console.log);
        worker.on('error', console.error);
        worker.on('exit', code => console.log(`${filePath} completed with code: `, code));  
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
}

