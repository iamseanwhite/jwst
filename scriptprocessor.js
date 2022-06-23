const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {                    
    const worker = new Worker('./oss_scripts/ope.js', { workerData: 'yo' });
    
    worker.on('message', console.log);
    worker.on('error', console.error);
    worker.on('exit', code => console.log('Worker exit: ', code));    
} 
else {
    const flightSoftware = require('./build/Release/flightsoftware');
    const fileSystem = require('fs'); 

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
    
    // Expose the extension methods to the OSS Scripts
    module.exports.getTime = getTime;
    module.exports.openFile = openFile;
    module.exports.readFile = readFile;
    module.exports.closeFile = closeFile;
}

