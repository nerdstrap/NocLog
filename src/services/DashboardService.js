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
        getStations: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/find'
            });
        },
        getStationEntryLogs: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/find'
            });
        },
        getPersonnels: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/personnel/find'
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
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/lookupDataItem/find'
            });
        },
        getOptions: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/lookupDataItem/find/options'
            });
        },
        getFilters: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/lookupDataItem/find/filters'
            });
        },
        postAddItem: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/lookupDataItem/addItem'
            });
        },
        postUpdateItem: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: env.getApiUrl() + '/lookupDataItem/updateItem'
            });
        }
    });

    return DashboardService;
});