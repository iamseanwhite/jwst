const moment = require('moment');

var parseJulianTimeStamp = function (dateStamp){
    return Date.parse(moment(dateStamp, "YYYY-DDD/hh:mm:ss").format());
};

var formatDate = function (msSinceEpoch) {
    return moment(msSinceEpoch).format("MM/DD/yyyy hh:mm:ss");
}

module.exports.parseJulianTimeStamp = parseJulianTimeStamp;
module.exports.formatDate = formatDate;