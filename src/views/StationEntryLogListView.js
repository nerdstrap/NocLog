define(function(require) {
    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            StationEntryLogListItemView = require('views/StationEntryLogListItemView'),
            NewStationEntryLogModel = require('models/NewStationEntryLogModel'),
            LookupDataItemCollection = require('collections/LookupDataItemCollection'),
            ListItemCollection = require('collections/ListItemCollection'),
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

            this.stationIdentifierCompleteCollection = options.stationIdentifierCompleteCollection;
            this.regionCompleteCollection = options.regionCompleteCollection;
            this.areaCompleteCollection = options.areaCompleteCollection;
			
            this.stationIdentifierCollection = options.stationIdentifierCollection;
            this.regionCollection = options.regionCollection;
            this.areaCollection = options.areaCollection;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;

            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationNameFilter);
            this.listenTo(this.regionCollection, 'reset', this.addRegionNameFilter);
            this.listenTo(this.areaCollection, 'reset', this.addAreaNameFilter);
            this.listenTo(this.collection, 'add', this.updateViewFromCollection);
            this.listenTo(this.collection, 'remove', this.updateViewFromCollection);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);

            this.listenTo(this, 'leave', this.onLeave);

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
        setUserRole: function(userRole) {
            this.userRole = userRole;
            this.checkUserRole();
        },
        events: {
            'click #refresh-station-entry-log-list-button': 'dispatchRefreshStationEntryLogList',
            'click #reset-station-entry-log-list-button': 'resetStationEntryLogList',
            'click .sort-button': 'sortListView',
            'click #new-station-entry-log-button': 'goToNewStationEntryLog',
            'click .close-alert-box-button': 'closeAlertBox',
            'click #export-station-entry-log-list-button': 'exportStationEntryLogList',
			'change #station-filter': 'onChangeStationFilter',
			'change #area-filter': 'onChangeAreaFilter',
			'change #region-filter': 'onChangeRegionFilter'
        },
        addAll: function() {
            this.removeAll();
            this.clearSortIndicators();
            _.each(this.collection.models, this.addOne, this);
            this.updateViewFromCollection();
            this.addSortIndicators();
            this.hideLoading();
        },
        removeAll: function() {
            this.children.chain().clone().each(function(view) {
                if (view.$('.new-station-entry-log-view').length === 0) {
                    if (view.leave) {
                        view.leave();
                    }
                }
            });
        },
        updateViewFromCollection: function() {
            if (this.collection.overdueCount > 0) {
                this.$('#svg-station-entry-log-overdue-count').removeClass('invisible');
                this.$('#overdue-count').html(this.collection.overdueCount);
            } else {
                this.$('#svg-station-entry-log-overdue-count').addClass('invisible');
            }
            if (this.collection.expiredCount > 0) {
                this.$('#svg-station-entry-log-expired-count').removeClass('invisible');
                this.$('#expired-count').html(this.collection.expiredCount);
            } else {
                this.$('#svg-station-entry-log-expired-count').addClass('invisible');
            }
            if (this.collection.openCount > 0) {
                this.$('#svg-station-entry-log-open-count').removeClass('invisible');
                this.$('#open-count').html(this.collection.openCount);
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
            this.stationIdentifierCollection.reset(this.stationIdentifierCompleteCollection.models);
            this.$('#station-filter').val('');
			this.$('#region-filter').val('');
			this.areaCollection.reset(this.areaCompleteCollection.models);
            this.$('#area-filter').val('');
            this.collection.setSortAttribute('expectedOutTime');

            this.refreshStationEntryLogList();
        },
        refreshStationEntryLogList: function() {
            this.showLoading();
            var status = this.$('#status-filter').val();
            var stationId = this.$('#station-filter').val();
            var regionName = this.$('#region-filter').val();
            var areaName = this.$('#area-filter').val();
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
            var currentContext = this;
            var status = this.$('#status-filter').val();
            var stationId = this.$('#station-filter').val();
            var regionName = this.$('#region-filter').val();
            var areaName = this.$('#area-filter').val();
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
            var triggerExport = function() {
                this.dispatcher.trigger(AppEventNamesEnum.goToExportStationEntryLogList, currentContext.collection, options);
            };
            this.listenToOnce(this.collection, 'reset', triggerExport);
            this.refreshStationEntryLogList();
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
            var currentContext = this;
            this.hideNewStationEntryLogButton();

            var newStationEntryLogModelInstance = new NewStationEntryLogModel();
            var stationIdentifierCollection = new Backbone.Collection();
            var purposeCollection = new LookupDataItemCollection();
            var durationCollection = new LookupDataItemCollection();
            currentContext.newStationEntryLogViewInstance = new NewStationEntryLogView({
                model: newStationEntryLogModelInstance,
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                stationIdentifierCollection: stationIdentifierCollection,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection
            });
            currentContext.renderChildInto(currentContext.newStationEntryLogViewInstance, currentContext.$('#new-station-entry-log-view'));

            currentContext.newStationEntryLogViewInstance.showLoading();
            var options = {
                stationIdentifierCollection: stationIdentifierCollection,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection
            };
            this.dispatcher.trigger(AppEventNamesEnum.refreshOptions, options);
        },
        onCheckInSuccess: function(stationEntryLog) {
            if (this.newStationEntryLogViewInstance) {
                this.newStationEntryLogViewInstance.hideLoading();
                this.newStationEntryLogViewInstance.leave();
            }
            var checkInSuccessMessage = utils.getResource('checkInSuccessMessage');
            if (stationEntryLog) {
                var userName = stationEntryLog.userName;
                var stationName = stationEntryLog.stationName;
                checkInSuccessMessage = 'Successful check-in for ' + userName + ' at ' + stationName;
                this.collection.add(stationEntryLog);
            }
            this.showSuccess(checkInSuccessMessage);
            this.checkUserRole();
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
