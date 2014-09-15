define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationModel = require('models/StationModel'),
            env = require('env');

    var StationCollection = Backbone.Collection.extend({
        model: StationModel,
        url: function() {
            return env.getApiUrl() + '/station';
        },
        getStations: function(options) {
            var currentContext = this;
            
            var data;
            if (options) {
                data = $.param({
                   regionname: options.region,
                   areaname: options.area
                });
            }
            
            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        }
    });

    return StationCollection;
});
