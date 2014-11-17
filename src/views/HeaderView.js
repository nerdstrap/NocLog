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
                'appTitleText': appResources.getResource('appTitleText'),
                'goToStationEntryLogListButtonText': appResources.getResource('goToStationEntryLogListButtonText'),
                'goToStationEntryLogHistoryListButtonText': appResources.getResource('goToStationEntryLogHistoryListButtonText'),
                'goToStationListButtonText': appResources.getResource('goToStationListButtonText'),
                'goToPersonnelListButtonText': appResources.getResource('goToPersonnelListButtonText'),
                'goToReportListButtonText': appResources.getResource('goToReportListButtonText'),
                'goToMaintainPurposesButtonText': appResources.getResource('goToMaintainPurposesButtonText'),
            };
        },
        initialize: function(options) {
            console.trace('HeaderView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.listenTo(appEvents, AppEventNamesEnum.showAdminHeaderButtons, this.showAdminHeaderButtons);
        },
        events: {
            'click #app-title-button': 'titleButtonClick',
            'click #go-to-station-entry-log-list-button': 'goToStationEntryLogList',
            'click #go-to-station-entry-log-history-list-button': 'goToStationEntryLogHistoryList',
            'click #go-to-station-list-button': 'goToStationList',
            'click #go-to-personnel-list-button': 'goToPersonnelList',
            'click #go-to-maintain-purposes-button': 'goToMaintainPurposes'
        },
        render: function() {
            console.trace('HeaderView.render');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        showAdminHeaderButtons: function() {
            this.$('#header-title-div').removeClass('small-7');
            this.$('#header-title-div').addClass('small-6');
            this.$('#go-to-personnel-link-div').removeClass('small-2');
            this.$('#go-to-personnel-link-div').addClass('small-1');
            this.$('#go-to-maintain-purposes-link-div').removeClass('hidden');
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
        },
        goToMaintainPurposes: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToMaintainPurposes);
        }
    });

    return HeaderView;
});