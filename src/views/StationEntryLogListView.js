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
            UserRoleEnum = require('enums/UserRoleEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationEntryLogList'),
            regionListTemplate = require('hbs!templates/RegionList'),
            areaListTemplate = require('hbs!templates/AreaList');

    var checkExpireInterval;

    var StationEntryLogListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc'),
                loadingMessage: appResources.getResource('StationEntryLogListView.loadingMessage'),
                errorMessage: appResources.getResource('StationEntryLogListView.errorMessage'),
                infoMessage: appResources.getResource('StationEntryLogListView.infoMessage'),
                listViewTitleText: appResources.getResource('StationEntryLogListView.listViewTitleText'),
                statusFilterOpenOption: appResources.getResource('StationEntryLogListView.statusFilterOpenOption'),
                statusFilterExpiredOption: appResources.getResource('StationEntryLogListView.statusFilterExpiredOption'),
                regionFilterDefaultOption: appResources.getResource('StationEntryLogListView.regionFilterDefaultOption'),
                areaFilterDefaultOption: appResources.getResource('StationEntryLogListView.areaFilterDefaultOption'),
                refreshListButtonText: appResources.getResource('StationEntryLogListView.refreshListButtonText'),
                resetListOptionsButtonText: appResources.getResource('StationEntryLogListView.resetListOptionsButtonText'),
                newStationEntryLogButtonText: appResources.getResource('StationEntryLogListView.newStationEntryLogButtonText'),
                stationNameHeaderText: appResources.getResource('StationEntryLogListView.stationNameHeaderText'),
                personnelNameHeaderText: appResources.getResource('StationEntryLogListView.personnelNameHeaderText'),
                contactHeaderText: appResources.getResource('StationEntryLogListView.contactHeaderText'),
                inTimeHeaderText: appResources.getResource('StationEntryLogListView.inTimeHeaderText'),
                expectedOutTimeHeaderText: appResources.getResource('StationEntryLogListView.expectedOutTimeHeaderText'),
                purposeHeaderText: appResources.getResource('StationEntryLogListView.purposeHeaderText'),
                additionalInfoHeaderText: appResources.getResource('StationEntryLogListView.additionalInfoHeaderText'),
                regionHeaderText: appResources.getResource('StationEntryLogListView.regionHeaderText'),
                areaHeaderText: appResources.getResource('StationEntryLogListView.areaHeaderText')
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLogListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCollection = options.stationIdentifierCollection;
            this.regionCollection = options.regionCollection;
            this.areaCollection = options.areaCollection;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.regionCollection, 'reset', this.addAllRegions);
            this.listenTo(this.areaCollection, 'reset', this.addAllAreas);

            this.listenTo(appEvents, AppEventNamesEnum.leaveNewStationEntryLogView, this.showNewStationEntryLogButton);
            this.listenTo(appEvents, AppEventNamesEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutSuccess, this.onCheckOutSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutError, this.onCheckOutError);
        },
        render: function() {
            console.trace('StationEntryLogListView.render()');
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));
            _.each(this.collection.models, this.addOne, this);
            this.checkDurationExpiredEveryMinute();
            return this;
        },
        events: {
            'click #station-entry-log-list-refresh-list-button': 'refreshStationEntryLogList',
            'click #station-entry-log-list-reset-list-options-button': 'resetStationEntryLogListFilter',
            'click #station-entry-log-list-expected-out-time-sort-button': 'updateStationEntryLogListExpectedOutTimeSort',
            'click #station-entry-log-list-region-sort-button': 'updateStationEntryLogListRegionSort',
            'click #station-entry-log-list-area-sort-button': 'updateStationEntryLogListAreaSort',
            'click #new-station-entry-log-button': 'goToNewStationEntryLog'
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
        addAllRegions: function() {
            var currentContext = this;
            var regionListRenderModel = {
                regionFilterDefaultOption: currentContext.resources().regionFilterDefaultOption,
                regions: currentContext.regionCollection.models
            };
            this.$('#station-entry-log-list-region-filter').html(regionListTemplate(regionListRenderModel));
        },
        addAllAreas: function() {
            var currentContext = this;
            var areaListRenderModel = {
                areaFilterDefaultOption: currentContext.resources().areaFilterDefaultOption,
                areas: currentContext.areaCollection.models
            };
            this.$('#station-entry-log-list-area-filter').html(areaListTemplate(areaListRenderModel));
        },
        dispatchRefreshStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatchRefreshStationEntryListEvent();
        },
        refreshStationEntryLogList: function() {
            this.showLoading();
            var status = this.$('#station-entry-log-list-status-filter').val();
            var region = this.$('#station-entry-log-list-region-filter').val();
            var area = this.$('#station-entry-log-list-area-filter').val();
            var options = {
                region: region,
                area: area
            };
            if (status === 'open') {
                this.dispatcher.trigger(AppEventNamesEnum.showOpenStationEntryLogs, options);
            }
            if (status === 'expired') {
                this.dispatcher.trigger(AppEventNamesEnum.showExpiredStationEntryLogs, options);
            }
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
            this.dispatcher.trigger(AppEventNamesEnum.showOpenStationEntryLogs);
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
                    sortAttribute: 'region',
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
                    sortAttribute: 'area',
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
                    if (sortAttribute === 'region') {
                        if (sortDirection === 1) {
                            this.$('#station-entry-log-list-region-sort-ascending-indicator').removeClass('hidden');
                        } else {
                            this.$('#station-entry-log-list-region-sort-descending-indicator').removeClass('hidden');
                        }
                    } else if (sortAttribute === 'area') {
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
        onCheckInSuccess: function() {
            var msg = 'Check in was successful.',
                    currentContext = this;
            this.showInfo(msg);
            this.showNewStationEntryLogButton();
            setTimeout(function() {
                currentContext.hideInfo();
            }, 10000);
        },
        onCheckOutSuccess: function() {
            var msg = 'Check out was successful.',
                    currentContext = this;
            this.showInfo(msg);
            setTimeout(function() {
                currentContext.hideInfo();
            }, 10000);
        },
        checkUserRole: function() {
            if (this.userRole === UserRoleEnum.NocAdmin || this.userRole === UserRoleEnum.NocUser) {
                this.showNewStationEntryLogButton();
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
        showError: function(message) {
            this.$('.list-view-error .text-detail').html(message);
            this.$('.list-view-error').removeClass('hidden');
        },
        hideError: function() {
            this.$('.list-view-error').addClass('hidden');
        },
        showInfo: function(message) {
            this.$('.list-view-info .text-detail').html(message);
            this.$('.list-view-info').removeClass('hidden');
        },
        hideInfo: function() {
            this.$('.list-view-info').addClass('hidden');
        },
        autRefresh: function() {
            var currentContext = this;
            if (currentContext.autRefresh.timeout) {
                
            }
            checkExpireInterval = setInterval(function() {
                currentContext.refreshStationEntryLogList();
            }, 60000);
        },
        onLeave: function() {
            clearInterval(checkExpireInterval);
        }
    });
    return StationEntryLogListView;
});
