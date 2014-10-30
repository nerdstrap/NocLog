define(function(require) {
    'use strict';

    var module = require('module'),
            $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var StationEntryModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
        set: function(key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }
            if (attributes) {
                var inTimeParsed = false;
                var durationParsed = false;
                if (attributes.hasOwnProperty('inTime')) {
                    var inTime = attributes.inTime;
                    if (inTime && !isNaN(inTime)) {
                        attributes.inTime = new Date(inTime);
                        inTimeParsed = true;
                    }
                }

                if (attributes.hasOwnProperty('duration')) {
                    var duration = attributes.duration;
                    if (duration && !isNaN(duration)) {
                        attributes.duration = Number(duration);
                        durationParsed = true;
                    }
                }

                if (inTimeParsed && durationParsed) {
                    attributes.expectedOutTime = utils.addMinutes(attributes.inTime, attributes.duration);
                }

                var checkedOut = false;
                if (attributes.hasOwnProperty('outTime')) {
                    var outTime = attributes.outTime;
                    if (outTime && !isNaN(outTime)) {
                        attributes.outTime = new Date(outTime);
                        checkedOut = true;
                    }
                }
                attributes.checkedOut = checkedOut;

                if (checkedOut === false && attributes.expectedOutTime) {
                    var expectedOutTimeElapsed = new Date() - attributes.expectedOutTime;
                    if (expectedOutTimeElapsed > 0) {
                        attributes.checkOutExpired = true;
                        if (expectedOutTimeElapsed >= env.getExpirationThreshold()) {
                            attributes.checkOutOverdue = true;
                        }
                    }
                }

                if (attributes.hasOwnProperty('latitude')) {
                    var latitude = attributes.latitude;
                    if (latitude && !isNaN(latitude)) {
                        attributes.latitude = Number(latitude);
                    }
                }

                if (attributes.hasOwnProperty('longitude')) {
                    var longitude = attributes.longitude;
                    if (longitude && !isNaN(longitude)) {
                        attributes.longitude = Number(longitude);
                    }
                }

                if (attributes.hasOwnProperty('distanceInMiles')) {
                    var distanceInMiles = attributes.distanceInMiles;
                    if (distanceInMiles && !isNaN(distanceInMiles)) {
                        attributes.distanceInMiles = Number(distanceInMiles);
                    }
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return StationEntryModel;
});