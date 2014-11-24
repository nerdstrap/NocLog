define(function(require) {
    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            StationEntryLogListItemView = require('views/StationEntryLogListItemView'),
            NewStationEntryLogModel = require('models/NewStationEntryLogModel'),
            NewStationEntryLogView = require('views/NewStationEntryLogView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            globals = require('globals'),
            env = require('env'),
            utils = require('utils'),
            appEvents = require('events'),
            template = require('hbs!templates/StationEntryLogList'),
            filterTemplate = require('hbs!templates/Filter'),
            alertTemplate = require('hbs!templates/Alert');

    var autoRefreshInterval;

    var StationEntryLogListView = CompositeView.extend({
        initialize: function(options) {
            console.trace('StationEntryLogListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.stationIdentifierCollection = options.stationIdentifierCollection;
            this.regionCollection = options.regionCollection;
            this.areaCollection = options.areaCollection;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.regionCollection, 'reset', this.addAllRegions);
            this.listenTo(this.areaCollection, 'reset', this.addAllAreas);

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(appEvents, AppEventNamesEnum.closeNewCheckIn, this.checkUserRole);
            this.listenTo(appEvents, AppEventNamesEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutSuccess, this.onCheckOutSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutError, this.onCheckOutError);
            this.listenTo(appEvents, AppEventNamesEnum.countExpiredEntriesUpdated, this.updateExpiredCounts);
        },
        render: function() {
            console.trace('StationEntryLogListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.setAutRefreshInterval();

            return this;
        },
        events: {
            'click #station-entry-log-list-refresh-list-button': 'dispatchRefreshStationEntryLogList',
            'click #station-entry-log-list-reset-list-options-button': 'resetStationEntryLogListFilter',
            'click #station-entry-log-list-expected-out-time-sort-button': 'updateStationEntryLogListExpectedOutTimeSort',
            'click #station-entry-log-list-region-sort-button': 'updateStationEntryLogListRegionSort',
            'click #station-entry-log-list-area-sort-button': 'updateStationEntryLogListAreaSort',
            'click #new-station-entry-log-button': 'goToNewStationEntryLog',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        addAll: function() {
            this.removeAll();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new StationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher,
                userRole: currentContext.userRole
            });
            this.appendChildTo(stationEntryLogListItemView, '#station-entry-log-list');
        },
        removeAll: function() {
            this.children.chain().clone().each(function(view) {
                if (view.$('.new-station-entry-log-view').length === 0) {
                    if (view.leave) {
                        view.leave();
                    }
                }
            });
        },
        addAllStationIdentifiers: function() {
            var currentContext = this;
            var filterRenderModel = {
                defaultOption: utils.getResource('stationNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.stationIdentifierCollection.models, 'stationId', 'stationName')
            };
            this.$('#station-entry-log-list-station-identifier-select').html(filterTemplate(filterRenderModel));
        },
        addAllRegions: function() {
            var currentContext = this;
            var filterRenderModel = {
                defaultOption: utils.getResource('regionNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.regionCollection.models, 'regionName', 'regionName')
            };
            this.$('#station-entry-log-list-region-filter').html(filterTemplate(filterRenderModel));
        },
        addAllAreas: function() {
            var currentContext = this;
            var filterRenderModel = {
                defaultOption: utils.getResource('areaNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.areaCollection.models, 'areaName', 'areaName')
            };
            this.$('#station-entry-log-list-area-filter').html(filterTemplate(filterRenderModel));
        },
        setAutRefreshInterval: function() {
            var currentContext = this;
            autoRefreshInterval = globals.window.setInterval(function() {
                currentContext.refreshStationEntryLogList();
            }, env.getAutoRefreshInterval());
        },
        dispatchRefreshStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.refreshStationEntryLogList();
        },
        refreshStationEntryLogList: function() {
            this.showLoading();
            var status = this.$('#station-entry-log-list-status-filter').val();
            var region = this.$('#station-entry-log-list-region-filter').val();
            var area = this.$('#station-entry-log-list-area-filter').val();
            var options = {
                regionName: region,
                areaName: area
            };
            if (status === 'open') {
                options.onlyOpen = true;
            } else {
                options.onlyExpired = true;
            }
            this.dispatcher.trigger(AppEventNamesEnum.showStationEntryLogs, options);
        },
        resetStationEntryLogListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();
            this.$('#station-entry-log-list-status-filter').val('open');
            this.$('#station-entry-log-list-region-filter').val('');
            this.$('#station-entry-log-list-area-filter').val('');
            this.$('#station-entry-log-list-region-sort-button').removeData('sort-direction');
            this.$('#station-entry-log-list-area-sort-button').removeData('sort-direction');
            var sortAttributes = [{
                    sortAttribute: 'expectedOutTime',
                    sortDirection: 1
                }];
            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            this.dispatcher.trigger(AppEventNamesEnum.showStationEntryLogs, {onlyOpen: true});
        },
        updateStationEntryLogListExpectedOutTimeSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.$('#station-entry-log-list-region-sort-button').removeData('sort-direction');
            this.$('#station-entry-log-list-area-sort-button').removeData('sort-direction');
            var sortAttributes = [{
                    sortAttribute: 'expectedOutTime',
                    sortDirection: 1
                }];
            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        updateStationEntryLogListRegionSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            var regionSortDirection = this.getDataSortDirection(this.$('#station-entry-log-list-region-sort-button'));
            var sortAttributes = [
                {
                    sortAttribute: 'regionName',
                    sortDirection: regionSortDirection
                },
                {
                    sortAttribute: 'expectedOutTime',
                    sortDirection: 1
                }
            ];
            this.$('#station-entry-log-list-region-sort-button').data('sort-direction', regionSortDirection.toString());
            this.$('#station-entry-log-list-area-sort-button').removeData('sort-direction');
            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        updateStationEntryLogListAreaSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            var areaSortDirection = this.getDataSortDirection(this.$('#station-entry-log-list-area-sort-button'));
            var sortAttributes = [
                {
                    sortAttribute: 'areaName',
                    sortDirection: areaSortDirection
                },
                {
                    sortAttribute: 'expectedOutTime',
                    sortDirection: 1
                }
            ];
            this.$('#station-entry-log-list-area-sort-button').data('sort-direction', areaSortDirection.toString());
            this.$('#station-entry-log-list-region-sort-button').removeData('sort-direction');
            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        showSortIndicators: function(sortAttributes) {
            this.$('#station-entry-log-list-region-sort-ascending-indicator').addClass('hidden');
            this.$('#station-entry-log-list-region-sort-descending-indicator').addClass('hidden');
            this.$('#station-entry-log-list-area-sort-ascending-indicator').addClass('hidden');
            this.$('#station-entry-log-list-area-sort-descending-indicator').addClass('hidden');
            if (sortAttributes && sortAttributes.length > 0) {
                for (var i in sortAttributes) {
                    var sortAttribute = sortAttributes[i].sortAttribute;
                    var sortDirection = sortAttributes[i].sortDirection;
                    if (sortAttribute === 'regionName') {
                        if (sortDirection === 1) {
                            this.$('#station-entry-log-list-region-sort-ascending-indicator').removeClass('hidden');
                        } else {
                            this.$('#station-entry-log-list-region-sort-descending-indicator').removeClass('hidden');
                        }
                    } else if (sortAttribute === 'areaName') {
                        if (sortDirection === 1) {
                            this.$('#station-entry-log-list-area-sort-ascending-indicator').removeClass('hidden');
                        } else {
                            this.$('#station-entry-log-list-area-sort-descending-indicator').removeClass('hidden');
                        }
                    }
                }
            }
        },
        getDataSortDirection: function(sortButton) {
            var sortDirection = 1;
            if (sortButton) {
                var data = sortButton.data('sort-direction');
                if (data) {
                    try {
                        sortDirection = parseInt(data);
                        sortDirection *= -1;
                    }
                    catch (nfex) {
                        console.error(nfex);
                        sortDirection = 1;
                    }
                }
            }
            return sortDirection;
        },
        setUserRole: function(userRole) {
            var currentContext = this;
            currentContext.userRole = userRole;
            currentContext.checkUserRole();
        },
        checkUserRole: function() {
            var currentContext = this;
            if (currentContext.userRole === UserRolesEnum.NocAdmin || currentContext.userRole === UserRolesEnum.NocUser) {
                currentContext.showNewStationEntryLogButton();
                if (currentContext.userRole === UserRolesEnum.NocAdmin) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.showAdminHeaderButtons);
                }
            } else {
                currentContext.hideNewStationEntryLogButton();
            }
        },
        hideNewStationEntryLogButton: function() {
            this.$('#new-station-entry-log-button').addClass('hidden');
        },
        showNewStationEntryLogButton: function() {
            this.$('#new-station-entry-log-button').removeClass('hidden');
        },
        goToNewStationEntryLog: function() {
            var currentContext = this;
            currentContext.newStationEntryLogModelInstance = new NewStationEntryLogModel();
            currentContext.newStationEntryLogViewInstance = new NewStationEntryLogView({
                model: currentContext.newStationEntryLogModelInstance,
                dispatcher: currentContext.dispatcher,
                stationIdentifierCollection: currentContext.stationIdentifierCollection,
                purposeCollection: currentContext.purposeCollection,
                durationCollection: currentContext.durationCollection
            });
            currentContext.renderChildInto(currentContext.newStationEntryLogViewInstance, currentContext.$('#new-station-entry-log-view-container'));
            this.hideNewStationEntryLogButton();
            this.dispatcher.trigger(AppEventNamesEnum.goToNewStationEntryLog);
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
        },
        onCheckInSuccess: function(stationEntryLog) {
            var checkInSucessMessage = utils.getResource('checkInSucessMessage');
            if (stationEntryLog) {
                var userName = stationEntryLog.userName;
                var stationName = stationEntryLog.stationName;
                checkInSucessMessage = 'Successful check-in for ' + userName + ' at ' + stationName;
            }
            this.showSuccess(checkInSucessMessage);
        },
        onCheckOutSuccess: function(stationEntryLog) {
            var checkOutSucessMessage = utils.getResource('checkOutSucessMessage');
            if (stationEntryLog) {
                var userName = stationEntryLog.userName;
                var stationName = stationEntryLog.stationName;
                checkOutSucessMessage = 'Successful check-out for ' + userName + ' at ' + stationName;
            }
            this.showSuccess(checkOutSucessMessage);
        },
        onCheckOutError: function(errorMessage, stationEntryLog) {
            this.showError(errorMessage);
        },
        onLeave: function() {
            if (autoRefreshInterval) {
                globals.window.clearInterval(autoRefreshInterval);
            }
        },
        updateExpiredCounts: function(options) {
            if (options.overdueCount > 0) {
                this.$('#svg-station-entry-log-overdue-count').removeClass('invisible');
                this.$('#station-entry-log-overdue-count').html(options.overdueCount);
            } else {
                this.$('#svg-station-entry-log-overdue-count').addClass('invisible');
            }
            if (options.expiredCount > 0) {
                this.$('#svg-station-entry-log-expired-count').removeClass('invisible');
                this.$('#station-entry-log-expired-count').html(options.expiredCount);
            } else {
                this.$('#svg-station-entry-log-expired-count').addClass('invisible');
            }
            if (options.openCount > 0) {
                this.$('#svg-station-entry-log-open-count').removeClass('invisible');
                this.$('#station-entry-log-open-count').html(options.openCount);
            } else {
                this.$('#svg-station-entry-log-open-count').addClass('invisible');
            }
        }
    });
    return StationEntryLogListView;
});
