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

            this.stationIdentifierCompleteCollection = options.stationIdentifierCompleteCollection;
            this.regionCompleteCollection = options.regionCompleteCollection;
            this.areaCompleteCollection = options.areaCompleteCollection;

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
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        events: {
            'click #refresh-station-list-button': 'dispatchRefreshStationList',
            'click #reset-station-list-button': 'resetStationList',
            'click .sort-button': 'sortListView',
            'click .close-alert-box-button': 'closeAlertBox',
			'change #station-filter': 'onChangeStationFilter',
			'change #area-filter': 'onChangeAreaFilter',
			'change #region-filter': 'onChangeRegionFilter'
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
                dispatcher: currentContext.dispatcher,
                userRole: currentContext.userRole
            });
            this.appendChildTo(stationListItemView, '#station-list-item-container');
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

            this.stationIdentifierCollection.reset(this.stationIdentifierCompleteCollection.models);
			this.$('#station-filter').val('');
            this.$('#region-filter').val('');
            this.areaCollection.reset(this.areaCompleteCollection.models);
            this.$('#area-filter').val('');
            this.collection.setSortAttribute('stationName');

            this.refreshStationList();
        },
        refreshStationList: function() {
            this.showLoading();
            var stationId = this.$('#station-filter').val();
            var regionName = this.$('#region-filter').val();
            var areaName = this.$('#area-filter').val();

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
