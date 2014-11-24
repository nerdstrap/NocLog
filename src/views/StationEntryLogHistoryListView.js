define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            StationEntryLogHistoryListItemView = require('views/StationEntryLogHistoryListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/StationEntryLogHistoryList'),
            filterTemplate = require('hbs!templates/Filter');

    var StationEntryLogHistoryListView = CompositeView.extend({
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

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            _.each(this.collection.models, this.addOne, this);

            currentContext.setDefaultDateFilters(-1);

            return this;
        },
        events: {
            'click #station-entry-log-history-list-refresh-list-button': 'refreshStationEntryLogHistoryList',
            'click #station-entry-log-history-list-reset-list-options-button': 'resetStationEntryLogHistoryListFilter',
            'click #personnel-station-entry-log-list-refresh-seven-days-button': 'setDateFilter',
            'click #personnel-station-entry-log-list-refresh-fourteen-days-button': 'setDateFilter',
            'click #personnel-station-entry-log-list-refresh-thirty-days-button': 'setDateFilter',
            'click #personnel-station-entry-log-list-refresh-ninety-days-button': 'setDateFilter',
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
            var filterRenderModel = {
                defaultOption: utils.getResource('stationNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.stationIdentifierCollection.models, 'stationId', 'stationName')
            };
            this.$('#station-entry-log-history-list-station-identifier-filter').html(filterTemplate(filterRenderModel));
        },
        addAllRegions: function() {
            var currentContext = this;
            var filterRenderModel = {
                defaultOption: utils.getResource('regionNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.regionCollection.models, 'regionName', 'regionName')
            };
            this.$('#station-entry-log-history-list-region-filter').html(filterTemplate(filterRenderModel));
        },
        addAllAreas: function() {
            var currentContext = this;
            var filterRenderModel = {
                defaultOption: utils.getResource('areaNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.areaCollection.models, 'areaName', 'areaName')
            };
            this.$('#station-entry-log-history-list-area-filter').html(filterTemplate(filterRenderModel));
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
                regionName: region,
                areaName: area,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                onlyCheckedOut: true
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
            
            var options = {
                onlyCheckedOut: true
            };

            this.dispatcher.trigger(AppEventNamesEnum.showStationEntryLogs, options);
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
                    sortAttribute: 'regionName',
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
                    sortAttribute: 'areaName',
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
                    if (sortAttribute === 'regionName') {
                        if (sortDirection === 1) {
                            this.$('#station-entry-log-history-list-region-sort-ascending-indicator').removeClass('hidden');
                        } else {
                            this.$('#station-entry-log-history-list-region-sort-descending-indicator').removeClass('hidden');
                        }
                    } else if (sortAttribute === 'areaName') {
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
            this.refreshStationEntryLogHistoryList();
        },
        setDefaultDateFilters: function(daysToAdd) {
            var today = new Date();
            var yesterday = utils.addDays(Date.now(), daysToAdd);

            this.$('#station-entry-log-history-list-start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#station-entry-log-history-list-start-time-filter').val('00:00');
            this.$('#station-entry-log-history-list-end-date-filter').val(utils.getFormattedDate(today));
            this.$('#station-entry-log-history-list-end-time-filter').val('23:59');
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
