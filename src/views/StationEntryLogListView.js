define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            StationEntryLogListItemView = require('views/StationEntryLogListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationEntryLogList');

    var StationEntryLogListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc').value,
                loadingMessage: appResources.getResource('StationEntryLogListView.loadingMessage').value,
                errorMessage: appResources.getResource('StationEntryLogListView.errorMessage').value,
                infoMessage: appResources.getResource('StationEntryLogListView.infoMessage').value,
                listViewTitleText: appResources.getResource('StationEntryLogListView.listViewTitleText').value,
                listFilterHeaderText: appResources.getResource('StationEntryLogListView.listFilterHeaderText').value,
                stationNameHeaderText: appResources.getResource('StationEntryLogListView.stationNameHeaderText').value,
                personnelNameHeaderText: appResources.getResource('StationEntryLogListView.personnelNameHeaderText').value,
                contactHeaderText: appResources.getResource('StationEntryLogListView.contactHeaderText').value,
                inTimeHeaderText: appResources.getResource('StationEntryLogListView.inTimeHeaderText').value,
                outTimeHeaderText: appResources.getResource('StationEntryLogListView.outTimeHeaderText').value,
                durationHeaderText: appResources.getResource('StationEntryLogListView.durationHeaderText').value,
                purposeHeaderText: appResources.getResource('StationEntryLogListView.purposeHeaderText').value,
                additionalInfoHeaderText: appResources.getResource('StationEntryLogListView.additionalInfoHeaderText').value
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLogListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
        },
        render: function() {
            console.trace('StationEntryLogListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            _.each(this.collection.models, this.addOne, this);

            return this;
        },
        events: {
            'change #station-entry-log-list-filter': 'changeStationEntryLogListFilter'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new StationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationEntryLogListItemView, '.view-list');
        },
        changeStationEntryLogListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var filter = event.target.value;
                if (filter === "open") {
                    this.dispatcher.trigger(AppEventNamesEnum.showOpenStationEntryLogs);
                }
                if (filter === "expired") {
                    this.dispatcher.trigger(AppEventNamesEnum.showExpiredStationEntryLogs);
                }
                if (filter === "all") {
                    this.dispatcher.trigger(AppEventNamesEnum.showStationEntryLogs);
                }
            }
        }
    });

    return StationEntryLogListView;
});
