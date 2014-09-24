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
                listFilterHeaderText: appResources.getResource('StationEntryLogListView.listFilterHeaderText').value,
                regionFilterDefaultOption: appResources.getResource('StationEntryLogListView.regionFilterDefaultOption').value,
                areaFilterDefaultOption: appResources.getResource('StationEntryLogListView.areaFilterDefaultOption').value,
                updateListFilterButtonText: appResources.getResource('StationEntryLogListView.updateListFilterButtonText').value,
                stationNameHeaderText: appResources.getResource('StationEntryLogListView.stationNameHeaderText').value,
                personnelNameHeaderText: appResources.getResource('StationEntryLogListView.personnelNameHeaderText').value,
                contactHeaderText: appResources.getResource('StationEntryLogListView.contactHeaderText').value,
                inTimeHeaderText: appResources.getResource('StationEntryLogListView.inTimeHeaderText').value,
                outTimeHeaderText: appResources.getResource('StationEntryLogListView.outTimeHeaderText').value,
                durationHeaderText: appResources.getResource('StationEntryLogListView.durationHeaderText').value,
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
            'click #station-entry-log-list-update-filter-button': 'updateStationEntryLogListFilter',
            'click #station-entry-log-list-region-sort-button': 'updateStationEntryLogListRegionSort',
            'click #station-entry-log-list-area-sort-button': 'updateStationEntryLogListAreaSort'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new StationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationEntryLogListItemView, '.view-list');
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
        updateStationEntryLogListRegionSort: function(event) {
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
                    this.$('#station-entry-log-list-region-sort-ascending-indicator').removeClass('hidden');
                    this.$('#station-entry-log-list-region-sort-descending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-area-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-area-sort-descending-indicator').addClass('hidden');
                } else {
                    this.$('#station-entry-log-list-region-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-region-sort-descending-indicator').removeClass('hidden');
                    this.$('#station-entry-log-list-area-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-area-sort-descending-indicator').addClass('hidden');
                }
                $(event.target).data('sortDirection', sortDirection.toString());
                this.collection.sortDirection = sortDirection;
            }

            this.collection.sortAttributes = ['region', 'expectedOutTime'];
            this.collection.sort();
        },
        updateStationEntryLogListAreaSort: function(event) {
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
                    this.$('#station-entry-log-list-region-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-region-sort-descending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-area-sort-ascending-indicator').removeClass('hidden');
                    this.$('#station-entry-log-list-area-sort-descending-indicator').addClass('hidden');
                } else {
                    this.$('#station-entry-log-list-region-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-region-sort-descending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-area-sort-ascending-indicator').addClass('hidden');
                    this.$('#station-entry-log-list-area-sort-descending-indicator').removeClass('hidden');
                }
                $(event.target).data('sortDirection', sortDirection.toString());
                this.collection.sortDirection = sortDirection;
            }

            this.collection.sortAttributes = ['area', 'expectedOutTime'];
            this.collection.sort();
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
