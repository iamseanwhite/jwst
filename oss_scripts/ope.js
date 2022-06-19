//#!/usr/bin/env node
const { workerData, parentPort } = require('worker_threads');
const sp = require('../scriptprocessor');
const util = require('./util');

console.log("Inside OPE");
console.log(workerData);
parentPort.postMessage('Posting Message: Hello world!');

var currentVisit;
var observationPlan = [
    {visit: "V001", begin: '2022-167/02:01:00', end: '2022-167/02:01:10', cutoff: '2022-168/03:30:44'},
    {visit: "V002", begin: '2022-167/23:53:44', end: '2022-168/02:55:44', cutoff: '2022-168/23:53:44'}
];

var nextVisit = observationPlan[0];

var systemTime = sp.getTime();
console.log(systemTime);
var beginTime = util.parseJulianTimeStamp(nextVisit.begin);
var endTime = util.parseJulianTimeStamp(nextVisit.end);

if (beginTime <= systemTime && systemTime < endTime) {
   console.log("Currently within visit window");

   //open file

   //read file

   //process script

   //issue event message

   //wait

   //get shared parameter
}
else console.log("Not currently within visit window");