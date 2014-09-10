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
        getStations: function() {
            var currentContext = this;
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        },
        getStationsBySearchQuery: function(searchQuery) {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                data: $.param({
                    stationname: searchQuery.substr(0, 2)
                }),
                dataType: 'json',
                type: "GET",
                url: currentContext.url() + '/find'
            });
        },
        getStationsByRecentCheckIn: function() {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url() + '/find/recent'
            });
        }
    });

    return StationCollection;
});
