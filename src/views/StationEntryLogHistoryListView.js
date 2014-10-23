define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            StationEntryLogHistoryListItemView = require('views/StationEntryLogHistoryListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            utils = require('utils'),
            template = require('hbs!templates/StationEntryLogHistoryList'),
            stationIdentifierListTemplate = require('hbs!templates/StationIdentifierList'),
            regionListTemplate = require('hbs!templates/RegionList'),
            areaListTemplate = require('hbs!templates/AreaList');

    var StationEntryLogHistoryListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc'),
                loadingMessage: appResources.getResource('StationEntryLogHistoryListView.loadingMessage'),
                errorMessage: appResources.getResource('StationEntryLogHistoryListView.errorMessage'),
                infoMessage: appResources.getResource('StationEntryLogHistoryListView.infoMessage'),
                listViewTitleText: appResources.getResource('StationEntryLogHistoryListView.listViewTitleText'),
                stationIdentifierFilterDefaultOption: appResources.getResource('StationEntryLogHistoryListView.stationIdentifierFilterDefaultOption'),
                regionFilterDefaultOption: appResources.getResource('StationEntryLogHistoryListView.regionFilterDefaultOption'),
                areaFilterDefaultOption: appResources.getResource('StationEntryLogHistoryListView.areaFilterDefaultOption'),
                refreshListButtonText: appResources.getResource('StationEntryLogHistoryListView.refreshListButtonText'),
                resetListOptionsButtonText: appResources.getResource('StationEntryLogHistoryListView.resetListOptionsButtonText'),
                stationNameHeaderText: appResources.getResource('StationEntryLogHistoryListView.stationNameHeaderText'),
                personnelNameHeaderText: appResources.getResource('StationEntryLogHistoryListView.personnelNameHeaderText'),
                contactHeaderText: appResources.getResource('StationEntryLogHistoryListView.contactHeaderText'),
                inTimeHeaderText: appResources.getResource('StationEntryLogHistoryListView.inTimeHeaderText'),
                outTimeHeaderText: appResources.getResource('StationEntryLogHistoryListView.outTimeHeaderText'),
                purposeHeaderText: appResources.getResource('StationEntryLogHistoryListView.purposeHeaderText'),
                additionalInfoHeaderText: appResources.getResource('StationEntryLogHistoryListView.additionalInfoHeaderText'),
                regionHeaderText: appResources.getResource('StationEntryLogHistoryListView.regionHeaderText'),
                areaHeaderText: appResources.getResource('StationEntryLogHistoryListView.areaHeaderText'),
                startDateTimeHeaderText: appResources.getResource('StationEntryLogHistoryListView.startDateTimeHeaderText'),
                endDateTimeHeaderText: appResources.getResource('StationEntryLogHistoryListView.endDateTimeHeaderText')
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLogHistoryListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCollection = options.stationIdentifierCollection || new Backbone.Collection();
            this.regionCollection = options.regionCollection || new Backbone.Collection();
            this.areaCollection = options.areaCollection || new Backbone.Collection();

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addAllStationIdentifiers);
            this.listenTo(this.regionCollection, 'reset', this.addAllRegions);
            this.listenTo(this.areaCollection, 'reset', this.addAllAreas);
        },
        render: function() {
            console.trace('StationEntryLogHistoryListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            _.each(this.collection.models, this.addOne, this);

            var today = new Date();
            var yesterday = utils.addDays(Date.now(), -1);

            this.$('#station-entry-log-history-list-start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#station-entry-log-history-list-end-date-filter').val(utils.getFormattedDate(today));

            return this;
        },
        events: {
            'click #station-entry-log-history-list-refresh-list-button': 'refreshStationEntryLogHistoryList',
            'click #station-entry-log-history-list-reset-list-options-button': 'resetStationEntryLogHistoryListFilter',
            'click #station-entry-log-history-list-out-time-sort-button': 'updateStationEntryLogHistoryListOutTimeSort',
            'click #station-entry-log-history-list-region-sort-button': 'updateStationEntryLogHistoryListRegionSort',
            'click #station-entry-log-history-list-area-sort-button': 'updateStationEntryLogHistoryListAreaSort'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new StationEntryLogHistoryListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationEntryLogListItemView, '#station-entry-log-history-list');
        },
        addAllStationIdentifiers: function() {
            var currentContext = this;
            var stationIdentifierListRenderModel = {
                defaultOption: currentContext.resources().stationIdentifierFilterDefaultOption,
                stationIdentifiers: currentContext.stationIdentifierCollection.models
            };
            this.$('#station-entry-log-history-list-station-identifier-filter').html(stationIdentifierListTemplate(stationIdentifierListRenderModel));
        },
        addAllRegions: function() {
            var currentContext = this;
            var regionListRenderModel = {
                regionFilterDefaultOption: currentContext.resources().regionFilterDefaultOption,
                regions: currentContext.regionCollection.models
            };
            this.$('#station-entry-log-history-list-region-filter').html(regionListTemplate(regionListRenderModel));
        },
        addAllAreas: function() {
            var currentContext = this;
            var areaListRenderModel = {
                areaFilterDefaultOption: currentContext.resources().areaFilterDefaultOption,
                areas: currentContext.areaCollection.models
            };
            this.$('#station-entry-log-history-list-area-filter').html(areaListTemplate(areaListRenderModel));
        },
        refreshStationEntryLogHistoryList: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();

            var stationId = this.$('#station-entry-log-history-list-station-identifier-filter').val();
            var region = this.$('#station-entry-log-history-list-region-filter').val();
            var area = this.$('#station-entry-log-history-list-area-filter').val();
            var startDate = this.$('#station-entry-log-history-list-start-date-filter').val();
            var startTime = this.$('#station-entry-log-history-list-start-time-filter').val();
            var endDate = this.$('#station-entry-log-history-list-end-date-filter').val();
            var endTime = this.$('#station-entry-log-history-list-end-time-filter').val();

            var options = {
                stationId: stationId,
                region: region,
                area: area,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime
            };

            this.dispatcher.trigger(AppEventNamesEnum.showStationEntryLogs, options);
        },
        resetStationEntryLogHistoryListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();

            var today = new Date();
            var yesterday = utils.addDays(Date.now(), -1);

            this.$('#station-entry-log-history-list-station-identifier-filter').val('');
            this.$('#station-entry-log-history-list-region-filter').val('');
            this.$('#station-entry-log-history-list-area-filter').val('');
            this.$('#station-entry-log-history-list-start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#station-entry-log-history-list-start-time-filter').val('');
            this.$('#station-entry-log-history-list-end-date-filter').val(utils.getFormattedDate(today));
            this.$('#station-entry-log-history-list-end-time-filter').val('');

            this.$('#station-entry-log-history-list-region-sort-button').removeData('sort-direction');
            this.$('#station-entry-log-history-list-area-sort-button').removeData('sort-direction');

            var sortAttributes = [{
                    sortAttribute: 'outTime',
                    sortDirection: 1
                }];

            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;

            this.dispatcher.trigger(AppEventNamesEnum.showStationEntryLogs);
        },
        updateStationEntryLogHistoryListOutTimeSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.$('#station-entry-log-history-list-region-sort-button').removeData('sort-direction');
            this.$('#station-entry-log-history-list-area-sort-button').removeData('sort-direction');

            var sortAttributes = [
                {
                    sortAttribute: 'outTime',
                    sortDirection: 1
                }
            ];

            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;

            this.collection.sort();
        },
        updateStationEntryLogHistoryListRegionSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            var regionSortDirection = this.getDataSortDirection(this.$('#station-entry-log-history-list-region-sort-button'));

            var sortAttributes = [
                {
                    sortAttribute: 'region',
                    sortDirection: regionSortDirection
                },
                {
                    sortAttribute: 'outTime',
                    sortDirection: 1
                }
            ];
            
            this.$('#station-entry-log-history-list-region-sort-button').data('sort-direction', regionSortDirection.toString());
            this.$('#station-entry-log-history-list-area-sort-button').removeData('sort-direction');

            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            
            this.collection.sort();
        },
        updateStationEntryLogHistoryListAreaSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            var areaSortDirection = this.getDataSortDirection(this.$('#station-entry-log-history-list-area-sort-button'));

            var sortAttributes = [
                {
                    sortAttribute: 'area',
                    sortDirection: areaSortDirection
                },
                {
                    sortAttribute: 'outTime',
                    sortDirection: 1
                }
            ];
            
            this.$('#station-entry-log-history-list-area-sort-button').data('sort-direction', areaSortDirection.toString());
            this.$('#station-entry-log-history-list-region-sort-button').removeData('sort-direction');

            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            
            this.collection.sort();
        },
        showSortIndicators: function(sortAttributes) {
            this.$('#station-entry-log-history-list-region-sort-ascending-indicator').addClass('hidden');
            this.$('#station-entry-log-history-list-region-sort-descending-indicator').addClass('hidden');
            this.$('#station-entry-log-history-list-area-sort-ascending-indicator').addClass('hidden');
            this.$('#station-entry-log-history-list-area-sort-descending-indicator').addClass('hidden');

            if (sortAttributes && sortAttributes.length > 0) {
                for (var i in sortAttributes) {
                    var sortAttribute = sortAttributes[i].sortAttribute;
                    var sortDirection = sortAttributes[i].sortDirection;
                    if (sortAttribute === 'region') {
                        if (sortDirection === 1) {
                            this.$('#station-entry-log-history-list-region-sort-ascending-indicator').removeClass('hidden');
                        } else {
                            this.$('#station-entry-log-history-list-region-sort-descending-indicator').removeClass('hidden');
                        }
                    } else if (sortAttribute === 'area') {
                        if (sortDirection === 1) {
                            this.$('#station-entry-log-history-list-area-sort-ascending-indicator').removeClass('hidden');
                        } else {
                            this.$('#station-entry-log-history-list-area-sort-descending-indicator').removeClass('hidden');
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
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        }
    });

    return StationEntryLogHistoryListView;
});
