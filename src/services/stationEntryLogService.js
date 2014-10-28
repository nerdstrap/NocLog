define(function(require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        env = require('env');
    
    var stationEntryLogService = {
        getStationEntryLogById: function(id) {
            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/' + id
            });
        },
        getStationEntryLogs: function(options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/history'
            });
        },
        getStationEntryLogsByOpen: function(options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/open'
            });
        },
        getStationEntryLogsByExpired: function(options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/expired'
            });
        },
        checkIn: function (options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(options),
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/checkIn'
            });
        },
        checkOut: function (options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/checkOut'
            });
        },
        updateCheckIn: function (options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/updateCheckIn'
            });
        }
    };

    return stationEntryLogService;
});