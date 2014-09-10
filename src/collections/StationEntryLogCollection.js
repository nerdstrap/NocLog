define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationEntryLogModel = require('models/StationEntryLogModel'),
        env = require('env');

    var StationEntryLogCollection = Backbone.Collection.extend({
        model: StationEntryLogModel,
        url: function () {
            return env.getApiUrl() + '/stationEntryLog';
        },
        getStationEntryLogs: function () {
            var currentContext = this;

            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        },
        getStationEntryLogsByOpen: function () {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url() + '/open'
            });
        },
        getStationEntryLogsByExpired: function () {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url() + '/expired'
            });
        }
    });

    return StationEntryLogCollection;
});