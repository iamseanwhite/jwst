const sp = require('../script_processor/sp_extensions');
const util = require('./util');

var currentVisit, nextVisit = {};
var observationPlan = [];

var now = Date.now();

// Guarantee visits are soon to begin upon running script
observationPlan.push({name: "V001", begin: util.convertToJulianTimeStamp(now + 5000), end: util.convertToJulianTimeStamp(now + 10000), cutoff: '2022-174/03:30:44'});
observationPlan.push({name: "V002", begin: util.convertToJulianTimeStamp(now + 15000), end: util.convertToJulianTimeStamp(now + 20000), cutoff: '2022-168/23:53:44'});
observationPlan.push({name: "V003", begin: util.convertToJulianTimeStamp(now + 10000), end: util.convertToJulianTimeStamp(now + 35000), cutoff: '2022-168/23:53:44'});
observationPlan.push({name: "V004", begin: util.convertToJulianTimeStamp(now), end: util.convertToJulianTimeStamp(now + 5000), cutoff: '2022-168/23:53:44'});

var processVisit = function () {        
    // Wait for the next visit window to begin   
    nextVisit = observationPlan[0];
    var systemTime = sp.getTime();        
    var beginTime = util.parseJulianTimeStamp(nextVisit.begin);
    var endTime = util.parseJulianTimeStamp(nextVisit.end);    
        
    if (beginTime <= systemTime) {
        if (systemTime < endTime) {
            console.log(`\n    Starting visit ${nextVisit.name}...`);

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
                // event message
                var message = `${activities[i].script} activated at ${util.formatDate(sp.getTime())}`;
                sp.issueEventMessage(message);
                // process scripts
                promises.push(sp.processScript(activities[i].script, activities[i].parameters));
            }
                    
            // return results for all activities (script processor's "getSharedParameter")
            Promise.all(promises).then(results => {            
                //console.log("Activity Description scripts results:");
                results.forEach(result => console.log(`${result}`));        
                isVisitComplete = true;
            });

            // Wait for all activities to complete (script processor's "wait")       
            (function wait () {                
                if(isVisitComplete) {
                    console.log(`    Visit ${currentVisit.name} Complete`);        
                    // Remove the visit from the observation plan
                    observationPlan.shift();
                    if (observationPlan.length > 0)
                        processVisit();
                    else return;
                }
                else  {
                    console.log(`Waiting for commands to complete...`);        
                    setTimeout(wait, 2000);     
                }                     
            })();                        
        }
        else {
            console.log(`\n${nextVisit.name} Visit window has past. Removing from observation plan...\n`);
            observationPlan.shift();
            if (observationPlan.length > 0)
                processVisit();
            else return;      
        }        
    }
    else {
        console.log(`\nWaiting for next visit window to begin...`);
        setTimeout(processVisit, 3000);          
    }     
}
processVisit();