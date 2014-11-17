define(function(require) {
    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            PersonnelStationEntryLogListItemView = require('views/PersonnelStationEntryLogListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            globals = require('globals'),
            env = require('env'),
            utils = require('utils'),
            template = require('hbs!templates/PersonnelStationEntryLogList'),
            filterTemplate = require('hbs!templates/Filter'),
            alertTemplate = require('hbs!templates/Alert');
            
    var PersonnelStationEntryLogListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc'),
                stationFilterDefaultOption: appResources.getResource('stationFilterDefaultOption'),
                refreshButtonText: appResources.getResource('refreshButtonText'),
                resetButtonText: appResources.getResource('resetButtonText'),
                listViewTitleText: appResources.getResource('PersonnelStationEntryLogListView.listViewTitleText'),
                loadingMessage: appResources.getResource('PersonnelStationEntryLogListView.loadingMessage'),
                errorMessage: appResources.getResource('PersonnelStationEntryLogListView.errorMessage'),
                stationNameHeaderText: appResources.getResource('stationNameHeaderText'),
                personnelNameHeaderText: appResources.getResource('personnelNameHeaderText'),
                contactHeaderText: appResources.getResource('contactHeaderText'),
                inTimeHeaderText: appResources.getResource('inTimeHeaderText'),
                outTimeHeaderText: appResources.getResource('outTimeHeaderText'),
                purposeHeaderText: appResources.getResource('purposeHeaderText'),
                additionalInfoHeaderText: appResources.getResource('additionalInfoHeaderText'),
                regionHeaderText: appResources.getResource('regionHeaderText'),
                areaHeaderText: appResources.getResource('areaHeaderText'),
                startDateTimeHeaderText: appResources.getResource('startDateTimeHeaderText'),
                endDateTimeHeaderText: appResources.getResource('endDateTimeHeaderText'),
                exportButtonText: appResources.getResource('exportButtonText')
            };
        },
        initialize: function(options) {
            console.trace('PersonnelStationEntryLogList.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCollection = options.stationIdentifierCollection || new Backbone.Collection();

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addAllStationIdentifiers);
        },
        render: function() {
            console.trace('PersonnelStationEntryLogList.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            var today = new Date();
            var yesterday = utils.addDays(Date.now(), -1);

            this.$('#personnel-station-entry-log-list-start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#personnel-station-entry-log-list-end-date-filter').val(utils.getFormattedDate(today));

            return this;
        },
        events: {
            'click #personnel-station-entry-log-list-refresh-button': 'refreshPersonnelStationEntryLogList',
            'click #personnel-station-entry-log-list-reset-button': 'resetPersonnelStationEntryLogList',
            'click #personnel-station-entry-log-list-past-week-button': 'setDateFilterToPastWeek',
            'click #personnel-station-entry-log-list-past-month-button': 'setDateFilterToPastMonth',
            'click #personnel-station-entry-log-list-export-button': 'exportPersonnelStationEntryLogList',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
            if (this.collection.models.length === 0) {
                this.showInfo('no results');
            }
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var personnelStationEntryLogListItemView = new PersonnelStationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(personnelStationEntryLogListItemView, '#personnel-station-entry-log-list');
        },
        addAllStationIdentifiers: function() {
            var currentContext = this;
            var filterRenderModel = {
                defaultOption: currentContext.resources().stationFilterDefaultOption,
                options: utils.getFilterOptions(currentContext.stationIdentifierCollection.models, 'stationId', 'stationName')
            };
            this.$('#personnel-station-entry-log-list-station-filter').html(filterTemplate(filterRenderModel));
        },
        refreshPersonnelStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();
            var stationId = this.$('#personnel-station-entry-log-list-station-filter').val();
            var startDate = this.$('#personnel-station-entry-log-list-start-date-filter').val();
            var startTime = this.$('#personnel-station-entry-log-list-start-time-filter').val();
            var endDate = this.$('#personnel-station-entry-log-list-end-date-filter').val();
            var endTime = this.$('#personnel-station-entry-log-list-end-time-filter').val();
            var options = {
                userId: this.parent.model.get('userId'),
                stationId: stationId,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                onlyCheckedOut: true
            };
            this.dispatcher.trigger('_loadStationEntryLogs', this.collection, options);
        },
        resetPersonnelStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();
            var today = new Date();
            var yesterday = utils.addDays(Date.now(), -1);
            this.$('#personnel-station-entry-log-list-station-filter').val('');
            this.$('#personnel-station-entry-log-list-start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#personnel-station-entry-log-list-start-time-filter').val('');
            this.$('#personnel-station-entry-log-list-end-date-filter').val(utils.getFormattedDate(today));
            this.$('#personnel-station-entry-log-list-end-time-filter').val('');
            var sortAttributes = [{
                    sortAttribute: 'outTime',
                    sortDirection: 1
                }];
            //this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            var options = {
                userId: this.parent.model.get('userId'),
                onlyCheckedOut: true
            };
            this.dispatcher.trigger('_loadStationEntryLogs', this.collection, options);
        },
        setDateFilterToPastWeek: function() {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();
            var today = new Date();
            var yesterday = utils.addDays(Date.now(), -14);
            this.$('#personnel-station-entry-log-list-start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#personnel-station-entry-log-list-end-date-filter').val(utils.getFormattedDate(today));
            var stationId = this.$('#personnel-station-entry-log-list-station-filter').val();
            var startDate = this.$('#personnel-station-entry-log-list-start-date-filter').val();
            var startTime = this.$('#personnel-station-entry-log-list-start-time-filter').val();
            var endDate = this.$('#personnel-station-entry-log-list-end-date-filter').val();
            var endTime = this.$('#personnel-station-entry-log-list-end-time-filter').val();
            var options = {
                userId: this.parent.model.get('userId'),
                stationId: stationId,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                onlyCheckedOut: true
            };
            this.dispatcher.trigger('_loadStationEntryLogs', this.collection, options);
        },
        setDateFilterToPastMonth: function() {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();
            var today = new Date();
            var yesterday = utils.addDays(Date.now(), -30);
            this.$('#personnel-station-entry-log-list-start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#personnel-station-entry-log-list-end-date-filter').val(utils.getFormattedDate(today));
            var stationId = this.$('#personnel-station-entry-log-list-station-filter').val();
            var startDate = this.$('#personnel-station-entry-log-list-start-date-filter').val();
            var startTime = this.$('#personnel-station-entry-log-list-start-time-filter').val();
            var endDate = this.$('#personnel-station-entry-log-list-end-date-filter').val();
            var endTime = this.$('#personnel-station-entry-log-list-end-time-filter').val();
            var options = {
                userId: this.parent.model.get('userId'),
                stationId: stationId,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                onlyCheckedOut: true
            };
            this.dispatcher.trigger('_loadStationEntryLogs', this.collection, options);
        },
        exportStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        },
        showInfo: function(message) {
            var level;
            this.addAutoCloseAlertBox(level, message);
        },
        showSuccess: function(message) {
            this.addAutoCloseAlertBox('success', message);
        },
        showError: function(message) {
            this.addAutoCloseAlertBox('alert', message);
        },
        addAlertBox: function(guid, level, message) {
            var renderModel = {
                guid: guid,
                level: level,
                message: message
            };
            this.$('.view-alerts .columns').prepend(alertTemplate(renderModel));
        },
        addAutoCloseAlertBox: function(level, message) {
            var currentContext = this;
            var guid = env.getNewGuid();
            this.addAlertBox(guid, level, message);
            globals.window.setTimeout(function() {
                currentContext.autoCloseAlertBox(guid);
            }, env.getNotificationTimeout());
        },
        closeAlertBox: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var closeAlertButton = $(event.target);
                if (closeAlertButton) {
                    var alert = closeAlertButton.closest('[data-alert]');
                    if (alert) {
                        alert.trigger('close').trigger('close.fndtn.alert').remove();
                    }
                }
            }
        },
        autoCloseAlertBox: function(guid) {
            if (guid) {
                var closeAlertButton = $('#' + guid);
                if (closeAlertButton) {
                    var alert = closeAlertButton.closest('[data-alert]');
                    if (alert) {
                        alert.trigger('close').trigger('close.fndtn.alert').remove();
                    }
                }
            }
        }
    });
    return PersonnelStationEntryLogListView;
});
