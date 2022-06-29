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

    //close file
    sp.closeFile(fileDescriptor);

    //TODO: parse this data out of the visit file
    var activities = [
        {script: "activity_description_1.js", parameters:[{key: "param_1", value: 1}]},
        {script: "activity_description_2.js", parameters:[{key: "param_2", value: 2}]}
    ];
       
    //process sequences of an activity group in parallel 
    var promises = [];
    for (var i = 0; i < activities.length; i++) {
        //issue event message
        var message = `${activities[i].script} activated at ${util.formatDate(sp.getTime())}`;
        sp.issueEventMessage(message);
         //process scripts
        promises[i] = sp.processScript(activities[i].script, activities[i].parameters);
    }
        
    //wait, get shared parameter
    Promise.all(promises).then(results => {
        results.forEach(result => console.log(`${result}`));
    });    
}
else console.log("Not currently within visit window");