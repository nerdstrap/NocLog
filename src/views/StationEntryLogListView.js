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
            template = require('hbs!templates/StationEntryLogList'),
            regionListTemplate = require('hbs!templates/RegionList'),
            areaListTemplate = require('hbs!templates/AreaList');

    var StationEntryLogListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc').value,
                loadingMessage: appResources.getResource('StationEntryLogListView.loadingMessage').value,
                errorMessage: appResources.getResource('StationEntryLogListView.errorMessage').value,
                infoMessage: appResources.getResource('StationEntryLogListView.infoMessage').value,
                listViewTitleText: appResources.getResource('StationEntryLogListView.listViewTitleText').value,
                statusFilterOpenOption: appResources.getResource('StationEntryLogListView.statusFilterOpenOption').value,
                statusFilterExpiredOption: appResources.getResource('StationEntryLogListView.statusFilterExpiredOption').value,
                regionFilterDefaultOption: appResources.getResource('StationEntryLogListView.regionFilterDefaultOption').value,
                areaFilterDefaultOption: appResources.getResource('StationEntryLogListView.areaFilterDefaultOption').value,
                refreshListButtonText: appResources.getResource('StationEntryLogHistoryListView.refreshListButtonText').value,
                showListOptionsButtonText: appResources.getResource('StationEntryLogHistoryListView.showListOptionsButtonText').value,
                resetListOptionsButtonText: appResources.getResource('StationEntryLogHistoryListView.resetListOptionsButtonText').value,
                stationNameHeaderText: appResources.getResource('StationEntryLogListView.stationNameHeaderText').value,
                personnelNameHeaderText: appResources.getResource('StationEntryLogListView.personnelNameHeaderText').value,
                contactHeaderText: appResources.getResource('StationEntryLogListView.contactHeaderText').value,
                inTimeHeaderText: appResources.getResource('StationEntryLogListView.inTimeHeaderText').value,
                expectedOutTimeHeaderText: appResources.getResource('StationEntryLogListView.expectedOutTimeHeaderText').value,
                purposeHeaderText: appResources.getResource('StationEntryLogListView.purposeHeaderText').value,
                additionalInfoHeaderText: appResources.getResource('StationEntryLogListView.additionalInfoHeaderText').value,
                regionHeaderText: appResources.getResource('StationEntryLogListView.regionHeaderText').value,
                areaHeaderText: appResources.getResource('StationEntryLogListView.areaHeaderText').value
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLogListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.regionCollection = options.regionCollection || new Backbone.Collection();
            this.areaCollection = options.areaCollection || new Backbone.Collection();

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.regionCollection, 'reset', this.addAllRegions);
            this.listenTo(this.areaCollection, 'reset', this.addAllAreas);
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
            'click #station-entry-log-list-refresh-list-button': 'refreshStationEntryLogList',
            'click #station-entry-log-list-show-list-options-button': 'showStationEntryLogListFilter',
            'click #station-entry-log-list-reset-list-options-button': 'resetStationEntryLogListFilter',
            'click #station-entry-log-list-expected-out-time-sort-button': 'updateStationEntryLogListExpectedOutTimeSort',
            'click #station-entry-log-list-region-sort-button': 'updateStationEntryLogListRegionSort',
            'click #station-entry-log-list-area-sort-button': 'updateStationEntryLogListAreaSort'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new StationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationEntryLogListItemView, '#station-entry-log-list');
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
        updateStationEntryLogListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            
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
        showStationEntryLogListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.$('#station-entry-log-list-options-view').removeClass('hidden');
            this.$('#station-entry-log-list-reset-list-options-button').removeClass('hidden');
        },
        resetStationEntryLogListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            
            this.showLoading();

            this.$('#station-entry-log-list-reset-list-options-button').addClass('hidden');
            this.$('#station-entry-log-list-options-view').addClass('hidden');

            this.dispatcher.trigger(AppEventNamesEnum.showOpenStationEntryLogs);
        },
        updateStationEntryLogListExpectedOutTimeSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.showSortIndicators();

            this.$('#station-entry-log-list-region-sort-button').removeData('sort-direction');
            this.$('#station-entry-log-list-area-sort-button').removeData('sort-direction');

            this.collection.sortDirection = 1;
            this.collection.sortAttributes = ['expectedOutTime'];
            this.collection.sort();
        },
        updateStationEntryLogListRegionSort: function(event) {
            if (event) {
                event.preventDefault();
            }
            var sortAttributes = ['region', 'expectedOutTime'];
            
            var sortDirection = this.$('#station-entry-log-list-region-sort-button').data('sort-direction');
            if (sortDirection) {
                sortDirection = parseInt(sortDirection);
                sortDirection *= -1;
            } else {
                sortDirection = 1;
            }
            
            this.showSortIndicators(sortAttributes, sortDirection);
            this.$('#station-entry-log-list-region-sort-button').data('sort-direction', sortDirection.toString());
            this.$('#station-entry-log-list-area-sort-button').removeData('sort-direction');
            
            this.collection.sortDirection = sortDirection;
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        updateStationEntryLogListAreaSort: function(event) {
            if (event) {
                event.preventDefault();
            }
            
            var sortAttributes = ['area', 'expectedOutTime'];
            
            var sortDirection = this.$('#station-entry-log-list-area-sort-button').data('sort-direction');
            if (sortDirection) {
                sortDirection = parseInt(sortDirection);
                sortDirection *= -1;
            } else {
                sortDirection = 1;
            }
            this.showSortIndicators(sortAttributes, sortDirection);
            this.$('#station-entry-log-list-region-sort-button').removeData('sort-direction');
            this.$('#station-entry-log-list-area-sort-button').data('sort-direction', sortDirection.toString());
            
            this.collection.sortDirection = sortDirection;
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        showSortIndicators: function(sortAttributes, sortDirection) {
            this.$('#station-entry-log-list-region-sort-ascending-indicator').addClass('hidden');
            this.$('#station-entry-log-list-region-sort-descending-indicator').addClass('hidden');
            this.$('#station-entry-log-list-area-sort-ascending-indicator').addClass('hidden');
            this.$('#station-entry-log-list-area-sort-descending-indicator').addClass('hidden');
            
            if (sortAttributes && sortAttributes.length > 0) {
                var sortAttribute = sortAttributes[0];
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
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        }
    });

    return StationEntryLogListView;
});
