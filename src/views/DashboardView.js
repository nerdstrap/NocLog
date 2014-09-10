define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            StationListView = require('views/StationListView'),
            StationEntryLogListView = require('views/StationEntryLogListView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/Dashboard');

    var DashboardView = CompositeView.extend({
        resources: function(culture) {
            return {
                'showStationListButtonText': appResources.getResource('showStationListButtonText').value,
                'showStationEntryLogListButtonText': appResources.getResource('showStationEntryLogListButtonText').value
            };
        },
        initialize: function(options) {
            console.trace('DashboardView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationSearchResults = options.stationSearchResults;
            this.stationEntryLogSearchResults = options.stationEntryLogSearchResults;
        },
        render: function() {
            console.trace('DashboardView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            var stationListViewInstance = new StationListView({
                collection: currentContext.stationSearchResults,
                el: $('#station-list-view', currentContext.el),
                dispatcher: currentContext.dispatcher
            });
            this.renderChild(stationListViewInstance);

            var stationEntryLogListViewInstance = new StationEntryLogListView({
                collection: currentContext.stationEntryLogSearchResults,
                el: $('#station-entry-log-list-view', currentContext.el),
                dispatcher: currentContext.dispatcher
            });
            this.renderChild(stationEntryLogListViewInstance);

            return this;
        },
        events: {
            'click #refresh-station-list-button': 'refreshStationList',
            'click #refresh-station-entry-log-list-button': 'refreshStationEntryLogList'
        }
    });

    return DashboardView;
});
