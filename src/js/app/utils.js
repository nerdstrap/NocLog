define(function(require) {
    'use strict';

    var resources = require('resources');

    var utils = {};

    utils.getResource = function(key) {
        return resources.getResource(key);
    };

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

        var ms = (1000),
                mm = (ms * 60),
                mh = (mm * 60),
                hours = Math.floor(milliSecs / mh),
                minutes = Math.floor((milliSecs - (hours * mh)) / mm),
                seconds = Math.floor((milliSecs - (hours * mh) - (minutes * mm)) / ms);

        if (seconds > 0) {
            minutes = Number(minutes) + 1;
        }

        var resultString = hours + ' hrs ' + minutes + ' mins';

        return resultString;
    };

    utils.getFilterOptions = function(collection, valuePropertyName, textPropertyName) {
        return _.map(collection, function(value, key, list) {
            return {
                'value': value.get(valuePropertyName),
                'text': value.get(textPropertyName)
            };
        });
    };

    return utils;
});
