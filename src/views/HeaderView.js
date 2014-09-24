define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/Header');

    var HeaderView = CompositeView.extend({
        resources: function(culture) {
            return {
                'appTitleText': appResources.getResource('appTitleText').value,
                'goToStationEntryLogListButtonText': appResources.getResource('goToStationEntryLogListButtonText').value,
                'goToStationEntryLogHistoryListButtonText': appResources.getResource('goToStationEntryLogHistoryListButtonText').value,
                'goToStationListButtonText': appResources.getResource('goToStationListButtonText').value,
                'goToPersonnelListButtonText': appResources.getResource('goToPersonnelListButtonText').value,
                'goToReportListButtonText': appResources.getResource('goToReportListButtonText').value
            };
        },
        initialize: function(options) {
            console.trace('HeaderView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        events: {
            'click #app-title-button': 'titleButtonClick',
            'click #go-to-station-entry-log-list-button': 'goToStationEntryLogList',
            'click #go-to-station-entry-log-history-list-button': 'goToStationEntryLogHistoryList',
            'click #go-to-station-list-button': 'goToStationList',
            'click #go-to-personnel-list-button': 'goToPersonnelList'
        },
        render: function() {
            console.trace('HeaderView.render');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        titleButtonClick: function(event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList);
        },
        goToStationList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationList);
        },
        goToPersonnelList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnelList);
        },
        goToStationEntryLogHistoryList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogHistoryList);
        }
    });

    return HeaderView;
});