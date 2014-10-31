define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            env = require('env');

    var DashboardService = function(options) {
        console.trace('new DashboardService()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(DashboardService.prototype, {
        initialize: function(options) {
            console.trace('DashboardService.initialize');
            options || (options = {});
        },
        getStationById: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/station'
            });
        },
        getStations: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/station/all'
            });
        },
        getStationEntryLogById: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/find'
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
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/history'
            });
        },
        getStationEntryLogsByOpen: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/open'
            });
        },
        getStationEntryLogsByExpired: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/expired'
            });
        },
        postCheckIn: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/checkIn'
            });
        },
        postCheckOut: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: env.getApiUrl() + '/stationEntryLog/checkOut'
            });
        },
        postUpdateCheckIn: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: env.getApiUrl() + '/stationEntryLog/updateCheckIn'
            });
        },
        getLookupDataItems: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/lookupDataItem'
            });
        },
        getPersonnelByUserId: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/personnel/find'
            });
        },
        getNewStationEntryLogOptions: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/lookupDataItem/newStationEntryLogOptions'
            });
        }
    });

    return DashboardService;
});