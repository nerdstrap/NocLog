define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            DashboardService = require('services/DashboardService'),
            StationEntryLogListView = require('views/StationEntryLogListView'),
            StationEntryLogHistoryListView = require('views/StationEntryLogHistoryListView'),
            StationListView = require('views/StationListView'),
            PersonnelListView = require('views/PersonnelListView'),
            StationEntryLogView = require('views/StationEntryLogView'),
            StationView = require('views/StationView'),
            PersonnelView = require('views/PersonnelView'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            StationModel = require('models/StationModel'),
            PersonnelModel = require('models/PersonnelModel'),
            StationEntryLogCollection = require('collections/StationEntryLogCollection'),
            StationCollection = require('collections/StationCollection'),
            PersonnelCollection = require('collections/PersonnelCollection'),
            LookupDataItemCollection = require('collections/LookupDataItemCollection'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            globals = require('globals'),
            env = require('env');

    /**
     * Creates a new DashboardController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var DashboardController = function(options) {
        console.trace('new DashboardController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(DashboardController.prototype, Backbone.Events, {
        /** @class DashboardController
         * @contructs DashboardController object
         * @param {object} options
         */
        initialize: function(options) {
            console.trace('DashboardController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher || appEvents;

            this.dashboardService = options.dashboardService || new DashboardService();
            this.stationEntryLogSearchResults = options.stationEntryLogSearchResults || new StationEntryLogCollection();
            this.stationSearchResults = options.stationSearchResults || new StationCollection();
            this.personnelSearchResults = options.personnelSearchResults || new PersonnelCollection();
            this.stationIdentifierResults = options.stationIdentifierCollection || new Backbone.Collection();
            this.regionResults = options.regionCollection || new Backbone.Collection();
            this.areaResults = options.areaCollection || new Backbone.Collection();
            this.purposeResults = options.purposeCollection || new LookupDataItemCollection();
            this.durationResults = options.durationCollection || new LookupDataItemCollection();

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogList, this.goToStationEntryLogList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogHistoryList, this.goToStationEntryLogHistoryList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationList, this.goToStationList);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnelList, this.goToPersonnelList);

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogWithId, this.goToStationEntryLogWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnelWithId, this.goToPersonnelWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToMaintainPurposes, this.goToMaintainPurposes);

            this.listenTo(appEvents, AppEventNamesEnum.showOpenStationEntryLogs, this.showOpenStationEntryLogs);
            this.listenTo(appEvents, AppEventNamesEnum.showExpiredStationEntryLogs, this.showExpiredStationEntryLogs);
            this.listenTo(appEvents, AppEventNamesEnum.showStationEntryLogs, this.showStationEntryLogs);

            this.listenTo(appEvents, AppEventNamesEnum.showStations, this.showStations);

            this.listenTo(appEvents, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);

            this.listenTo(appEvents, AppEventNamesEnum.goToNewStationEntryLog, this.goToNewStationEntryLog);
            this.listenTo(appEvents, AppEventNamesEnum.goToCheckIn, this.goToCheckIn);
            this.listenTo(appEvents, AppEventNamesEnum.goToCheckOut, this.goToCheckOut);
            this.listenTo(appEvents, AppEventNamesEnum.goToUpdateCheckIn, this.goToUpdateCheckIn);

            this.listenTo(appEvents, AppEventNamesEnum.goToLookupUserId, this.goToLookupUserId);
        },
        goToStationEntryLogList: function(options) {
            console.trace('DashboardController.goToStationEntryLogList');
            var currentContext = this,
                    deferred = $.Deferred();

            currentContext.stationEntryLogSearchResults.reset();
            currentContext.stationEntryLogSearchResults.sortAttributes = [{
                    sortAttribute: 'expectedOutTime',
                    sortDirection: 1
                }];

            var stationEntryLogListViewInstance = new StationEntryLogListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                stationIdentifierCollection: currentContext.stationIdentifierResults,
                collection: currentContext.stationEntryLogSearchResults,
                regionCollection: currentContext.regionResults,
                areaCollection: currentContext.areaResults,
                purposeCollection: currentContext.purposeResults,
                durationCollection: currentContext.durationResults
            });

            currentContext.router.swapContent(stationEntryLogListViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'stationEntryLog' || Backbone.history.fragment === '');
            currentContext.router.navigate('stationEntryLog', {replace: fragmentAlreadyMatches});

            stationEntryLogListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs({onlyOpen: true})).done(function(getStationEntryLogsResponse) {
                stationEntryLogListViewInstance.setUserRole(getStationEntryLogsResponse.userRole);
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogsResponse.stationEntryLogs);
                currentContext.countExpiredStationEntryLogs(currentContext.stationEntryLogSearchResults);
                currentContext.stationIdentifierResults.reset(getStationEntryLogsResponse.stationIdentifiers);
                currentContext.regionResults.reset(getStationEntryLogsResponse.regions);
                currentContext.areaResults.reset(getStationEntryLogsResponse.areas);
                stationEntryLogListViewInstance.hideLoading();
                if (options && options.stationEntryLog) {
                    var userName = options.stationEntryLog.userName;
                    var stationName = options.stationEntryLog.stationName;
                    var updateCheckInSucessMessage = 'Successful update of check-in for ' + userName + ' at ' + stationName;
                    stationEntryLogListViewInstance.showSuccess(updateCheckInSucessMessage);
                }
                deferred.resolve(stationEntryLogListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.stationEntryLogSearchResults.reset();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToStationEntryLogHistoryList: function() {
            console.trace('DashboardController.goToStationEntryLogHistoryList');
            var currentContext = this,
                    deferred = $.Deferred();

            currentContext.stationEntryLogSearchResults.reset();
            currentContext.stationEntryLogSearchResults.sortAttributes = [{
                    sortAttribute: 'outTime',
                    sortDirection: 1
                }];

            var stationEntryLogHistoryListViewInstance = new StationEntryLogHistoryListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationEntryLogSearchResults,
                stationIdentifierCollection: currentContext.stationIdentifierResults,
                regionCollection: currentContext.regionResults,
                areaCollection: currentContext.areaResults
            });

            currentContext.router.swapContent(stationEntryLogHistoryListViewInstance);
            currentContext.router.navigate('stationEntryLogHistory');

            stationEntryLogHistoryListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs({onlyCheckedOut: true})).done(function(getStationEntryLogsResponse) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogsResponse.stationEntryLogs);
                currentContext.stationIdentifierResults.reset(getStationEntryLogsResponse.stationIdentifiers);
                currentContext.regionResults.reset(getStationEntryLogsResponse.regions);
                currentContext.areaResults.reset(getStationEntryLogsResponse.areas);
                deferred.resolve(stationEntryLogHistoryListViewInstance);
                stationEntryLogHistoryListViewInstance.hideLoading();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.stationEntryLogSearchResults.reset();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToStationList: function() {
            console.trace('DashboardController.goToStationList');
            var currentContext = this,
                    deferred = $.Deferred();

            currentContext.stationSearchResults.reset();
            currentContext.stationSearchResults.sortAttributes = [{
                    sortAttribute: 'stationName',
                    sortDirection: 1
                }];

            var stationListViewInstance = new StationListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationSearchResults,
                stationIdentifierCollection: currentContext.stationIdentifierResults,
                regionCollection: currentContext.regionResults,
                areaCollection: currentContext.areaResults
            });

            currentContext.router.swapContent(stationListViewInstance);
            currentContext.router.navigate('station');

            stationListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStations()).done(function(getStationsResponse) {
                currentContext.stationSearchResults.reset(getStationsResponse.stations);
                if (getStationsResponse.stations.length === 0) {
                    stationListViewInstance.showInfo('No results.');
                }
                currentContext.stationIdentifierResults.reset(getStationsResponse.stationIdentifiers);
                currentContext.regionResults.reset(getStationsResponse.regions);
                currentContext.areaResults.reset(getStationsResponse.areas);
                deferred.resolve(stationListViewInstance);
                stationListViewInstance.hideLoading();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.stationSearchResults.reset();
                stationListViewInstance.showError(textStatus);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToPersonnelList: function() {
            console.trace('DashboardController.goToPersonnelList');
            var currentContext = this,
                    deferred = $.Deferred();

            var personnelListViewInstance = new PersonnelListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.personnelSearchResults
            });

            currentContext.router.swapContent(personnelListViewInstance);
            currentContext.router.navigate('personnel');

            $.when(currentContext.dashboardService.getPersonnel()).done(function(getPersonnelResponse) {
                currentContext.personnelSearchResults.reset(getPersonnelResponse.personnel);
                deferred.resolve(personnelListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.personnelSearchResults.reset();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToStationEntryLogWithId: function(stationEntryLogId) {
            console.trace('DashboardController.goToStationEntryLogWithId');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationEntryLogModelInstance = new StationEntryLogModel({stationEntryLogId: stationEntryLogId});

            var stationEntryLogViewInstance = new StationEntryLogView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: stationEntryLogModelInstance,
                durationCollection: currentContext.durationResults
            });

            currentContext.router.swapContent(stationEntryLogViewInstance);
            currentContext.router.navigate('stationEntryLog/' + stationEntryLogId);

            $.when(currentContext.dashboardService.getStationEntryLogs(stationEntryLogModelInstance.attributes), currentContext.dashboardService.getOptions()).done(function(getStationEntryLogResults, getOptionsResults) {
                stationEntryLogViewInstance.setUserRole(getStationEntryLogResults[0].userRole);
                stationEntryLogModelInstance.set(getStationEntryLogResults[0].stationEntryLogs[0], {silent: true});
                currentContext.durationResults.reset(getOptionsResults[0].durations);
                stationEntryLogModelInstance.trigger('sync', stationEntryLogModelInstance, getStationEntryLogResults[0]);
                deferred.resolve(stationEntryLogViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToStationWithId: function(stationId) {
            console.trace('DashboardController.goToStationWithId');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationModelInstance = new StationModel({stationId: stationId});

            var stationViewInstance = new StationView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: stationModelInstance
            });

            currentContext.router.swapContent(stationViewInstance);
            currentContext.router.navigate('station/' + stationId);

            stationViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStations({stationId: stationId})).done(function(getStationByIdResponse) {
                if (getStationByIdResponse.stations && getStationByIdResponse.stations.length > 0) {
                    stationModelInstance.set(getStationByIdResponse.stations[0]);
                } else {
                }
                stationViewInstance.hideLoading();
                deferred.resolve(stationViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToPersonnelWithId: function(personnelId) {
            console.trace('DashboardController.goToPersonnelWithId');
            var currentContext = this,
                    deferred = $.Deferred();

            var personnelModelInstance = new PersonnelModel({personnelId: personnelId});

            var personnelViewInstance = new PersonnelView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: personnelModelInstance
            });

            currentContext.router.swapContent(personnelViewInstance);
            currentContext.router.navigate('personnel/' + personnelId);

            $.when(currentContext.dashboardService.getPersonnelById(personnelModelInstance.attributes)).done(function(getPersonnelByIdResponse) {
                personnelModelInstance.set(getPersonnelByIdResponse);
                deferred.resolve(personnelViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        showStationEntryLogs: function(options) {
            console.trace('DashboardController.showStationEntryLogs');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getStationEntryLogs(options)).done(function(getStationEntryLogsResponse) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogsResponse.stationEntryLogs);
                currentContext.countExpiredStationEntryLogs(currentContext.stationEntryLogSearchResults);
                deferred.resolve(getStationEntryLogsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        countExpiredStationEntryLogs: function(stationEntryLogSearchResults) {
            console.trace('DashboardController.countExpiredStationEntryLogs');
            var expiredCount, overdueCount, openCount;
            overdueCount = stationEntryLogSearchResults.where({checkOutOverdue: true}).length;
            expiredCount = stationEntryLogSearchResults.where({checkOutExpired: true}).length;
            openCount = stationEntryLogSearchResults.length - expiredCount - overdueCount;
            appEvents.trigger(AppEventNamesEnum.countExpiredEntriesUpdated, {'overdueCount': overdueCount, 'expiredCount': expiredCount, 'openCount': openCount});
        },
        showStations: function(options) {
            console.trace('DashboardController.showStations');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getStations(options)).done(function(getStationsResponse) {
                currentContext.stationSearchResults.reset(getStationsResponse.stations);
                if (getStationsResponse.stations.length === 0) {
                }
                deferred.resolve(getStationsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.stationSearchResults.reset();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToNewStationEntryLog: function() {
            console.trace('DashboardController.goToNewStationEntryLog');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getOptions()).done(function(getOptionsResponse) {
                currentContext.purposeResults.reset(getOptionsResponse.purposes);
                currentContext.durationResults.reset(getOptionsResponse.durations);
                deferred.resolve(getOptionsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToCheckIn: function(stationEntryLogModel) {
            console.trace('DashboardController.goToCheckIn');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postCheckIn(stationEntryLogModel.attributes)).done(function(checkInResponse) {
                currentContext.purposeResults.reset(checkInResponse);
                currentContext.stationEntryLogSearchResults.add(checkInResponse.stationEntryLog);
                appEvents.trigger(AppEventNamesEnum.checkInSuccess, checkInResponse.stationEntryLog);
                currentContext.countExpiredStationEntryLogs(currentContext.stationEntryLogSearchResults);
                deferred.resolve(checkInResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error checking in.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                //currentContext.showErrorView(msg);
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = jqXHR.responseText;
                }

                appEvents.trigger(AppEventNamesEnum.checkInError, msg);
                deferred.reject(msg);
            });

            return deferred.promise();
        },
        goToCheckOut: function(stationEntryLogModel) {
            console.trace('DashboardController.goToCheckOut');
            var currentContext = this,
                    deferred = $.Deferred();

            var options;
            if (stationEntryLogModel) {
                options = {
                    stationEntryLogId: stationEntryLogModel.get('stationEntryLogId')
                };
            }

            $.when(currentContext.dashboardService.postCheckOut(options)).done(function(checkOutResponse) {
                stationEntryLogModel.trigger('destroy', stationEntryLogModel, stationEntryLogModel.collection, options);
                appEvents.trigger(AppEventNamesEnum.checkOutSuccess, checkOutResponse.stationEntryLog);
                currentContext.countExpiredStationEntryLogs(currentContext.stationEntryLogSearchResults);
                deferred.resolve(checkOutResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error checking out. Please call the dispatch center.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = 'You are already checked-out.';
                }
                //currentContext.showErrorView(msg);
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = 'You do not have permission to check-out this user.';
                }

                appEvents.trigger(AppEventNamesEnum.checkOutError, msg);
                deferred.reject(msg);
            });

            return deferred.promise();
        },
        goToUpdateCheckIn: function(stationEntryLogModel) {
            console.trace('DashboardController.goToUpdateCheckIn');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postUpdateCheckIn(stationEntryLogModel.attributes)).done(function(updateCheckInResults) {
                var model = currentContext.stationEntryLogSearchResults.findWhere({stationEntryLogId: updateCheckInResults.stationEntryLogId});
                appEvents.trigger(AppEventNamesEnum.updateCheckInSuccess, updateCheckInResults.stationEntryLog);
                currentContext.countExpiredStationEntryLogs(currentContext.stationEntryLogSearchResults);
                deferred.resolve(updateCheckInResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error updating entry.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                //currentContext.showErrorView(msg);
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = jqXHR.responseText;
                }

                appEvents.trigger(AppEventNamesEnum.updateCheckInError, msg);
                deferred.reject(msg);
            });

            return deferred.promise();
        },
        goToLookupUserId: function(personnelModel) {
            console.trace('DashboardController.goToLookupUserId');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getPersonnels(personnelModel.attributes)).done(function(getPersonnelByUserIdResponse) {
                if (getPersonnelByUserIdResponse && getPersonnelByUserIdResponse.personnels && getPersonnelByUserIdResponse.personnels.length > 0) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.userIdFound, getPersonnelByUserIdResponse.personnels[0]);
                    deferred.resolve(getPersonnelByUserIdResponse);
                } else {
                    appEvents.trigger(AppEventNamesEnum.userIdLookupError, msg);
                    deferred.reject(getPersonnelByUserIdResponse);
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error looking up the personnel user id.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                //currentContext.showErrorView(msg);
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = jqXHR.responseText;
                }
                appEvents.trigger(AppEventNamesEnum.userIdLookupError, msg);
                deferred.reject(msg);
            });

            return deferred.promise();
        },
        goToAddItem: function(attributes) {
            console.trace('DashboardController.goToAddItem');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postAddItem(attributes)).done(function(postAddItemResponse) {
                appEvents.trigger(AppEventNamesEnum.addItemSuccess, postAddItemResponse.lookupDataItem);
                deferred.resolve(postAddItemResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                appEvents.trigger(AppEventNamesEnum.checkInError, "error");
                deferred.reject("error");
            });

            return deferred.promise();
        },
        goToUpdateItem: function(attributes) {
            console.trace('DashboardController.goToUpdateItem');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postUpdateItem(attributes)).done(function(postUpdateItemResults) {
                appEvents.trigger(AppEventNamesEnum.updateItemSuccess, postUpdateItemResults.lookupDataItem);
                deferred.resolve(postUpdateItemResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                appEvents.trigger(AppEventNamesEnum.checkInError, "error");
                deferred.reject("error");
            });

            return deferred.promise();
        },
        goToDirectionsWithLatLng: function(latitude, longitude) {
            console.trace('DashboardController.goToDirectionsWithLatLng');
            var directionsUri = 'http://maps.google.com?daddr=' + latitude + "," + longitude;
            globals.window.open(directionsUri);
        }
    });

    return DashboardController;
});