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
                listFilterHeaderText: appResources.getResource('StationListView.listFilterHeaderText').value,
                regionFilterDefaultOption: appResources.getResource('StationListView.regionFilterDefaultOption').value,
                areaFilterDefaultOption: appResources.getResource('StationListView.areaFilterDefaultOption').value,
                updateListFilterButtonText: appResources.getResource('StationListView.updateListFilterButtonText').value,
                stationNameHeaderText: appResources.getResource('StationListView.stationNameHeaderText').value,
                regionHeaderText: appResources.getResource('StationListView.regionHeaderText').value,
                areaHeaderText: appResources.getResource('StationListView.areaHeaderText').value,
                placeholderHeaderText: appResources.getResource('StationListView.placeholderHeaderText').value
            };
        },
        initialize: function(options) {
            console.trace('StationListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.regionCollection = options.regionCollection || new Backbone.Collection();
            this.areaCollection = options.areaCollection || new Backbone.Collection();

            this.listenTo(this.collection, 'reset', this.addAll);
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
            /*
             'change #station-list-filter': 'changeStationListFilter'
             */
            'click #station-list-update-filter-button': 'updateStationList'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
        },
        addOne: function(station) {
            var currentContext = this;
            var stationListItemView = new StationListItemView({
                model: station,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationListItemView, '.view-list');
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
        updateStationList: function(event) {
            if (event) {
                event.preventDefault();
            }

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
        }
    });

    return StationListView;
});
