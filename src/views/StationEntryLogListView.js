define(function(require) {
    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            StationEntryLogListItemView = require('views/StationEntryLogListItemView'),
            NewStationEntryLogModel = require('models/NewStationEntryLogModel'),
            NewStationEntryLogView = require('views/NewStationEntryLogView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            globals = require('globals'),
            env = require('env'),
            utils = require('utils'),
            appEvents = require('events'),
            template = require('hbs!templates/StationEntryLogList');

    var autoRefreshInterval;

    var StationEntryLogListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('StationEntryLogListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.stationIdentifierCollection = options.stationIdentifierCollection;
            this.regionCollection = options.regionCollection;
            this.areaCollection = options.areaCollection;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;

            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationNameFilter);
            this.listenTo(this.regionCollection, 'reset', this.addRegionNameFilter);
            this.listenTo(this.areaCollection, 'reset', this.addAreaNameFilter);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(appEvents, AppEventNamesEnum.userRoleUpdated, this.userRoleUpdated);
            this.listenTo(appEvents, AppEventNamesEnum.cancelCheckIn, this.checkUserRole);
            this.listenTo(appEvents, AppEventNamesEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutSuccess, this.onCheckOutSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutError, this.onCheckOutError);
        },
        render: function() {
            console.trace('StationEntryLogListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.setAutRefreshInterval();

            return this;
        },
        events: {
            'click #refresh-station-entry-log-list-button': 'dispatchRefreshStationEntryLogList',
            'click #reset-station-entry-log-list-button': 'resetStationEntryLogList',
            'click .sort-button': 'sortListView',
            'click #new-station-entry-log-button': 'goToNewStationEntryLog',
            'click .close-alert-box-button': 'closeAlertBox',
            'click #export-station-entry-log-list-button': 'exportStationEntryLogList'
        },
        addAll: function() {
            this._leaveChildren();
            this.clearSortIndicators();
            _.each(this.collection.models, this.addOne, this);
            this.updateViewFromCollection();
            this.addSortIndicators();
            this.hideLoading();
        },
        updateViewFromCollection: function() {
            if (this.collection.overdueCount > 0) {
                this.$('#svg-station-entry-log-overdue-count').removeClass('invisible');
                this.$('#overdue-count').text(this.collection.overdueCount);
            } else {
                this.$('#svg-station-entry-log-overdue-count').addClass('invisible');
            }
            if (this.collection.expiredCount > 0) {
                this.$('#svg-station-entry-log-expired-count').removeClass('invisible');
                this.$('#station-entry-log-expired-count').text(this.collection.expiredCount);
            } else {
                this.$('#svg-station-entry-log-expired-count').addClass('invisible');
            }
            if (this.collection.openCount > 0) {
                this.$('#svg-station-entry-log-open-count').removeClass('invisible');
                this.$('#station-entry-log-open-count').text(this.collection.openCount);
            } else {
                this.$('#svg-station-entry-log-open-count').addClass('invisible');
            }
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new StationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher,
                userRole: currentContext.userRole
            });
            this.appendChildTo(stationEntryLogListItemView, '#station-entry-log-list-item-container');
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
        setAutRefreshInterval: function() {
            var currentContext = this;
            autoRefreshInterval = globals.window.setInterval(function() {
                currentContext.refreshStationEntryLogList();
            }, env.getAutoRefreshInterval());
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

            this.$('#status-filter').val('open');
            this.$('#station-name-filter').val('');
            this.$('#region-name-filter').val('');
            this.$('#area-name-filter').val('');
            this.collection.setSortAttribute('expectedOutTime');

            this.refreshStationEntryLogList();
        },
        refreshStationEntryLogList: function() {
            this.showLoading();
            var status = this.$('#status-filter').val();
            var stationId = this.$('#station-name-filter').val();
            var regionName = this.$('#region-name-filter').val();
            var areaName = this.$('#area-name-filter').val();
            var options = {
                stationId: stationId,
                regionName: regionName,
                areaName: areaName
            };
            if (status === 'open') {
                options.onlyOpen = true;
            } else {
                options.onlyExpired = true;
            }
            this.dispatcher.trigger(AppEventNamesEnum.refreshStationEntryLogList, this.collection, options);
        },
        exportStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            var status = this.$('#status-filter').val();
            var stationId = this.$('#station-name-filter').val();
            var regionName = this.$('#region-name-filter').val();
            var areaName = this.$('#area-name-filter').val();
            var onlyCheckedOut = false;
            if (status === 'open') {
                onlyCheckedOut = false;
            } else if (status === 'expired') {
                onlyCheckedOut = true;
            }
            var options = {
                status: status,
                stationId: stationId,
                areaName: areaName,
                regionName: regionName,
                onlyCheckedOut: onlyCheckedOut,
                reportType: 'OpenStationEntryLogs'
            };
            this.dispatcher.trigger(AppEventNamesEnum.goToExportStationEntryLogList, this.collection, options);
        },
        userRoleUpdated: function(userRole) {
            this.userRole = userRole;
            this.checkUserRole();
        },
        checkUserRole: function() {
            var currentContext = this;
            if (currentContext.userRole === UserRolesEnum.NocAdmin || currentContext.userRole === UserRolesEnum.NocUser) {
                currentContext.showNewStationEntryLogButton();
            } else {
                currentContext.hideNewStationEntryLogButton();
            }
        },
        hideNewStationEntryLogButton: function() {
            this.$('#new-station-entry-log-button').addClass('hidden');
        },
        showNewStationEntryLogButton: function() {
            this.$('#new-station-entry-log-button').removeClass('hidden');
        },
        goToNewStationEntryLog: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.hideNewStationEntryLogButton();
            this.dispatcher.trigger(AppEventNamesEnum.goToNewStationEntryLog, this.$('#new-station-entry-log-view-container'));
        },
        onCheckInSuccess: function(stationEntryLog) {
            var checkInSuccessMessage = utils.getResource('checkInSuccessMessage');
            if (stationEntryLog) {
                var userName = stationEntryLog.userName;
                var stationName = stationEntryLog.stationName;
                checkInSuccessMessage = 'Successful check-in for ' + userName + ' at ' + stationName;
                this.collection.add(stationEntryLog);
            }
            this.showSuccess(checkInSuccessMessage);
        },
        onCheckOutSuccess: function(stationEntryLog) {
            var checkOutSuccessMessage = utils.getResource('checkOutSuccessMessage');
            if (stationEntryLog) {
                var userName = stationEntryLog.userName;
                var stationName = stationEntryLog.stationName;
                checkOutSuccessMessage = 'Successful check-out for ' + userName + ' at ' + stationName;
            }
            this.showSuccess(checkOutSuccessMessage);
        },
        onCheckOutError: function(errorMessage, stationEntryLog) {
            this.showError(errorMessage);
        },
        onLeave: function() {
            if (autoRefreshInterval) {
                globals.window.clearInterval(autoRefreshInterval);
            }
        }
    });
    return StationEntryLogListView;
});
