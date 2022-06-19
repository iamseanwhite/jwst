const { Worker, isMainThread } = require('worker_threads');
console.log("in common area");
if (isMainThread) {            
    console.log("in main thread");
            
    const worker = new Worker('./oss_scripts/ope.js', { workerData: 'yo' });
    
    worker.on('message', console.log);
    worker.on('error', console.error);
    worker.on('exit', code => console.log('Worker exit: ', code));    
} 
else {
    console.log("in worker thread");
    const fs = require('./build/Release/flightsoftware');
    
    var getTime = function () {
        console.log("in getTime");
        return fs.getTime();
    }
    module.exports.getTime = getTime;
}

