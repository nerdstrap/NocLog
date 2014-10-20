define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        env = require('env');

    var StationModel = Backbone.Model.extend({
        idAttribute: 'stationId',
        urlRoot: function () {
            return env.getApiUrl() + '/station';
        },
        sync: function(method, model, options) {
            console.trace('Backbone.sync methods have been disabled.');
        },
        getStationById: function() {
            var currentContext = this;
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
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

    return StationModel;
});