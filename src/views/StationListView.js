define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            globals = require('globals'),
            CompositeView = require('views/CompositeView'),
            StationListItemView = require('views/StationListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationList'),
            stationIdentifierListTemplate = require('hbs!templates/StationIdentifierList'),
            regionListTemplate = require('hbs!templates/RegionList'),
            areaListTemplate = require('hbs!templates/AreaList');

    var StationListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc'),
                loadingMessage: appResources.getResource('StationListView.loadingMessage'),
                errorMessage: appResources.getResource('StationListView.errorMessage'),
                infoMessage: appResources.getResource('StationListView.infoMessage'),
                listViewTitleText: appResources.getResource('StationListView.listViewTitleText'),
                refreshListButtonText: appResources.getResource('StationListView.refreshListButtonText'),
                resetListOptionsButtonText: appResources.getResource('StationListView.resetListOptionsButtonText'),
                regionFilterDefaultOption: appResources.getResource('StationListView.regionFilterDefaultOption'),
                areaFilterDefaultOption: appResources.getResource('StationListView.areaFilterDefaultOption'),
                stationIdentifierSelectDefaultOption: appResources.getResource('StationListView.stationIdentifierSelectDefaultOption'),
                stationNameHeaderText: appResources.getResource('StationListView.stationNameHeaderText'),
                regionHeaderText: appResources.getResource('StationListView.regionHeaderText'),
                areaHeaderText: appResources.getResource('StationListView.areaHeaderText')
            };
        },
        initialize: function(options) {
            console.trace('StationListView.initialize');
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
            console.trace('StationListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            _.each(this.collection.models, this.addOne, this);

            return this;
        },
        events: {
            'click #station-list-refresh-list-button': 'refreshStationList',
            'click #station-list-reset-list-options-button': 'resetStationListFilter',
            'click #station-list-station-name-sort-button': 'updateStationListStationNameSort',
            'change #station-list-station-identifier-select': 'selectStation',
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
        addAllStationIdentifiers: function() {
            var currentContext = this;
            var stationIdentifierListRenderModel = {
                defaultOption: currentContext.resources().stationIdentifierSelectDefaultOption,
                stationIdentifiers: currentContext.stationIdentifierCollection.models
            };
            this.$('#station-list-station-identifier-select').html(stationIdentifierListTemplate(stationIdentifierListRenderModel));
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
        resetStationListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.showLoading();
            
            this.$('#station-list-region-filter').val('');
            this.$('#station-list-area-filter').val('');
            
            this.$('#station-list-station-name-sort-button').data('sort-direction', '1');
            this.$('#station-list-region-sort-button').removeData('sort-direction');
            this.$('#station-list-area-sort-button').removeData('sort-direction');
            
            var sortAttributes = [{
                    sortAttribute: 'stationName',
                    sortDirection: 1
                }];
            
            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;

            this.dispatcher.trigger(AppEventNamesEnum.showStations);
        },
        updateStationListStationNameSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            var stationNameSortDirection = this.getDataSortDirection(this.$('#station-list-station-name-sort-button'));

            var sortAttributes = [{
                    sortAttribute: 'stationName',
                    sortDirection: stationNameSortDirection
                }];

            this.$('#station-list-station-name-sort-button').data('sort-direction', stationNameSortDirection.toString());
            this.$('#station-list-region-sort-button').removeData('sort-direction');
            this.$('#station-list-area-sort-button').removeData('sort-direction');

            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            
            this.collection.sort();
        },
        selectStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = this.$('#station-list-station-identifier-select').val();
            var list = this.$('#station-list').parent();
            var row = list.find('.station-name-link[data-stationid=' + stationId + ']').parent().parent();
            row.addClass('highlighted');
            setTimeout(function(){
                row.removeClass('highlighted');
            }, 2000);
            
            var topPosition = row.position().top;
            list.scrollTop(topPosition);
        },
        updateStationListRegionSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            var regionSortDirection = this.getDataSortDirection(this.$('#station-list-region-sort-button'));

            var stationNameSortDirection = this.getDataSortDirection(this.$('#station-list-station-name-sort-button'));

            var sortAttributes = [
                {
                    sortAttribute: 'region',
                    sortDirection: regionSortDirection
                },
                {
                    sortAttribute: 'stationName',
                    sortDirection: stationNameSortDirection
                }
            ];

            this.$('#station-list-region-sort-button').data('sort-direction', regionSortDirection.toString());
            this.$('#station-list-area-sort-button').removeData('sort-direction');

            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        updateStationListAreaSort: function(event) {
            if (event) {
                event.preventDefault();
            }

            var areaSortDirection = this.getDataSortDirection(this.$('#station-list-area-sort-button'));

            var stationNameSortDirection = this.getDataSortDirection(this.$('#station-list-station-name-sort-button'));

            var sortAttributes = [
                {
                    sortAttribute: 'area',
                    sortDirection: areaSortDirection
                },
                {
                    sortAttribute: 'stationName',
                    sortDirection: stationNameSortDirection
                }
            ];

            this.$('#station-list-region-sort-button').removeData('sort-direction');
            this.$('#station-list-area-sort-button').data('sort-direction', areaSortDirection.toString());

            this.showSortIndicators(sortAttributes);
            this.collection.sortAttributes = sortAttributes;
            this.collection.sort();
        },
        showSortIndicators: function(sortAttributes) {
            this.$('#station-list-station-name-sort-ascending-indicator').addClass('hidden');
            this.$('#station-list-station-name-sort-descending-indicator').addClass('hidden');
            this.$('#station-list-region-sort-ascending-indicator').addClass('hidden');
            this.$('#station-list-region-sort-descending-indicator').addClass('hidden');
            this.$('#station-list-area-sort-ascending-indicator').addClass('hidden');
            this.$('#station-list-area-sort-descending-indicator').addClass('hidden');

            if (sortAttributes && sortAttributes.length > 0) {
                for (var i in sortAttributes) {
                    var sortAttribute = sortAttributes[i].sortAttribute;
                    var sortDirection = sortAttributes[i].sortDirection;
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

    return StationListView;
});
