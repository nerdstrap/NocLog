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
        getStationEntryLogs: function (options) {
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
        },
        getStationEntryLogsByOpen: function (options) {
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
                url: currentContext.url() + '/open'
            });
        },
        getStationEntryLogsByExpired: function (options) {
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
                url: currentContext.url() + '/expired'
            });
        }
    });

    return StationEntryLogCollection;
});