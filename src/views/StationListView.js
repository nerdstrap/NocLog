define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            globals = require('globals'),
            CompositeView = require('views/CompositeView'),
            StationListItemView = require('views/StationListItemView'),
            env = require('env'),
            utils = require('utils'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/StationList'),
            filterTemplate = require('hbs!templates/Filter'),
            alertTemplate = require('hbs!templates/Alert');

    var StationListView = CompositeView.extend({
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

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('StationListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
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
            'click #station-list-area-sort-button': 'updateStationListAreaSort',
            'click .close-alert-box-button': 'closeAlertBox'
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
            var filterRenderModel = {
                defaultOption: utils.getResource('stationNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.stationIdentifierCollection.models, 'stationId', 'stationName')
            };
            this.$('#station-list-station-identifier-select').html(filterTemplate(filterRenderModel));
        },
        addAllRegions: function() {
            var currentContext = this;
            var filterRenderModel = {
                defaultOption: utils.getResource('regionNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.regionCollection.models, 'regionName', 'regionName')
            };
            this.$('#station-list-region-filter').html(filterTemplate(filterRenderModel));
        },
        addAllAreas: function() {
            var currentContext = this;
            var filterRenderModel = {
                defaultOption: utils.getResource('areaNameFilterDefaultOption'),
                options: utils.getFilterOptions(currentContext.areaCollection.models, 'areaName', 'areaName')
            };
            this.$('#station-list-area-filter').html(filterTemplate(filterRenderModel));
        },
        dispatchRefreshStationList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.refreshStationList();
        },
        resetStationListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-list-region-filter').val('');
            this.$('#station-list-area-filter').val('');
            this.collection.setSortAttribute('stationName');
            this.refreshStationList();
        },
        refreshStationList: function() {
            this.showLoading();
            var status = 'all';
            var regionName = this.$('#station-list-region-filter').val();
            var areaName = this.$('#station-list-area-filter').val();

            var options = {
                regionName: regionName,
                areaName: areaName
            };

            if (status === 'all') {
                this.dispatcher.trigger(AppEventNamesEnum.showStations, options);
            }
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        },
        showInfo: function(message) {
            var level;
            this.addAutoCloseAlert(level, message);
        },
        showSuccess: function(message) {
            this.addAutoCloseAlert('success', message);
        },
        showError: function(message) {
            this.addAutoCloseAlert('alert', message);
        },
        addAlertBox: function(guid, level, message) {
            var renderModel = {
                guid: guid,
                level: level,
                message: message
            };
            this.$('.view-alerts .columns').prepend(alertTemplate(renderModel));
        },
        addAutoCloseAlertBox: function(level, message) {
            var currentContext = this;
            var guid = env.getNewGuid();
            this.addAlert(guid, level, message);
            globals.window.setTimeout(function() {
                currentContext.autoCloseAlertBox(guid);
            }, env.getNotificationTimeout());
        },
        closeAlertBox: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var closeAlertButton = $(event.target);
                if (closeAlertButton) {
                    var alert = closeAlertButton.closest('[data-alert]');
                    if (alert) {
                        alert.trigger('close').trigger('close.fndtn.alert').remove();
                    }
                }
            }
        },
        autoCloseAlertBox: function(guid) {
            if (guid) {
                var closeAlertButton = $('#' + guid);
                if (closeAlertButton) {
                    var alert = closeAlertButton.closest('[data-alert]');
                    if (alert) {
                        alert.trigger('close').trigger('close.fndtn.alert').remove();
                    }
                }
            }
        },
        onLeave: function() {
        }
    });

    return StationListView;
});
