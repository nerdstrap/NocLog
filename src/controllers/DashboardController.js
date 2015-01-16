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
            EditPurposeListView = require('views/EditPurposeListView'),
            StationEntryLogView = require('views/StationEntryLogView'),
            StationView = require('views/StationView'),
            PersonnelView = require('views/PersonnelView'),
            StationEntryLogCollection = require('collections/StationEntryLogCollection'),
            StationCollection = require('collections/StationCollection'),
            PersonnelCollection = require('collections/PersonnelCollection'),
            LookupDataItemCollection = require('collections/LookupDataItemCollection'),
            ListItemCollection = require('collections/ListItemCollection'),
            PurposeCollection = require('collections/PurposeCollection'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            StationModel = require('models/StationModel'),
            PersonnelModel = require('models/PersonnelModel'),
            CSVExportTemplate = require('hbs!templates/CSVExport'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            globals = require('globals'),
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

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogList, this.goToStationEntryLogList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogHistoryList, this.goToStationEntryLogHistoryList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationList, this.goToStationList);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnelList, this.goToPersonnelList);
            this.listenTo(appEvents, AppEventNamesEnum.goToMaintainPurposes, this.goToMaintainPurposes);

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogWithId, this.goToStationEntryLogWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnel, this.goToPersonnel);

            this.listenTo(appEvents, AppEventNamesEnum.refreshStationEntryLogList, this.refreshStationEntryLogList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshStationList, this.refreshStationList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshPersonnelList, this.refreshPersonnelList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshMaintainPurposes, this.refreshMaintainPurposes);

            this.listenTo(appEvents, AppEventNamesEnum.checkIn, this.checkIn);
            this.listenTo(appEvents, AppEventNamesEnum.checkOut, this.checkOut);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckIn, this.updateCheckIn);

            this.listenTo(appEvents, AppEventNamesEnum.refreshOptions, this.refreshOptions);
            this.listenTo(appEvents, AppEventNamesEnum.refreshFilters, this.refreshFilters);

            this.listenTo(appEvents, AppEventNamesEnum.addItem, this.addItem);
            this.listenTo(appEvents, AppEventNamesEnum.updateItem, this.updateItem);

            this.listenTo(appEvents, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
            this.listenTo(appEvents, AppEventNamesEnum.goToExportStationEntryLogList, this.goToExportStationEntryLogList);
        },
        goToStationEntryLogList: function(options) {
            console.trace('DashboardController.goToStationEntryLogList');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationEntryLogCollection = new StationEntryLogCollection();
            stationEntryLogCollection.setSortAttribute('expectedOutTime');
            var stationIdentifierCompleteCollection = new ListItemCollection();
            var stationIdentifierCollection = new ListItemCollection();
            var regionCompleteCollection = new ListItemCollection();
            var regionCollection = new ListItemCollection();
            var areaCompleteCollection = new ListItemCollection();
            var areaCollection = new ListItemCollection();
            var stationEntryLogListViewInstance = new StationEntryLogListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationEntryLogCollection,
                stationIdentifierCompleteCollection: stationIdentifierCompleteCollection,
                stationIdentifierCollection: stationIdentifierCollection,
                regionCompleteCollection: regionCompleteCollection,
                regionCollection: regionCollection,
                areaCompleteCollection: areaCompleteCollection,
                areaCollection: areaCollection
            });

            currentContext.router.swapContent(stationEntryLogListViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'stationEntryLog' || Backbone.history.fragment === '');
            currentContext.router.navigate('stationEntryLog', {replace: fragmentAlreadyMatches});

            stationEntryLogListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs({onlyOpen: true})).done(function(getStationEntryLogsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogsResponse.userRole);
                stationEntryLogListViewInstance.setUserRole(getStationEntryLogsResponse.userRole);
                stationEntryLogCollection.reset(getStationEntryLogsResponse.stationEntryLogs);
                stationIdentifierCompleteCollection.reset(getStationEntryLogsResponse.stationIdentifiers);
                stationIdentifierCollection.reset(getStationEntryLogsResponse.stationIdentifiers);
                regionCompleteCollection.reset(getStationEntryLogsResponse.regions);
                regionCollection.reset(getStationEntryLogsResponse.regions);
                areaCompleteCollection.reset(getStationEntryLogsResponse.areas);
                areaCollection.reset(getStationEntryLogsResponse.areas);
                if (options && options.stationEntryLog) {
                    var userName = options.stationEntryLog.userName;
                    var stationName = options.stationEntryLog.stationName;
                    var updateCheckInSucessMessage = 'Successful update of check-in for ' + userName + ' at ' + stationName;
                    stationEntryLogListViewInstance.showSuccess(updateCheckInSucessMessage);
                }
                deferred.resolve(stationEntryLogListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogCollection.reset();
                stationEntryLogListViewInstance.showError(textStatus);
                deferred.reject({
                    stationEntryLogListView: stationEntryLogListViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },
        goToStationEntryLogHistoryList: function() {
            console.trace('DashboardController.goToStationEntryLogHistoryList');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationEntryLogCollection = new StationEntryLogCollection();
            stationEntryLogCollection.setSortAttribute('outTime');
            var stationIdentifierCompleteCollection = new ListItemCollection();
            var stationIdentifierCollection = new ListItemCollection();
            var regionCompleteCollection = new ListItemCollection();
            var regionCollection = new ListItemCollection();
            var areaCompleteCollection = new ListItemCollection();
            var areaCollection = new ListItemCollection();
            var stationEntryLogHistoryListViewInstance = new StationEntryLogHistoryListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationEntryLogCollection,
                stationIdentifierCompleteCollection: stationIdentifierCompleteCollection,
                stationIdentifierCollection: stationIdentifierCollection,
                regionCompleteCollection: regionCompleteCollection,
                regionCollection: regionCollection,
                areaCompleteCollection: areaCompleteCollection,
                areaCollection: areaCollection
            });

            currentContext.router.swapContent(stationEntryLogHistoryListViewInstance);
            currentContext.router.navigate('stationEntryLogHistory');

            stationEntryLogHistoryListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs({onlyCheckedOut: true})).done(function(getStationEntryLogsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogsResponse.userRole);
                stationEntryLogHistoryListViewInstance.setUserRole(getStationEntryLogsResponse.userRole);
                stationEntryLogCollection.reset(getStationEntryLogsResponse.stationEntryLogs);
                stationIdentifierCompleteCollection.reset(getStationEntryLogsResponse.stationIdentifiers);
                stationIdentifierCollection.reset(getStationEntryLogsResponse.stationIdentifiers);
                regionCompleteCollection.reset(getStationEntryLogsResponse.regions);
                regionCollection.reset(getStationEntryLogsResponse.regions);
                areaCompleteCollection.reset(getStationEntryLogsResponse.areas);
                areaCollection.reset(getStationEntryLogsResponse.areas);
                deferred.resolve(stationEntryLogHistoryListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogCollection.reset();
                stationEntryLogHistoryListViewInstance.showError(textStatus);
                deferred.reject({
                    stationEntryLogHistoryListView: stationEntryLogHistoryListViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },
        goToStationList: function() {
            console.trace('DashboardController.goToStationList');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationCollection = new StationCollection();
            stationCollection.setSortAttribute('stationName');
            var stationIdentifierCompleteCollection = new ListItemCollection();
            var stationIdentifierCollection = new ListItemCollection();
            var regionCompleteCollection = new ListItemCollection();
            var regionCollection = new ListItemCollection();
            var areaCompleteCollection = new ListItemCollection();
            var areaCollection = new ListItemCollection();
            var stationListViewInstance = new StationListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationCollection,
                stationIdentifierCompleteCollection: stationIdentifierCompleteCollection,
                stationIdentifierCollection: stationIdentifierCollection,
                regionCompleteCollection: regionCompleteCollection,
                regionCollection: regionCollection,
                areaCompleteCollection: areaCompleteCollection,
                areaCollection: areaCollection
            });

            currentContext.router.swapContent(stationListViewInstance);
            currentContext.router.navigate('station');

            stationListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStations()).done(function(getStationsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationsResponse.userRole);
                stationListViewInstance.setUserRole(getStationsResponse.userRole);
                stationCollection.reset(getStationsResponse.stations);
                stationIdentifierCompleteCollection.reset(getStationsResponse.stationIdentifiers);
                stationIdentifierCollection.reset(getStationsResponse.stationIdentifiers);
                regionCompleteCollection.reset(getStationsResponse.regions);
                regionCollection.reset(getStationsResponse.regions);
                areaCompleteCollection.reset(getStationsResponse.areas);
                areaCollection.reset(getStationsResponse.areas);
                deferred.resolve(stationListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationCollection.reset();
                stationListViewInstance.showError(textStatus);
                deferred.reject({
                    stationListView: stationListViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },
        goToPersonnelList: function() {
            console.trace('DashboardController.goToPersonnelList');
            var currentContext = this,
                    deferred = $.Deferred();

            var personnelCollection = new PersonnelCollection();
            personnelCollection.setSortAttribute('userName');
            var personnelListViewInstance = new PersonnelListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: personnelCollection
            });

            currentContext.router.swapContent(personnelListViewInstance);
            currentContext.router.navigate('personnel');

            personnelListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getOptions()).done(function(getOptionsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getOptionsResponse.userRole);
                personnelListViewInstance.setUserRole(getOptionsResponse.userRole);
                personnelListViewInstance.setInitialFieldFocus();
                personnelCollection.reset();
                deferred.resolve(personnelListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                personnelCollection.reset();
                personnelListViewInstance.showError(textStatus);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToMaintainPurposes: function() {
            console.trace('DashboardController.goToMaintainPurposes');
            var currentContext = this,
                    deferred = $.Deferred();


            var purposeCollection = new PurposeCollection();
            var durationCollection = new LookupDataItemCollection();
            var purposeMaintenanceViewInstance = new EditPurposeListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: purposeCollection,
                durationCollection: durationCollection
            });

            currentContext.router.swapContent(purposeMaintenanceViewInstance);
            currentContext.router.navigate('maintenance');

            purposeMaintenanceViewInstance.showLoading();
            $.when(currentContext.dashboardService.getOptions()).done(function(getOptionsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getOptionsResponse.userRole);
                purposeMaintenanceViewInstance.setUserRole(getOptionsResponse.userRole);
                durationCollection.reset(getOptionsResponse.durations);
                purposeCollection.reset(getOptionsResponse.purposes);
                deferred.resolve(purposeMaintenanceViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                purposeCollection.reset();
                purposeMaintenanceViewInstance.showError(textStatus);
                deferred.reject({
                    purposeMaintenanceView: purposeMaintenanceViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },
        goToStationEntryLogWithId: function(stationEntryLogId, referringAppEvent, personnelViewOptions) {
            console.trace('DashboardController.goToStationEntryLogWithId');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationEntryLogModelInstance = new StationEntryLogModel({stationEntryLogId: stationEntryLogId});
            var durationCollection = new LookupDataItemCollection();
            var stationEntryLogViewInstance = new StationEntryLogView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: stationEntryLogModelInstance,
                durationCollection: durationCollection,
                referringAppEvent: referringAppEvent,
                personnelViewOptions: personnelViewOptions
            });

            currentContext.router.swapContent(stationEntryLogViewInstance);
            currentContext.router.navigate('stationEntryLog/' + stationEntryLogId);

            stationEntryLogViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs(stationEntryLogModelInstance.attributes), currentContext.dashboardService.getOptions()).done(function(getStationEntryLogResults, getOptionsResults) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogResults[0].userRole);
                if (getStationEntryLogResults[0].stationEntryLogs && getStationEntryLogResults[0].stationEntryLogs.length > 0) {
                    stationEntryLogViewInstance.setUserRole(getStationEntryLogResults[0].userRole);
                    stationEntryLogModelInstance.set(getStationEntryLogResults[0].stationEntryLogs[0]);
                    stationEntryLogViewInstance.setInitialFieldFocus();
                    durationCollection.reset(getOptionsResults[0].durations);
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
                    stationViewInstance.setUserRole(getStationByIdResponse.userRole);
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
        goToPersonnel: function(options) {
            options || (options = {});
            console.trace('DashboardController.goToPersonnelWithId');
            var currentContext = this,
                    deferred = $.Deferred();

            var personnelModelInstance = new PersonnelModel(options);
            var personnelViewInstance = new PersonnelView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: personnelModelInstance
            });

            currentContext.router.swapContent(personnelViewInstance);
            if (options.userId) {
                currentContext.router.navigate('personnel/userId/' + options.userId);
            } else {
                currentContext.router.navigate('personnel/userName/' + options.userName);
            }

            personnelViewInstance.showLoading();
            $.when(currentContext.dashboardService.getPersonnels(personnelModelInstance.attributes)).done(function(getPersonnelsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getPersonnelsResponse.userRole);
                if (getPersonnelsResponse && getPersonnelsResponse.personnels && getPersonnelsResponse.personnels.length > 0) {
                    personnelViewInstance.setUserRole(getPersonnelsResponse.userRole);
                    personnelModelInstance.set(getPersonnelsResponse.personnels[0]);
                    deferred.resolve(personnelViewInstance);
                } else {
                    personnelModelInstance.clear();
                    personnelViewInstance.showError('invalid user!');
                    deferred.reject('invalid user!');
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                personnelModelInstance.clear();
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
        refreshOptions: function(options) {
            options || (options = {});
            console.trace('DashboardController.refreshOptions');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getOptions()).done(function(getOptionsResponse) {
                if (options.userRole) {
                    options.userRole = getOptionsResponse.userRole;
                }
                if (options.stationIdentifierCollection) {
                    options.stationIdentifierCollection.reset(getOptionsResponse.stationIdentifiers);
                }
                if (options.purposeCollection) {
                    options.purposeCollection.reset(getOptionsResponse.purposes);
                }
                if (options.durationCollection) {
                    options.durationCollection.reset(getOptionsResponse.durations);
                }
                deferred.resolve(getOptionsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        refreshFilters: function(options) {
            options || (options = {});
            console.trace('DashboardController.refreshFilters');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getOptions()).done(function(getOptionsResponse) {
                if (options.userRole) {
                    options.userRole = getOptionsResponse.userRole;
                }
                if (options.stationIdentifierCollection) {
                    options.stationIdentifierCollection.reset(getOptionsResponse.stationIdentifiers);
                }
                if (options.purposeCollection) {
                    options.purposeCollection.reset(_.where(getOptionsResponse.purposes, {itemEnabled: true}));
                }
                if (options.durationCollection) {
                    options.durationCollection.reset(_.where(getOptionsResponse.durations, {itemEnabled: true}));
                }
                deferred.resolve(getOptionsResponse);
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
                var errorMessage = 'Error checking in.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    errorMessage = jqXHR.responseText;
                }
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    errorMessage = jqXHR.responseText;
                }
                appEvents.trigger(AppEventNamesEnum.checkInError, errorMessage);
                deferred.reject(errorMessage);
            });

            return deferred.promise();
        },
        checkOut: function(stationEntryLogModel) {
            console.trace('DashboardController.checkOut');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postCheckOut(stationEntryLogModel.attributes)).done(function(checkOutResponse) {
                stationEntryLogModel.trigger('destroy', stationEntryLogModel, stationEntryLogModel.collection);
                appEvents.trigger(AppEventNamesEnum.checkOutSuccess, checkOutResponse.stationEntryLog);
                deferred.resolve(checkOutResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error checking out. Please call the dispatch center.';
                if (jqXHR.status === 409) {
                    msg = 'The user is already checked-out.';
                }
                if (jqXHR.status === 403) {
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
                appEvents.trigger(AppEventNamesEnum.updateCheckInSuccess, updateCheckInResults.stationEntryLog);
                deferred.resolve(updateCheckInResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error updating entry.';
                if (jqXHR.status === 409) {
                    msg = 'The user is already checked-out.';
                }
                if (jqXHR.status === 403) {
                    msg = 'You do not have permission to check-out this user.';
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
            var csv = CSVExportTemplate({logArray: stationEntryLogCollection.models});
            var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
            var fileName = utils.getCSVFileName(options);
            saveAs(blob, fileName);
        }
    });

    return DashboardController;
});