//#!/usr/bin/env node
const { workerData, parentPort } = require('worker_threads');
const sp = require('../script_processor/sp_extensions');
const util = require('./util');

var currentVisit;
var observationPlan = [
    {name: "V001", begin: '2022-174/00:01:00', end: '2022-188/03:38:10', cutoff: '2022-174/03:30:44'},
    {name: "V002", begin: '2022-167/23:53:44', end: '2022-168/02:55:44', cutoff: '2022-168/23:53:44'}
];

var nextVisit = observationPlan[0];

var systemTime = sp.getTime();

var beginTime = util.parseJulianTimeStamp(nextVisit.begin);
var endTime = util.parseJulianTimeStamp(nextVisit.end);

if (beginTime <= systemTime && systemTime < endTime) {
    
    console.log("Currently within visit window");

    currentVisit = nextVisit;

    //open file
    var fileDescriptor = sp.openFile(currentVisit.name); 

    //read file
    var fileData = sp.readFile(currentVisit.name);
    sp.closeFile(fileDescriptor);

    //issue event message
    var message = `Activity Descripton script activated at ${new Date(sp.getTime())}`;
    sp.issueEventMessage(message);

    //process script
    var promise = sp.processScript("ad.js", "activityInfo");

    //wait, get shared parameter
    Promise.all([promise]).then(results => {
        console.log(`${results[0]}`);
    })    
}
else console.log("Not currently within visit window");