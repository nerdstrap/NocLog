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

            this.listenTo(appEvents, AppEventNamesEnum.showOpenStationEntryLogs, this.showOpenStationEntryLogs);
            this.listenTo(appEvents, AppEventNamesEnum.showExpiredStationEntryLogs, this.showExpiredStationEntryLogs);
            this.listenTo(appEvents, AppEventNamesEnum.showStationEntryLogs, this.showStationEntryLogs);

            this.listenTo(appEvents, AppEventNamesEnum.showStations, this.showStations);

            this.listenTo(appEvents, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);

            this.listenTo(appEvents, AppEventNamesEnum.goToNewStationEntryLog, this.goToNewStationEntryLog);
            this.listenTo(appEvents, AppEventNamesEnum.goToCheckIn, this.goToCheckIn);
            this.listenTo(appEvents, AppEventNamesEnum.goToCheckOut, this.goToCheckOut);
            this.listenTo(appEvents, AppEventNamesEnum.goToUpdateCheckIn, this.goToUpdateCheckIn);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInSuccess, this.showOpenStationEntryLogs);


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

            $.when(currentContext.dashboardService.getStationEntryLogsByOpen(options)).done(function(getStationEntryLogsResponse) {
                stationEntryLogListViewInstance.setUserRole(getStationEntryLogsResponse.userRole);
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogsResponse.stationEntryLogs);
                currentContext.stationIdentifierResults.reset(getStationEntryLogsResponse.stationIdentifiers);
                currentContext.regionResults.reset(getStationEntryLogsResponse.regions);
                currentContext.areaResults.reset(getStationEntryLogsResponse.areas);
                deferred.resolve(stationEntryLogListViewInstance);
                stationEntryLogListViewInstance.hideLoading();
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
            $.when(currentContext.dashboardService.getStationEntryLogs()).done(function(getStationEntryLogsResponse) {
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
                currentContext.stationIdentifierResults.reset(getStationsResponse.stationIdentifiers);
                currentContext.regionResults.reset(getStationsResponse.regions);
                currentContext.areaResults.reset(getStationsResponse.areas);
                deferred.resolve(stationListViewInstance);
                stationListViewInstance.hideLoading();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.stationSearchResults.reset();
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

            $.when(currentContext.dashboardService.getStationEntryLogById(stationEntryLogModelInstance.attributes), currentContext.dashboardService.getNewStationEntryLogOptions()).done(function(getStationEntryLogResults, getNewStationEntryLogOptionsResults) {
                stationEntryLogModelInstance.set(getStationEntryLogResults[0]);
                currentContext.durationResults.reset(getNewStationEntryLogOptionsResults[0].durations);
                stationEntryLogViewInstance.updateViewFromModel();
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

            $.when(currentContext.dashboardService.getStationById(stationModelInstance.attributes)).done(function(getStationByIdResponse) {
                stationModelInstance.set(getStationByIdResponse);
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
                deferred.resolve(getStationEntryLogsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        showOpenStationEntryLogs: function(options) {
        //showOpenStationEntryLogs: function(stationEntryLogCollection, options) {
            console.trace('DashboardController.showOpenStationEntryLogs');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getStationEntryLogsByOpen(options)).done(function(getStationEntryLogsByOpenResponse) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogsByOpenResponse.stationEntryLogs);
                deferred.resolve(getStationEntryLogsByOpenResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        showExpiredStationEntryLogs: function(options) {
            console.trace('DashboardController.showExpiredStationEntryLogs');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getStationEntryLogsByExpired(options)).done(function(getStationEntryLogsByExpiredResponse) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogsByExpiredResponse.stationEntryLogs);
                deferred.resolve(getStationEntryLogsByExpiredResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        showStations: function(options) {
            console.trace('DashboardController.showStations');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getStations(options)).done(function(getStationsResponse) {
                currentContext.stationSearchResults.reset(getStationsResponse.stations);
                deferred.resolve(getStationsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToNewStationEntryLog: function() {
            console.trace('DashboardController.goToNewStationEntryLog');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getNewStationEntryLogOptions()).done(function(getNewStationEntryLogOptionsResponse) {
                currentContext.purposeResults.reset(getNewStationEntryLogOptionsResponse.purposes);
                currentContext.durationResults.reset(getNewStationEntryLogOptionsResponse.durations);
                deferred.resolve(getNewStationEntryLogOptionsResponse);
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
                currentContext.stationEntryLogSearchResults.add(checkInResponse);
                appEvents.trigger(AppEventNamesEnum.checkInSuccess, checkInResponse);
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
                stationEntryLogModel.destroy();
                appEvents.trigger(AppEventNamesEnum.checkOutSuccess, checkOutResponse);
                deferred.resolve(checkOutResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error checking out. Please call the dispatch center.';
                appEvents.trigger(AppEventNamesEnum.checkOutError, msg);
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                //currentContext.showErrorView(msg);
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = jqXHR.responseText;
                }

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
                appEvents.trigger(AppEventNamesEnum.updateCheckInSuccess, updateCheckInResults);
                deferred.resolve(updateCheckInResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error updating entry.';
                appEvents.trigger(AppEventNamesEnum.updateCheckInError, msg);
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                //currentContext.showErrorView(msg);
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = jqXHR.responseText;
                }

                deferred.reject(msg);
            });

            return deferred.promise();
        },
        goToLookupUserId: function(personnelModel) {
            console.trace('DashboardController.goToLookupUserId');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getPersonnelByUserId(personnelModel.attributes)).done(function(getPersonnelByUserIdResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userIdFound, getPersonnelByUserIdResponse);
                deferred.resolve(getPersonnelByUserIdResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error looking up the personnel user id.';
                appEvents.trigger(AppEventNamesEnum.userIdLookupError, msg);
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                //currentContext.showErrorView(msg);
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = jqXHR.responseText;
                }
                deferred.reject(msg);
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