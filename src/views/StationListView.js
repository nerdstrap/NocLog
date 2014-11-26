define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            StationListItemView = require('views/StationListItemView'),
            globals = require('globals'),
            env = require('env'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            template = require('hbs!templates/StationList');

    var StationListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('StationListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.stationIdentifierCollection = options.stationIdentifierCollection || new Backbone.Collection();
            this.regionCollection = options.regionCollection || new Backbone.Collection();
            this.areaCollection = options.areaCollection || new Backbone.Collection();

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationNameFilter);
            this.listenTo(this.regionCollection, 'reset', this.addRegionNameFilter);
            this.listenTo(this.areaCollection, 'reset', this.addAreaNameFilter);

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('StationListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click #refresh-station-list-button': 'dispatchRefreshStationList',
            'click #reset-station-list-button': 'resetStationList',
            'click .sort-button': 'sortListView',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        addAll: function() {
            this._leaveChildren();
            this.clearSortIndicators();
            _.each(this.collection.models, this.addOne, this);
            this.addSortIndicators();
            this.hideLoading();
        },
        addOne: function(station) {
            var currentContext = this;
            var stationListItemView = new StationListItemView({
                model: station,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationListItemView, '#station-list-item-container');
        },
        addStationNameFilter: function() {
            this.addFilter(this.$('#station-name-filter'), this.stationIdentifierCollection.models, 'stationId', 'stationName');
        },
        addRegionNameFilter: function() {
            this.addFilter(this.$('#region-name-filter'), this.regionCollection.models, 'regionName', 'regionName');
        },
        addAreaNameFilter: function() {
            this.addFilter(this.$('#area-name-filter'), this.areaCollection.models, 'areaName', 'areaName');
        },
        dispatchRefreshStationList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.refreshStationList();
        },
        resetStationList: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.$('#station-name-filter').val('');
            this.$('#region-name-filter').val('');
            this.$('#area-name-filter').val('');
            this.collection.setSortAttribute('stationName');

            this.refreshStationList();
        },
        refreshStationList: function() {
            this.showLoading();
            var stationId = this.$('#station-name-filter').val();
            var regionName = this.$('#region-name-filter').val();
            var areaName = this.$('#area-name-filter').val();

            var options = {
                stationId: stationId,
                regionName: regionName,
                areaName: areaName
            };

            this.dispatcher.trigger(AppEventNamesEnum.refreshStationList, this.collection, options);
        },
        onLeave: function() {
        }
    });

    return StationListView;
});
