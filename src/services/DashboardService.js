define(function(require) {
    'use strict';

    var $ = require('jquery'),
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
        },
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
        postCheckIn: function (options) {
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
        postCheckOut: function (options) {
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
        postUpdateCheckIn: function (options) {
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
        },
        getLookupDataItems: function (options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/lookupDataItem'
            });
        },
        getNewStationEntryLogOptions: function (options) {
            var data;
            if (options) {
                data = JSON.stringify(options);
            }

            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/lookupDataItem/newStationEntryLogOptions'
            });
        }
    });

    return DashboardService;
});