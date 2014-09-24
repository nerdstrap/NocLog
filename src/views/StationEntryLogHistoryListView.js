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
            template = require('hbs!templates/StationEntryLogHistoryList'),
            stationIdentifierListTemplate = require('hbs!templates/StationIdentifierList'),
            regionListTemplate = require('hbs!templates/RegionList'),
            areaListTemplate = require('hbs!templates/AreaList');

    var StationEntryLogHistoryListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc').value,
                loadingMessage: appResources.getResource('StationEntryLogHistoryListView.loadingMessage').value,
                errorMessage: appResources.getResource('StationEntryLogHistoryListView.errorMessage').value,
                infoMessage: appResources.getResource('StationEntryLogHistoryListView.infoMessage').value,
                listViewTitleText: appResources.getResource('StationEntryLogHistoryListView.listViewTitleText').value,
                stationIdentifierFilterDefaultOption: appResources.getResource('StationEntryLogHistoryListView.stationIdentifierFilterDefaultOption').value,
                regionFilterDefaultOption: appResources.getResource('StationEntryLogHistoryListView.regionFilterDefaultOption').value,
                areaFilterDefaultOption: appResources.getResource('StationEntryLogHistoryListView.areaFilterDefaultOption').value,
                updateListFilterButtonText: appResources.getResource('StationEntryLogHistoryListView.updateListFilterButtonText').value,
                stationNameHeaderText: appResources.getResource('StationEntryLogHistoryListView.stationNameHeaderText').value,
                personnelNameHeaderText: appResources.getResource('StationEntryLogHistoryListView.personnelNameHeaderText').value,
                contactHeaderText: appResources.getResource('StationEntryLogHistoryListView.contactHeaderText').value,
                inTimeHeaderText: appResources.getResource('StationEntryLogHistoryListView.inTimeHeaderText').value,
                outTimeHeaderText: appResources.getResource('StationEntryLogHistoryListView.outTimeHeaderText').value,
                durationHeaderText: appResources.getResource('StationEntryLogHistoryListView.durationHeaderText').value,
                expectedOutTimeHeaderText: appResources.getResource('StationEntryLogHistoryListView.expectedOutTimeHeaderText').value,
                purposeHeaderText: appResources.getResource('StationEntryLogHistoryListView.purposeHeaderText').value,
                additionalInfoHeaderText: appResources.getResource('StationEntryLogHistoryListView.additionalInfoHeaderText').value,
                regionHeaderText: appResources.getResource('StationEntryLogHistoryListView.regionHeaderText').value,
                areaHeaderText: appResources.getResource('StationEntryLogHistoryListView.areaHeaderText').value
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

            return this;
        },
        events: {
            'click #station-entry-log-history-list-update-filter-button': 'updateStationEntryLogHistoryListFilter',
            'click #station-entry-log-history-list-region-sort-button': 'updateStationEntryLogHistoryListRegionSort',
            'click #station-entry-log-history-list-area-sort-button': 'updateStationEntryLogHistoryListAreaSort'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new StationEntryLogHistoryListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationEntryLogListItemView, '.view-list');
        },
        addAllStationIdentifiers: function() {
            var currentContext = this;
            var stationIdentifierListRenderModel = {
                stationIdentifierFilterDefaultOption: currentContext.resources().stationIdentifierFilterDefaultOption,
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
        updateStationEntryLogHistoryListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = this.$('#station-entry-log-history-list-station-identifier-filter').val();
            var region = this.$('#station-entry-log-history-list-region-filter').val();
            var area = this.$('#station-entry-log-history-list-area-filter').val();

            var options = {
                stationId: stationId,
                region: region,
                area: area
            };

            this.dispatcher.trigger(AppEventNamesEnum.showStationEntryLogs, options);
        },
        updateStationEntryLogHistoryListRegionSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            if (event.target) {
                var sortDirection = $(event.target).data('sortDirection');
                if (sortDirection) {
                    sortDirection = parseInt(sortDirection);
                    sortDirection *= -1;
                } else {
                    sortDirection = 1;
                }
                if (sortDirection === 1) {
                    this.$('#station-entry-log-history-list-region-sort-ascending-indicator').removeClass('hidden');
                    this.$('#station-entry-log-history-list-region-sort-descending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-area-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-area-sort-descending-indicator').addClass('hidden');
                } else {
                    this.$('#station-entry-log-history-list-region-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-region-sort-descending-indicator').removeClass('hidden');
                    this.$('#station-entry-log-history-list-area-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-area-sort-descending-indicator').addClass('hidden');
                }
                $(event.target).data('sortDirection', sortDirection.toString());
                this.collection.sortDirection = sortDirection;
            }

            this.collection.sortAttributes = ['region', 'outTime'];
            this.collection.sort();
        },
        updateStationEntryLogHistoryListAreaSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            if (event.target) {
                var sortDirection = $(event.target).data('sortDirection');
                if (sortDirection) {
                    sortDirection = parseInt(sortDirection);
                    sortDirection *= -1;
                } else {
                    sortDirection = 1;
                }
                if (sortDirection === 1) {
                    this.$('#station-entry-log-history-list-region-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-region-sort-descending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-area-sort-ascending-indicator').removeClass('hidden');
                    this.$('#station-entry-log-history-list-area-sort-descending-indicator').addClass('hidden');
                } else {
                    this.$('#station-entry-log-history-list-region-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-region-sort-descending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-area-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-history-list-area-sort-descending-indicator').removeClass('hidden');
                }
                $(event.target).data('sortDirection', sortDirection.toString());
                this.collection.sortDirection = sortDirection;
            }

            this.collection.sortAttributes = ['area', 'outTime'];
            this.collection.sort();
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