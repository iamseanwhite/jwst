//#!/usr/bin/env node
const sp = require('../build/Release/scriptprocessor');

var currentVisit;
var observationPlan = [
    {visit: "V001", begin: '2022-165/01:53:44', cutoff: '2022-165/02:55:44'},
    {visit: "V002", begin: '2022-165/23:53:44', cutoff: '2022-165/23:53:44'}
];

var nextVisit = observationPlan[0];

var systemTime = sp.getTime() * 1000;
//TODO: convert to usable format
var beginTime = Date.parse(nextVisit.begin);
var cutoffTime = Date.parse(nextVisit.end);

if (beginTime<= systemTime && systemTime < cutoffTime) {
    console.log("Currently within visit window");
}
else console.log("Not currently within visit window");
