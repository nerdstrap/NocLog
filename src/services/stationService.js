define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env');

    var stationService = {
        getStationById: function(id) {
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/' + id
            });
        },
        getStations: function(options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station'
            });
        }
    };

    return stationService;
});