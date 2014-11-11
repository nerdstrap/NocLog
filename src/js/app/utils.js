define(function(require) {
    'use strict';

    var utils = {};

    utils.cleanPhone = function(phone) {
        if (phone) {
            var originalPhone = phone;
            var cleanedPhone = originalPhone.replace(/[^0-9]/g, '');
            if (cleanedPhone.length > 10) {
                cleanedPhone = cleanedPhone.substring(cleanedPhone.length - 10);
            }
            return cleanedPhone;
        }
        return phone;
    };

    utils.addMinutes = function(date, minutes) {
        var minutesToAdd = minutes * 60000;
        return new Date(date.getTime() + minutesToAdd);
    };

    utils.addDays = function(date, days) {
        var daysToAdd = days * 86400000;
        return new Date(date + daysToAdd);
    };

    utils.getFormattedDate = function(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return yyyy + '-' + mm + '-' + dd;
    };

    utils.milliSecondsToTime = function(milliSecs) {

        var msSecs = (1000),
        msMins = (msSecs * 60),
        msHours = (msMins * 60),
        numHours = Math.floor(milliSecs / msHours),
        numMins = Math.floor((milliSecs - (numHours * msHours)) / msMins),
        numSecs = Math.floor((milliSecs - (numHours * msHours) - (numMins * msMins)) / msSecs);

        if (numSecs > 0){
            numMins = Number(numMins) + 1;
        }

        var resultString = numHours + " hrs " + numMins + " mins";

        return resultString;
    };

    return utils;
});
