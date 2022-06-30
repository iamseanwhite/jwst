//#!/usr/bin/env node
const { workerData, parentPort } = require('worker_threads');
const sp = require('../script_processor/sp_extensions');
const util = require('./util');

var currentVisit, nextVisit = {};
var observationPlan = [
    {name: "V001", begin: '2022-181/2:41:00', end: '2022-188/02:38:10', cutoff: '2022-174/03:30:44'},
    {name: "V002", begin: '2022-181/3:12:00', end: '2022-188/02:55:44', cutoff: '2022-168/23:53:44'}
];


var processVisit = function () {        
    // Wait for the next visit window to begin   
    nextVisit = observationPlan[0];
    var systemTime = sp.getTime();        
    var beginTime = util.parseJulianTimeStamp(nextVisit.begin);
    var endTime = util.parseJulianTimeStamp(nextVisit.end);    
        
    if (beginTime <= systemTime && systemTime < endTime) {
        console.log(`Starting vitit ${nextVisit.name}...`);

        currentVisit = nextVisit;
        var isVisitComplete = false;   

        // Open file
        var fileDescriptor = sp.openFile(currentVisit.name); 

        // Read file
        var fileData = sp.readFile(currentVisit.name);

        // Close file
        sp.closeFile(fileDescriptor);

        // TODO: parse this data out of the visit file
        var activities = [
            {script: "activity_description_1.js", parameters:[{key: "param_1", value: 1}]},
            {script: "activity_description_2.js", parameters:[{key: "param_2", value: 2}]}
        ];
        
        // Process sequences of an activity group in parallel 
        var promises = [];
        for (var i = 0; i < activities.length; i++) {
            //  event message
            var message = `${activities[i].script} activated at ${util.formatDate(sp.getTime())}`;
            sp.issueEventMessage(message);
            //process scripts
            promises.push(sp.processScript(activities[i].script, activities[i].parameters));
        }
                
        // return results for all activities (script processor's "getSharedParameter")
        Promise.all(promises).then(results => {            
            console.log("Activity Description scripts results:");
            results.forEach(result => console.log(`${result}`));        
            isVisitComplete = true;
        });

        // Wait for all activities to complete (script processor's "wait")       
        (function wait () {
            if(isVisitComplete) {
                console.log(`Visit ${currentVisit.name} Complete`);        
                // Remove the visit from the observation plan
                observationPlan.shift();
                if (observationPlan.length > 0)
                    processVisit();
                else return;
            }
            else setTimeout(wait, 1000);                          
        })();                        
    }
    else {
        console.log(`Waiting for next visit window to begin...`);
        setTimeout(processVisit, 1000);          
    }     
}
processVisit();