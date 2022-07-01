const moment = require('moment');

var convertToJulianTimeStamp = function (msSinceEpoch) {
    return moment(msSinceEpoch).format("YYYY-DDD/HH:mm:ss");
}

var parseJulianTimeStamp = function (dateStamp){
    return Date.parse(moment(dateStamp, "YYYY-DDD/HH:mm:ss").format());
};

var formatDate = function (msSinceEpoch) {
    return moment(msSinceEpoch).format("MM/DD/yyyy HH:mm:ss");
}

module.exports.convertToJulianTimeStamp = convertToJulianTimeStamp;
module.exports.parseJulianTimeStamp = parseJulianTimeStamp;
module.exports.formatDate = formatDate;