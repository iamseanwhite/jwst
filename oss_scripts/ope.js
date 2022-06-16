//#!/usr/bin/env node
const sp = require('../build/Release/scriptprocessor');
const moment = require('moment');

var currentVisit;
var observationPlan = [
    {visit: "V001", begin: '2022-167/02:01:00', end: '2022-167/02:01:10', cutoff: '2022-168/03:30:44'},
    {visit: "V002", begin: '2022-167/23:53:44', end: '2022-168/02:55:44', cutoff: '2022-168/23:53:44'}
];

var nextVisit = observationPlan[0];

var systemTime = sp.getTime() * 1000;
var beginTime = Date.parse(moment(nextVisit.begin, "YYYY-DDD/hh:mm:ss").format());
var endTime = Date.parse(moment(nextVisit.end, "YYYY-DDD/hh:mm:ss").format());

if (beginTime <= systemTime && systemTime < endTime) {
   console.log("Currently within visit window");
}
else console.log("Not currently within visit window");