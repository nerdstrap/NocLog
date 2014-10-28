define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        env = require('env');

    var StationModel = Backbone.Model.extend({
        idAttribute: 'stationId',
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