const moment = require('moment');

var parseJulianTimeStamp = function (dateStamp){
    return Date.parse(moment(dateStamp, "YYYY-DDD/hh:mm:ss").format());
};

module.exports.parseJulianTimeStamp = parseJulianTimeStamp;