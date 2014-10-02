define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            StationListItemView = require('views/StationListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationList'),
            regionListTemplate = require('hbs!templates/RegionList'),
            areaListTemplate = require('hbs!templates/AreaList');

    var StationListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc').value,
                loadingMessage: appResources.getResource('StationListView.loadingMessage').value,
                errorMessage: appResources.getResource('StationListView.errorMessage').value,
                infoMessage: appResources.getResource('StationListView.infoMessage').value,
                listViewTitleText: appResources.getResource('StationListView.listViewTitleText').value,
                refreshListButtonText: appResources.getResource('StationListView.refreshListButtonText').value,
                showListOptionsButtonText: appResources.getResource('StationListView.showListOptionsButtonText').value,
                resetListOptionsButtonText: appResources.getResource('StationListView.resetListOptionsButtonText').value,
                regionFilterDefaultOption: appResources.getResource('StationListView.regionFilterDefaultOption').value,
                areaFilterDefaultOption: appResources.getResource('StationListView.areaFilterDefaultOption').value,
                stationNameHeaderText: appResources.getResource('StationListView.stationNameHeaderText').value,
                regionHeaderText: appResources.getResource('StationListView.regionHeaderText').value,
                areaHeaderText: appResources.getResource('StationListView.areaHeaderText').value
            };
        },
        initialize: function(options) {
            console.trace('StationListView.initialize');
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
            console.trace('StationListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            _.each(this.collection.models, this.addOne, this);

            return this;
        },
        events: {
            'click #station-list-refresh-list-button': 'refreshStationList',
            'click #station-list-show-list-options-button': 'showStationListFilter',
            'click #station-list-reset-list-options-button': 'resetStationListFilter',
            'click #station-list-station-name-sort-button': 'updateStationListStationNameSort',
            'click #station-list-region-sort-button': 'updateStationListRegionSort',
            'click #station-list-area-sort-button': 'updateStationListAreaSort'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function(station) {
            var currentContext = this;
            var stationListItemView = new StationListItemView({
                model: station,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationListItemView, '#station-list');
        },
        addAllRegions: function() {
            var currentContext = this;
            var regionListRenderModel = {
                regionFilterDefaultOption: currentContext.resources().regionFilterDefaultOption,
                regions: currentContext.regionCollection.models
            };
            this.$('#station-list-region-filter').html(regionListTemplate(regionListRenderModel));
        },
        addAllAreas: function() {
            var currentContext = this;
            var areaListRenderModel = {
                areaFilterDefaultOption: currentContext.resources().areaFilterDefaultOption,
                areas: currentContext.areaCollection.models
            };
            this.$('#station-list-area-filter').html(areaListTemplate(areaListRenderModel));
        },
        refreshStationList: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();
            
            var status = 'all';
            var region = this.$('#station-list-region-filter').val();
            var area = this.$('#station-list-area-filter').val();

            var options = {
                region: region,
                area: area
            };

            if (status === 'all') {
                this.dispatcher.trigger(AppEventNamesEnum.showStations, options);
            }
        },
        showStationListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.$('#station-list-options-view').removeClass('hidden');
            this.$('#station-list-reset-list-options-button').removeClass('hidden');
        },
        resetStationListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            
            this.showLoading();

            this.$('#station-list-reset-list-options-button').addClass('hidden');
            this.$('#station-list-options-view').addClass('hidden');

            this.dispatcher.trigger(AppEventNamesEnum.showStations);
        },
        updateStationListStationNameSort: function(event) {
            if (event) {
                event.preventDefault();
            }
            var sortAttributes = ['stationName'];
            var sortDirection = this.$('#station-list-station-name-sort-button').data('sort-direction');
            if (sortDirection) {
                sortDirection = parseInt(sortDirection);
                sortDirection *= -1;
            } else {
                sortDirection = 1;
            }
            this.showSortIndicators(sortAttributes, sortDirection);
            this.$('#station-list-station-name-sort-button').data('sort-direction', sortDirection.toString());
            this.$('#station-list-region-sort-button').removeData('sort-direction');
            this.$('#station-list-area-sort-button').removeData('sort-direction');
            
            this.collection.sortDirection = sortDirection;
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        updateStationListRegionSort: function(event) {
            if (event) {
                event.preventDefault();
            }
            
            var sortAttributes = ['region'];
            
            var sortDirection = this.$('#station-list-region-sort-button').data('sort-direction');
            if (sortDirection) {
                sortDirection = parseInt(sortDirection);
                sortDirection *= -1;
            } else {
                sortDirection = 1;
            }
            this.showSortIndicators(sortAttributes, sortDirection);
            this.$('#station-list-station-name-sort-button').removeData('sort-direction').removeAttr('data-sort-direction');
            this.$('#station-list-region-sort-button').data('sort-direction', sortDirection.toString());
            this.$('#station-list-area-sort-button').removeData('sort-direction');
            
            this.collection.sortDirection = sortDirection;
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        updateStationListAreaSort: function(event) {
            if (event) {
                event.preventDefault();
            }
            
            var sortAttributes = ['area'];
            
            var sortDirection = this.$('#station-list-area-sort-button').data('sort-direction');
            if (sortDirection) {
                sortDirection = parseInt(sortDirection);
                sortDirection *= -1;
            } else {
                sortDirection = 1;
            }
            this.showSortIndicators(sortAttributes, sortDirection);
            this.$('#station-list-station-name-sort-button').removeData('sort-direction').removeAttr('data-sort-direction');
            this.$('#station-list-region-sort-button').removeData('sort-direction');
            this.$('#station-list-area-sort-button').data('sort-direction', sortDirection.toString());
            
            this.collection.sortDirection = sortDirection;
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        showSortIndicators: function(sortAttributes, sortDirection) {
            this.$('#station-list-station-name-sort-ascending-indicator').addClass('hidden');
            this.$('#station-list-station-name-sort-descending-indicator').addClass('hidden');
            this.$('#station-list-region-sort-ascending-indicator').addClass('hidden');
            this.$('#station-list-region-sort-descending-indicator').addClass('hidden');
            this.$('#station-list-area-sort-ascending-indicator').addClass('hidden');
            this.$('#station-list-area-sort-descending-indicator').addClass('hidden');
            
            if (sortAttributes && sortAttributes.length > 0) {
                var sortAttribute = sortAttributes[0];
                 if (sortAttribute === 'stationName') {
                    if (sortDirection === 1) {
                        this.$('#station-list-station-name-sort-ascending-indicator').removeClass('hidden');
                    } else {
                        this.$('#station-list-station-name-sort-descending-indicator').removeClass('hidden');
                    }
                } else if (sortAttribute === 'region') {
                    if (sortDirection === 1) {
                        this.$('#station-list-region-sort-ascending-indicator').removeClass('hidden');
                    } else {
                        this.$('#station-list-region-sort-descending-indicator').removeClass('hidden');
                    }
                } else if (sortAttribute === 'area') {
                    if (sortDirection === 1) {
                        this.$('#station-list-area-sort-ascending-indicator').removeClass('hidden');
                    } else {
                        this.$('#station-list-area-sort-descending-indicator').removeClass('hidden');
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

    return StationListView;
});
