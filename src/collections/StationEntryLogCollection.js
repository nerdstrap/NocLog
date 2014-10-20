define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            env = require('env'),
            dates = require('dates');

    var StationEntryLogCollection = Backbone.Collection.extend({
        model: StationEntryLogModel,
        sortAttributes: [
            {
                sortAttribute: 'expectedOutTime',
                sortDirection: 1
            }
        ],
        sortableFields: [
            {
                sortAttribute: 'outTime',
                comparator: function(a, b) {
                    return (a === b) ? 0 : (a > b) ? 1 : -1;
                }
            },
            {
                sortAttribute: 'expectedOutTime',
                comparator: function(a, b) {
                    return (a === b) ? 0 : (a > b) ? 1 : -1;
                }
            },
            {
                sortAttribute: 'region',
                comparator: function(a, b, sortDirection) {
                    if (sortDirection === 1) {
                        return (a === b) ? 0 : (a > b) ? 1 : -1;
                    } else {
                        return (a === b) ? 0 : (a < b) ? 1 : -1;
                    }
                }
            },
            {
                sortAttribute: 'area',
                comparator: function(a, b, sortDirection) {
                    if (sortDirection === 1) {
                        return (a === b) ? 0 : (a > b) ? 1 : -1;
                    } else {
                        return (a === b) ? 0 : (a < b) ? 1 : -1;
                    }
                }
            }
        ],
        url: function() {
            return env.getApiUrl() + '/stationEntryLog';
        },
        sync: function(method, model, options) {
            console.trace('Backbone.sync methods have been disabled.');
        },
        comparator: function(a, b) {
            var currentContext = this;
            var i, result = 0;
            for (i in currentContext.sortAttributes) {
                var sortAttribute = currentContext.sortAttributes[i].sortAttribute;
                var sortDirection = currentContext.sortAttributes[i].sortDirection;
                var sortableField = _.find(currentContext.sortableFields, function(s){ return s.sortAttribute === sortAttribute; });
                if (sortableField) {
                    result = sortableField.comparator(a.get(sortAttribute), b.get(sortAttribute), sortDirection);
                }
                if (result !== 0) {
                    return result; // on inequality we return right away
                }
                // else continue, delegating comparison to next field/comparator
            }

            // When the loop is done, or if fields was defined empty, we return the last equality
            return result;
        },
//        getAllStationEntryLogs: function() {
//            var currentContext = this;
//
//            return $.ajax({
//                contentType: 'application/json',
//                dataType: 'json',
//                type: "GET",
//                url: currentContext.url()
//            });
//        },
        getStationEntryLogsByHistory: function(options) {
            var currentContext = this;

            var data;
            if (options) {
                data = $.param({
                    stationid: options.stationId,
                    regionname: options.region,
                    areaname: options.area,
                    startdate: options.startDate,
                    starttime: options.startTime,
                    enddate: options.endDate,
                    endtime: options.endTime
                });
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: "GET",
                url: currentContext.url() + '/history'
            });
        },
        getStationEntryLogsByOpen: function(options) {
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
        getStationEntryLogsByExpired: function(options) {
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