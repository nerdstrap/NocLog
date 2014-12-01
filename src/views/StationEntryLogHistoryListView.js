define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            StationEntryLogHistoryListItemView = require('views/StationEntryLogHistoryListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/StationEntryLogHistoryList');

    var StationEntryLogHistoryListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('StationEntryLogHistoryListView.initialize');
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
            console.trace('StationEntryLogHistoryListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.setDefaultDateFilters(-1);

            return this;
        },
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        events: {
            'click #refresh-station-entry-log-list-button': 'dispatchRefreshStationEntryLogList',
            'click #reset-station-entry-log-list-button': 'resetStationEntryLogList',
            'click .sort-button': 'sortListView',
            'click .close-alert-box-button': 'closeAlertBox',
            'click #export-station-entry-log-list-button': 'exportStationEntryLogList',
            'click .refresh-button': 'setDateFilter'
        },
        addAll: function() {
            this._leaveChildren();
            this.clearSortIndicators();
            _.each(this.collection.models, this.addOne, this);
            this.addSortIndicators();
            this.hideLoading();
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new StationEntryLogHistoryListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher,
                userRole: currentContext.userRole
            });
            this.appendChildTo(stationEntryLogListItemView, '#station-entry-log-list-item-container');
        },
        addStationNameFilter: function() {
            this.addFilter(this.$('#station-filter'), this.stationIdentifierCollection.models, 'stationId', 'stationName');
        },
        addRegionNameFilter: function() {
            this.addFilter(this.$('#region-filter'), this.regionCollection.models, 'regionName', 'regionName');
        },
        addAreaNameFilter: function() {
            this.addFilter(this.$('#area-filter'), this.areaCollection.models, 'areaName', 'areaName');
        },
        dispatchRefreshStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.refreshStationEntryLogList();
        },
        resetStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.$('#station-filter').val('');
            this.$('#region-filter').val('');
            this.$('#area-filter').val('');
            this.setDefaultDateFilters(-1);
            this.collection.setSortAttribute('outTime');

            this.refreshStationEntryLogList();
        },
        refreshStationEntryLogList: function() {
            this.showLoading();

            var stationId = this.$('#station-filter').val();
            var regionName = this.$('#region-filter').val();
            var areaName = this.$('#area-filter').val();
            var startDate = this.$('#start-date-filter').val();
            //var startTime = this.$('#start-time-filter').val();
            var endDate = this.$('#end-date-filter').val();
            //var endTime = this.$('#end-time-filter').val();

            var options = {
                stationId: stationId,
                regionName: regionName,
                areaName: areaName,
                startDate: startDate,
                //startTime: startTime,
                endDate: endDate,
                //endTime: endTime,
                onlyCheckedOut: true
            };

            this.dispatcher.trigger(AppEventNamesEnum.refreshStationEntryLogList, this.collection, options);
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
                this.setDefaultDateFilters(daysToAdd);
                this.refreshStationEntryLogList();
            }
        },
        setDefaultDateFilters: function(daysToAdd) {
            var today = new Date();
            var yesterday = utils.addDays(Date.now(), daysToAdd);

            this.$('#start-date-filter').val(utils.getFormattedDate(yesterday));
            //this.$('#start-time-filter').val('00:00');
            this.$('#end-date-filter').val(utils.getFormattedDate(today));
            //this.$('#end-time-filter').val('23:59');
        },
        exportStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }

            var stationId = this.$('#station-filter').val();
            var regionName = this.$('#region-filter').val();
            var areaName = this.$('#area-filter').val();
            var startDate = this.$('#start-date-filter').val();
            //var startTime = this.$('#start-time-filter').val();
            var endDate = this.$('#end-date-filter').val();
            //var endTime = this.$('#end-time-filter').val();
            var options = {
                stationId: stationId,
                areaName: areaName,
                regionName: regionName,
                startDate: startDate,
                //startTime: startTime,
                endDate: endDate,
                //endTime: endTime,
                reportType: 'HistoryStationEntryLogs'
            };
            this.dispatcher.trigger(AppEventNamesEnum.goToExportStationEntryLogList, this.collection, options);
        }
    });

    return StationEntryLogHistoryListView;
});
