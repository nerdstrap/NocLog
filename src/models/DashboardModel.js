define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationCollection = require('collections/StationCollection'),
            StationEntryLogCollection = require('collections/StationEntryLogCollection');

    var DashboardModel = Backbone.Model.extend({
        initialize: function(options) {
            options || (options = {});
            this.set({'id': options.id || 1}, {silent: true});
            this.set({'stationSearchResults': options.stationSearchResults || new StationCollection()}, {silent: true});
            this.set({'stationEntryLogSearchResults': options.stationEntryLogSearchResults || new StationEntryLogCollection()}, {silent: true});
        },
        getStations: function() {
            if (this.has('stationSearchResults')) {
                var stationSearchResults = this.get('stationSearchResults');
                if (stationSearchResults.length > 0) {
                    return stationSearchResults;
                }
            }
            return [];
        },
        getStationEntryLogs: function() {
            if (this.has('stationEntryLogSearchResults')) {
                var stationEntryLogSearchResults = this.get('stationEntryLogSearchResults');
                if (stationEntryLogSearchResults.length > 0) {
                    return stationEntryLogSearchResults;
                }
            }
            return [];
        }
    });

    return DashboardModel;
});

