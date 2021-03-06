define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            StationEntryLogHistoryListItemView = require('views/StationEntryLogHistoryListItemView'),
            ListItemCollection = require('collections/ListItemCollection'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/StationEntryLogHistoryList');

    var StationEntryLogHistoryListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('StationEntryLogHistoryListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.stationIdentifierCompleteCollection = options.stationIdentifierCompleteCollection;
            this.regionCompleteCollection = options.regionCompleteCollection;
            this.areaCompleteCollection = options.areaCompleteCollection;

            this.dolRegionCompleteCollection = options.dolRegionCompleteCollection;
            this.dolAreaCompleteCollection = options.dolAreaCompleteCollection;

            this.stationIdentifierCollection = options.stationIdentifierCollection || new ListItemCollection();
            this.regionCollection = options.regionCollection || new ListItemCollection();
            this.areaCollection = options.areaCollection || new ListItemCollection();

            this.dolRegionCollection = options.dolRegionCollection;
            this.dolAreaCollection = options.dolAreaCollection;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationNameFilter);
            this.listenTo(this.regionCollection, 'reset', this.addRegionNameFilter);
            this.listenTo(this.areaCollection, 'reset', this.addAreaNameFilter);
            this.listenTo(this.dolRegionCollection, 'reset', this.addDolRegionNameFilter);
            this.listenTo(this.dolAreaCollection, 'reset', this.addDolAreaNameFilter);

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('StationEntryLogHistoryListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.setDefaultDateFilters(0);
            currentContext.onChangeIncludeTD();

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
            'click .refresh-button': 'setDateFilter',
            'change #station-filter': 'onChangeStationFilter',
            'change #area-filter': 'onChangeAreaFilter',
            'change #region-filter': 'onChangeRegionFilter',
            'click #filter-station-entry-td': 'onChangeIncludeTD',
            'click #filter-station-entry-tc': 'onChangeIncludeTC',
            'change #dol-area-filter': 'onChangeDolAreaFilter',
            'change #dol-region-filter': 'onChangeDolRegionFilter'
        },
        addAll: function() {
            this._leaveChildren();
            this.clearSortIndicators();
            _.each(this.collection.models, this.addOne, this);
            this.addSortIndicators();
            this.listenToWindowResize();
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
            this.$('#filter-station-entry-tc').prop('checked', true);
            this.$('#filter-station-entry-td').prop('checked', true);

            this.stationIdentifierCollection.reset(this.stationIdentifierCompleteCollection.models);
            this.$('#station-filter').val('');
            this.$('#region-filter').val('');
            this.areaCollection.reset(this.areaCompleteCollection.models);
            this.$('#area-filter').val('');
            this.$('#dol-region-filter').val('');
            this.dolAreaCollection.reset(this.dolAreaCompleteCollection.models);
            this.$('#dol-area-filter').val('');
            this.setDefaultDateFilters(0);
            this.collection.setSortAttribute('outTime');

            this.refreshStationEntryLogList();
        },
        refreshStationEntryLogList: function() {
            this.showLoading();

            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            if (showNoc === false & showDol === false) {
                this.$('#filter-station-entry-tc').prop('checked', true);
                this.$('#filter-station-entry-td').prop('checked', true);
                showDol = true;
                showNoc = true;
                this.onChangeIncludeTD();
            }
            var stationId = this.$('#station-filter').val();
            var regionName = this.$('#region-filter').val();
            var areaName = this.$('#area-filter').val();
            var dolRegionName = this.$('#dol-region-filter').val();
            var dolAreaName = this.$('#dol-area-filter').val();
            var startDate = this.$('#start-date-filter').val();
            //var startTime = this.$('#start-time-filter').val();
            var endDate = this.$('#end-date-filter').val();
            //var endTime = this.$('#end-time-filter').val();

            var options = {
                showNoc: showNoc,
                showDol: showDol,
                stationId: stationId,
                regionName: regionName,
                areaName: areaName,
                dolRegionName: dolRegionName,
                dolAreaName: dolAreaName,
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
            var currentContext = this;
            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            if (showNoc === false & showDol === false) {
                this.$('#filter-station-entry-tc').prop('checked', true);
                this.$('#filter-station-entry-td').prop('checked', true);
                showDol = true;
                showNoc = true;
                this.onChangeIncludeTD();
            }
            var stationId = this.$('#station-filter').val();
            var regionName = this.$('#region-filter').val();
            var areaName = this.$('#area-filter').val();
            var dolRegionName = this.$('#dol-region-filter').val();
            var dolAreaName = this.$('#dol-area-filter').val();
            var startDate = this.$('#start-date-filter').val();
            //var startTime = this.$('#start-time-filter').val();
            var endDate = this.$('#end-date-filter').val();
            //var endTime = this.$('#end-time-filter').val();
            var options = {
                showNoc: showNoc,
                showDol: showDol,
                stationId: stationId,
                areaName: areaName,
                regionName: regionName,
                dolRegionName: dolRegionName,
                dolAreaName: dolAreaName,
                startDate: startDate,
                //startTime: startTime,
                endDate: endDate,
                //endTime: endTime,
                reportType: 'HistoryStationEntryLogs'
            };

            var triggerExport = function() {
                this.dispatcher.trigger(AppEventNamesEnum.goToExportStationEntryLogList, currentContext.collection, options);

            };
            this.listenToOnce(this.collection, 'reset', triggerExport);
            this.dispatchRefreshStationEntryLogList();
        }
    });

    return StationEntryLogHistoryListView;
});
