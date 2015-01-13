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

    utils.convertMillisecondsToHoursAndMinutes = function(milliseconds) {

        var ms = (1000),
                mm = (ms * 60),
                mh = (mm * 60),
                hours = Math.floor(milliseconds / mh),
                minutes = Math.floor((milliseconds - (hours * mh)) / mm),
                seconds = Math.floor((milliseconds - (hours * mh) - (minutes * mm)) / ms);

        if (seconds > 0) {
            minutes = Number(minutes) + 1;
        }

        return {hours: hours, minutes: minutes};
    };

    utils.getFilterOptions = function(collection, valuePropertyName, textPropertyName, optionalProperty1, optionalProperty2) {
        return _.map(collection, function(value, key, list) {
            return {
                'value': value.get(valuePropertyName),
                'text': value.get(textPropertyName),
				'data-option1': value.get(optionalProperty1),
				'data-option2': value.get(optionalProperty2)
            };
        });
    };

    utils.getCSVFileName = function(options) {

        var csvFileName = "";
        var reportType = "";
        var csvFileFilter = "";
        var reportDate = new Date();
        var timeStamp = "" + reportDate.getFullYear() + (reportDate.getMonth() + 1) + reportDate.getDate();

        if (options.reportType) {
            reportType = options.reportType + "_" + timeStamp;
        }

        if (typeof options.onlyCheckedOut !== 'undefined') {
            if (options.onlyCheckedOut) {
                csvFileFilter = csvFileFilter + "_expired";
            } else {
                csvFileFilter = csvFileFilter + "_open";
            }
        }

        if (options.userId) {
            csvFileFilter = csvFileFilter + "_usr_" + options.userId;
        }

        if (options.stationId) {
            csvFileFilter = csvFileFilter + "_stn_" + options.stationId;
        } else if (options.areaName) {
            csvFileFilter = csvFileFilter + "_are_" + options.areaName;
        } else if (options.regionName) {
            csvFileFilter = csvFileFilter + "_rgn_" + options.regionName;
        }


        if (options.startDate) {
            csvFileFilter = csvFileFilter + "_sd_" + options.startDate;
        }

        if (options.startTime) {
            csvFileFilter = csvFileFilter + "_st_" + options.startTime;
        }

        if (options.endDate) {
            csvFileFilter = csvFileFilter + "_ed_" + options.endDate;
        }

        if (options.endTime) {
            csvFileFilter = csvFileFilter + "_et_" + options.endTime;
        }

        csvFileName = reportType + csvFileFilter + ".csv";
        return csvFileName;
    };
    
    utils.simpleComparator = function(a, b, sortDirection) {
        if (sortDirection !== 1) {
            if (a === b) {
                return 0;
            }
            if (!a) {
                return 1;
            }
            if (!b) {
                return -1;
            }
            return (a < b) ? 1 : -1;
        } else {
            if (a === b) {
                return 0;
            }
            if (!a) {
                return -1;
            }
            if (!b) {
                return 1;
            }
            return (a < b) ? -1 : 1;
        }
    };

    return utils;
});
