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
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addAllStationIdentifiers);
        },
        render: function() {
            console.trace('PersonnelStationEntryLogList.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.setDefaultDateFilters(-1);

            currentContext.addAllStationIdentifiers();

            return this;
        },
        events: {
            'click #personnel-station-entry-log-list-refresh-button': 'refreshPersonnelStationEntryLogList',
            'click #personnel-station-entry-log-list-reset-button': 'resetPersonnelStationEntryLogList',
            'click #personnel-station-entry-log-list-refresh-fourteen-days-button': 'setDateFilter',
            'click #personnel-station-entry-log-list-refresh-thirty-days-button': 'setDateFilter',
            'click #personnel-station-entry-log-list-export-button': 'exportPersonnelStationEntryLogList',
            'click #station-name-sort-button': 'sortPersonnelStationEntryLogList',
            'click #out-time-sort-button': 'sortPersonnelStationEntryLogList',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
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
        setDefaultDateFilters: function(daysToAdd) {
            var today = new Date();
            var yesterday = utils.addDays(Date.now(), daysToAdd);

            this.$('#personnel-station-entry-log-list-start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#personnel-station-entry-log-list-start-time-filter').val('00:00');
            this.$('#personnel-station-entry-log-list-end-date-filter').val(utils.getFormattedDate(today));
            this.$('#personnel-station-entry-log-list-end-time-filter').val('23:59');
        },
        refreshPersonnelStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatchRefreshPersonnelStationEntryLogList();
        },
        resetPersonnelStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#personnel-station-entry-log-list-station-filter').val('');
            this.setDefaultDateFilters(-1);
            this.resetSortDirections();
            this.$('#out-time-sort-button').attr('data-sort-direction', '1').next().addClass('fa-sort-amount-asc');
            this.collection.sortAttributes = [{
                    sortAttribute: 'outTime',
                    sortDirection: 1
                }];
            this.dispatchRefreshPersonnelStationEntryLogList();
        },
        setDateFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            var daysToAdd = -1;
            if (event.target) {
                var button = $(event.target);
                var daysToAddString = button.data('days-to-add');
                if (daysToAddString) {
                    daysToAdd = parseInt(daysToAddString, 10);
                }
                ;
            }
            this.setDefaultDateFilters(daysToAdd);
            this.dispatchRefreshPersonnelStationEntryLogList();
        },
        dispatchRefreshPersonnelStationEntryLogList: function() {
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
        exportPersonnelStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
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
            this.dispatcher.trigger(AppEventNamesEnum.goToExportStationEntryLogList, this.collection, options);
        },
        sortPersonnelStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var sortButton = $(event.target);
                var sortAttribute = sortButton.attr('data-sort-attribute');
                var sortDirection = sortButton.attr('data-sort-direction');
                if (sortDirection === '1') {
                    sortDirection = '-1';
                } else {
                    sortDirection = '1';
                }
                this.resetSortDirections();
                sortButton.attr('data-sort-direction', sortDirection);
                var indicatorClass = sortDirection === '1' ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc';
                sortButton.next().addClass(indicatorClass);
                this.collection.sortAttributes = [{
                        sortAttribute: sortAttribute,
                        sortDirection: parseInt(sortDirection, 10)
                    }];
                this.collection.sort();
            }
        },
        resetSortDirections: function() {
            var sortButtons = this.$('.sort-button');
            _.each(sortButtons, function(sortButton) {
                $(sortButton).attr('data-sort-direction', '');
                $(sortButton).next().removeClass('fa-sort-amount-desc').removeClass('fa-sort-amount-asc');
            });
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
