define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var StationEntryModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
        urlRoot: function () {
            return env.getApiUrl() + '/stationEntryLog';
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
                if (attributes.hasOwnProperty('inTime')) {
                    var inTime = attributes.inTime;
                    if (inTime && !isNaN(inTime)) {
                        attributes.inTime = new Date(inTime);
                    }
                }
                
                if (attributes.hasOwnProperty('duration')) {
                    var duration = attributes.duration;
                    if (duration && duration.length > 0 && !isNaN(duration)) {
                        attributes.duration = Number(duration);
                    }
                }
                    
                if (attributes.hasOwnProperty('outTime')) {
                    var outTime = attributes.outTime;
                    if (outTime && !isNaN(outTime)) {
                        attributes.outTime = new Date(outTime);
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
        checkIn: function () {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "POST",
                url: currentContext.url + '/find/recent'
            });
        },
        checkOut: function () {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "POST",
                url: currentContext.url + '/find/recent'
            });
        },
        extendDuration: function () {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "POST",
                url: currentContext.url + '/find/recent'
            });
        }
    });

    return StationEntryModel;
});