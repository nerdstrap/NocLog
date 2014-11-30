define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            DashboardService = require('services/DashboardService'),
            EditPurposeListView = require('views/EditPurposeListView'),
            StationEntryLogListView = require('views/StationEntryLogListView'),
            StationEntryLogHistoryListView = require('views/StationEntryLogHistoryListView'),
            StationListView = require('views/StationListView'),
            PersonnelListView = require('views/PersonnelListView'),
            NewStationEntryLogView = require('views/NewStationEntryLogView'),
            StationEntryLogView = require('views/StationEntryLogView'),
            StationView = require('views/StationView'),
            PersonnelView = require('views/PersonnelView'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            NewStationEntryLogModel = require('models/NewStationEntryLogModel'),
            StationModel = require('models/StationModel'),
            PersonnelModel = require('models/PersonnelModel'),
            StationEntryLogCollection = require('collections/StationEntryLogCollection'),
            StationCollection = require('collections/StationCollection'),
            PersonnelCollection = require('collections/PersonnelCollection'),
            LookupDataItemCollection = require('collections/LookupDataItemCollection'),
            PurposeCollection = require('collections/PurposeCollection'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            globals = require('globals'),
            env = require('env'),
            utils = require('utils');

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

            this.stationIdentifierResults = options.stationIdentifierCollection || new Backbone.Collection();
            this.regionResults = options.regionCollection || new Backbone.Collection();
            this.areaResults = options.areaCollection || new Backbone.Collection();
            this.purposeResults = options.purposeCollection || new LookupDataItemCollection();
            this.durationResults = options.durationCollection || new LookupDataItemCollection();

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogList, this.goToStationEntryLogList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogHistoryList, this.goToStationEntryLogHistoryList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationList, this.goToStationList);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnelList, this.goToPersonnelList);
            this.listenTo(appEvents, AppEventNamesEnum.goToMaintainPurposes, this.goToMaintainPurposes);

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogWithId, this.goToStationEntryLogWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnelWithId, this.goToPersonnelWithId);

            this.listenTo(appEvents, AppEventNamesEnum.refreshStationEntryLogList, this.refreshStationEntryLogList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshStationList, this.refreshStationList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshPersonnelList, this.refreshPersonnelList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshMaintainPurposes, this.refreshMaintainPurposes);

            this.listenTo(appEvents, AppEventNamesEnum.goToNewStationEntryLog, this.goToNewStationEntryLog);
            this.listenTo(appEvents, AppEventNamesEnum.checkIn, this.checkIn);
            this.listenTo(appEvents, AppEventNamesEnum.checkOut, this.checkOut);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckIn, this.updateCheckIn);

            this.listenTo(appEvents, AppEventNamesEnum.addItem, this.addItem);
            this.listenTo(appEvents, AppEventNamesEnum.updateItem, this.updateItem);

            this.listenTo(appEvents, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
            this.listenTo(appEvents, AppEventNamesEnum.goToExportStationEntryLogList, this.goToExportStationEntryLogList);
        },
        goToStationEntryLogList: function(options) {
            console.trace('DashboardController.goToStationEntryLogList');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationEntryLogSearchResults = new StationEntryLogCollection();
            stationEntryLogSearchResults.setSortAttribute('expectedOutTime');
            var stationEntryLogListViewInstance = new StationEntryLogListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationEntryLogSearchResults,
                stationIdentifierCollection: currentContext.stationIdentifierResults,
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
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogsResponse.userRole);
                stationEntryLogSearchResults.reset(getStationEntryLogsResponse.stationEntryLogs);
                currentContext.stationIdentifierResults.reset(getStationEntryLogsResponse.stationIdentifiers);
                currentContext.regionResults.reset(getStationEntryLogsResponse.regions);
                currentContext.areaResults.reset(getStationEntryLogsResponse.areas);
                if (options && options.stationEntryLog) {
                    var userName = options.stationEntryLog.userName;
                    var stationName = options.stationEntryLog.stationName;
                    var updateCheckInSucessMessage = 'Successful update of check-in for ' + userName + ' at ' + stationName;
                    stationEntryLogListViewInstance.showSuccess(updateCheckInSucessMessage);
                }
                deferred.resolve(stationEntryLogListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogSearchResults.reset();
                stationEntryLogListViewInstance.showError(textStatus);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToStationEntryLogHistoryList: function() {
            console.trace('DashboardController.goToStationEntryLogHistoryList');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationEntryLogSearchResults = new StationEntryLogCollection();
            stationEntryLogSearchResults.setSortAttribute('outTime');

            var stationEntryLogHistoryListViewInstance = new StationEntryLogHistoryListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationEntryLogSearchResults,
                stationIdentifierCollection: currentContext.stationIdentifierResults,
                regionCollection: currentContext.regionResults,
                areaCollection: currentContext.areaResults
            });

            currentContext.router.swapContent(stationEntryLogHistoryListViewInstance);
            currentContext.router.navigate('stationEntryLogHistory');

            stationEntryLogHistoryListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs({onlyCheckedOut: true})).done(function(getStationEntryLogsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogsResponse.userRole);
                stationEntryLogSearchResults.reset(getStationEntryLogsResponse.stationEntryLogs);
                currentContext.stationIdentifierResults.reset(getStationEntryLogsResponse.stationIdentifiers);
                currentContext.regionResults.reset(getStationEntryLogsResponse.regions);
                currentContext.areaResults.reset(getStationEntryLogsResponse.areas);
                deferred.resolve(stationEntryLogHistoryListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogSearchResults.reset();
                stationEntryLogHistoryListViewInstance.showError(textStatus);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToStationList: function() {
            console.trace('DashboardController.goToStationList');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationSearchResults = new StationCollection();
            stationSearchResults.setSortAttribute('stationName');
            var stationListViewInstance = new StationListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationSearchResults,
                stationIdentifierCollection: currentContext.stationIdentifierResults,
                regionCollection: currentContext.regionResults,
                areaCollection: currentContext.areaResults
            });

            currentContext.router.swapContent(stationListViewInstance);
            currentContext.router.navigate('station');

            stationListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStations()).done(function(getStationsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationsResponse.userRole);
                stationSearchResults.reset(getStationsResponse.stations);
                currentContext.stationIdentifierResults.reset(getStationsResponse.stationIdentifiers);
                currentContext.regionResults.reset(getStationsResponse.regions);
                currentContext.areaResults.reset(getStationsResponse.areas);
                deferred.resolve(stationListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationSearchResults.reset();
                stationListViewInstance.showError(textStatus);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToPersonnelList: function() {
            console.trace('DashboardController.goToPersonnelList');
            var currentContext = this,
                    deferred = $.Deferred();

            var personnelSearchResults = new PersonnelCollection();
            personnelSearchResults.setSortAttribute('userName');
            var personnelListViewInstance = new PersonnelListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: personnelSearchResults
            });

            currentContext.router.swapContent(personnelListViewInstance);
            currentContext.router.navigate('personnel');

            personnelListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getPersonnels()).done(function(getPersonnelsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getPersonnelsResponse.userRole);
                personnelSearchResults.reset(getPersonnelsResponse.personnels);
                deferred.resolve(getPersonnelsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                personnelSearchResults.reset();
                personnelListViewInstance.showError(textStatus);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToMaintainPurposes: function() {
            console.trace('DashboardController.goToMaintainPurposes');
            var currentContext = this,
                    deferred = $.Deferred();


            var purposeSearchResults = new PurposeCollection();
            purposeSearchResults.setSortAttribute('sortOrder');
            var purposeMaintenanceViewInstance = new EditPurposeListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: purposeSearchResults,
                durationCollection: currentContext.durationResults
            });

            currentContext.router.swapContent(purposeMaintenanceViewInstance);
            currentContext.router.navigate('maintenance');

            purposeMaintenanceViewInstance.showLoading();
            $.when(currentContext.dashboardService.getOptions()).done(function(getOptionsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getOptionsResponse.userRole);
                purposeSearchResults.reset(getOptionsResponse.purposes);
                currentContext.durationResults.reset(getOptionsResponse.durations);
                deferred.resolve(getOptionsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                purposeSearchResults.reset();
                purposeMaintenanceViewInstance.showError(textStatus);
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

            stationEntryLogViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs(stationEntryLogModelInstance.attributes), currentContext.dashboardService.getOptions()).done(function(getStationEntryLogResults, getOptionsResults) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogResults[0].userRole);
                if (getStationEntryLogResults[0].stationEntryLogs && getStationEntryLogResults[0].stationEntryLogs.length > 0) {
                    stationEntryLogModelInstance.set(getStationEntryLogResults[0].stationEntryLogs[0]);
                    currentContext.durationResults.reset(getOptionsResults[0].durations);
                    deferred.resolve(stationEntryLogViewInstance);
                } else {
                    stationEntryLogModelInstance.clear();
                    stationEntryLogViewInstance.showError('not found!');
                    deferred.reject('not found!');
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogModelInstance.clear();
                stationEntryLogViewInstance.showError(textStatus);
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
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationByIdResponse.userRole);
                if (getStationByIdResponse.stations && getStationByIdResponse.stations.length > 0) {
                    stationModelInstance.set(getStationByIdResponse.stations[0]);
                    deferred.resolve(stationViewInstance);
                } else {
                    stationModelInstance.clear();
                    stationViewInstance.showError('not found!');
                    deferred.reject('not found!');
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationModelInstance.clear();
                stationViewInstance.showError(textStatus);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToPersonnelWithId: function(userId) {
            console.trace('DashboardController.goToPersonnelWithId');
            var currentContext = this,
                    deferred = $.Deferred();

            var personnelModelInstance = new PersonnelModel({userId: userId});
            var personnelViewInstance = new PersonnelView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: personnelModelInstance,
                stationIdentifierCollection: currentContext.stationIdentifierResults
            });

            currentContext.router.swapContent(personnelViewInstance);
            currentContext.router.navigate('personnel/' + userId);

            personnelViewInstance.showLoading();
            $.when(currentContext.dashboardService.getPersonnels(personnelModelInstance.attributes)).done(function(getPersonnelsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getPersonnelsResponse.userRole);
                if (getPersonnelsResponse && getPersonnelsResponse.personnels && getPersonnelsResponse.personnels.length > 0) {
                    personnelModelInstance.set(getPersonnelsResponse.personnels[0]);
//                    personnelViewInstance.updateViewFromModel(getPersonnelsResponse.personnels[0]);
//                    currentContext.stationIdentifierResults.reset(getPersonnelsResponse.stationIdentifiers);
//                    personnelViewInstance.hideLoading();
//                    personnelViewInstance._addStationEntryLogs();
//                    var options = {
//                        userId: userId,
//                        onlyCheckedOut: true
//                    };
//                    personnelViewInstance._loadStationEntryLogs(options);
                    deferred.resolve(personnelViewInstance);
                } else {
                    personnelModelInstance.clear();
                    personnelViewInstance.showError('not found!');
                    deferred.reject('not found!');
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                personnelViewInstance.hideLoading();
                personnelViewInstance.showError(textStatus);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        refreshStationEntryLogList: function(stationEntryLogCollection, options) {
            console.trace('DashboardController.refreshStationEntryLogList');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getStationEntryLogs(options)).done(function(getStationEntryLogsResponse) {
                stationEntryLogCollection.reset(getStationEntryLogsResponse.stationEntryLogs);
                deferred.resolve(getStationEntryLogsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogCollection.reset();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        refreshStationList: function(stationCollection, options) {
            console.trace('DashboardController.refreshStationList');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getStations(options)).done(function(getStationsResponse) {
                stationCollection.reset(getStationsResponse.stations);
                deferred.resolve(getStationsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationCollection.reset();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        refreshPersonnelList: function(personnelCollection, options) {
            console.trace('DashboardController.refreshPersonnelList');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getPersonnels(options)).done(function(getPersonnelsResponse) {
                personnelCollection.reset(getPersonnelsResponse.personnels);
                deferred.resolve(getPersonnelsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                personnelCollection.reset();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        refreshMaintainPurposes: function(purposeCollection, options) {
            console.trace('DashboardController.refreshMaintainPurposes');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getOptions()).done(function(getOptionsResponse) {
                purposeCollection.reset(getOptionsResponse.purposes);
                deferred.resolve(getOptionsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                purposeCollection.reset();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToNewStationEntryLog: function(container) {
            console.trace('DashboardController.goToNewStationEntryLog');
            var currentContext = this,
                    deferred = $.Deferred();

            var newStationEntryLogModelInstance = new NewStationEntryLogModel();
            var stationIdentifierCollection = new Backbone.Collection();
            var purposeCollection = new LookupDataItemCollection();
            var durationCollection = new LookupDataItemCollection();
            var newStationEntryLogViewInstance = new NewStationEntryLogView({
                model: newStationEntryLogModelInstance,
                dispatcher: currentContext.dispatcher,
                stationIdentifierCollection: stationIdentifierCollection,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection
            }).render();

            newStationEntryLogViewInstance.showLoading();
            container.html(newStationEntryLogViewInstance.el);

            $.when(currentContext.dashboardService.getOptions()).done(function(getOptionsResponse) {
                stationIdentifierCollection.reset(getOptionsResponse.stationIdentifiers);
                purposeCollection.reset(_.where(getOptionsResponse.purposes, {itemEnabled: true}));
                durationCollection.reset(_.where(getOptionsResponse.durations, {itemEnabled: true}));
                newStationEntryLogViewInstance.hideLoading();
                deferred.resolve(newStationEntryLogViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        checkIn: function(stationEntryLogModel) {
            console.trace('DashboardController.checkIn');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postCheckIn(stationEntryLogModel.attributes)).done(function(checkInResponse) {
                appEvents.trigger(AppEventNamesEnum.checkInSuccess, checkInResponse.stationEntryLog);
                deferred.resolve(checkInResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error checking in.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = jqXHR.responseText;
                }
                appEvents.trigger(AppEventNamesEnum.checkInError, msg);
                deferred.reject(msg);
            });

            return deferred.promise();
        },
        checkOut: function(stationEntryLogModel) {
            console.trace('DashboardController.checkOut');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postCheckOut(stationEntryLogModel.attributes)).done(function(checkOutResponse) {
                stationEntryLogModel.trigger('destroy', stationEntryLogModel, stationEntryLogModel.collection, options);
                appEvents.trigger(AppEventNamesEnum.checkOutSuccess, checkOutResponse.stationEntryLog);
                deferred.resolve(checkOutResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error checking out. Please call the dispatch center.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = 'You are already checked-out.';
                }
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = 'You do not have permission to check-out this user.';
                }
                appEvents.trigger(AppEventNamesEnum.checkOutError, msg);
                deferred.reject(msg);
            });

            return deferred.promise();
        },
        updateCheckIn: function(stationEntryLogModel) {
            console.trace('DashboardController.updateCheckIn');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postUpdateCheckIn(stationEntryLogModel.attributes)).done(function(updateCheckInResults) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, updateCheckInResults.userRole);
                var model = currentContext.stationEntryLogSearchResults.findWhere({stationEntryLogId: updateCheckInResults.stationEntryLogId});
                appEvents.trigger(AppEventNamesEnum.updateCheckInSuccess, updateCheckInResults.stationEntryLog);
                currentContext.countExpiredStationEntryLogs(currentContext.stationEntryLogSearchResults);
                deferred.resolve(updateCheckInResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error updating entry.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    msg = jqXHR.responseText;
                }

                appEvents.trigger(AppEventNamesEnum.updateCheckInError, msg);
                deferred.reject(msg);
            });

            return deferred.promise();
        },
        addItem: function(purposeModel) {
            console.trace('DashboardController.addItem');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postAddItem(purposeModel.attributes)).done(function(postAddItemResponse) {
                //set the id
                purposeModel.trigger(AppEventNamesEnum.addItemSuccess, postAddItemResponse.lookupDataItem);
                deferred.resolve(postAddItemResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                purposeModel.trigger(AppEventNamesEnum.addItemError, 'error');
                deferred.reject('error');
            });

            return deferred.promise();
        },
        updateItem: function(purposeModel) {
            console.trace('DashboardController.updateItem');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postUpdateItem(purposeModel.attributes)).done(function(postUpdateItemResults) {
                purposeModel.trigger(AppEventNamesEnum.updateItemSuccess, postUpdateItemResults.lookupDataItem);
                deferred.resolve(postUpdateItemResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                purposeModel.trigger(AppEventNamesEnum.updateItemError, 'error');
                deferred.reject('error');
            });

            return deferred.promise();
        },
        goToDirectionsWithLatLng: function(latitude, longitude) {
            console.trace('DashboardController.goToDirectionsWithLatLng');
            var directionsUri = 'http://maps.google.com?daddr=' + latitude + ',' + longitude;
            globals.window.open(directionsUri);
        },
        goToExportStationEntryLogList: function(stationEntryLogCollection, options) {
            var csv = stationEntryLogCollection.toCsv();
            var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
            var fileName = utils.getCSVFileName(options);
            saveAs(blob, fileName);
        }
    });

    return DashboardController;
});