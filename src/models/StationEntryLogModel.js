define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var StationEntryModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
        getDefaultsForRendering: function() {
            return {
                'minExpired': false,
                'maxExpired': false
            };
        },
        urlRoot: function () {
            return env.getApiUrl() + '/stationEntryLog';
        },
        sync: function(method, model, options) {
            console.trace('Backbone.sync methods have been disabled.');
        },
        set: function (key, val, options) {
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
                    var expiredInSeconds = (new Date() - attributes.expectedOutTime)/1000;
                    if (expiredInSeconds > 0 && expiredInSeconds < 1800){
                        attributes.minExpired = true;
                    }else if(expiredInSeconds >= 1800){
                        attributes.maxExpired = true;
                    }
                }
                    
                if (attributes.hasOwnProperty('outTime')) {
                    var outTime = attributes.outTime;
                    if (outTime && !isNaN(outTime)) {
                        attributes.outTime = new Date(outTime);
                        attributes.checkedOut = true;
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
        },
        getStationEntryLogById: function() {
            var currentContext = this;
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        },
        checkIn: function (options) {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(options),
                dataType: 'json',
                type: "POST",
                url: currentContext.url() + '/checkIn'
            });
        },
        checkOut: function (options) {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                data: JSON.stringify({stationEntryLogId: options.stationEntryLogId}),
                dataType: 'json',
                type: "PUT",
                url: currentContext.url() + '/checkOut'
            });
        },
        updateCheckIn: function (options) {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(options),
                dataType: 'json',
                type: "PUT",
                url: currentContext.url() + '/updateCheckIn'
            });
        }
    });

    return StationEntryModel;
});