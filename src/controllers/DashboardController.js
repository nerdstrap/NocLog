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
            EditExclusionListView = require('views/EditExclusionListView'),
            StationEntryLogView = require('views/StationEntryLogView'),
            StationView = require('views/StationView'),
            PersonnelView = require('views/PersonnelView'),
            StationEntryLogCollection = require('collections/StationEntryLogCollection'),
            StationCollection = require('collections/StationCollection'),
            PersonnelCollection = require('collections/PersonnelCollection'),
            LookupDataItemCollection = require('collections/LookupDataItemCollection'),
            EntryLogExclusionCollection = require('collections/EntryLogExclusionCollection'),
            ListItemCollection = require('collections/ListItemCollection'),
            PurposeCollection = require('collections/PurposeCollection'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            StationModel = require('models/StationModel'),
            PersonnelModel = require('models/PersonnelModel'),
            CSVExportTemplate = require('hbs!templates/CSVExport'),
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

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogList, this.goToStationEntryLogList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogHistoryList, this.goToStationEntryLogHistoryList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationList, this.goToStationList);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnelList, this.goToPersonnelList);
            this.listenTo(appEvents, AppEventNamesEnum.goToMaintainPurposes, this.goToMaintainPurposes);
            this.listenTo(appEvents, AppEventNamesEnum.goToMaintainExclusions, this.goToMaintainExclusions);

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogWithId, this.goToStationEntryLogWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnel, this.goToPersonnel);

            this.listenTo(appEvents, AppEventNamesEnum.refreshStationEntryLogList, this.refreshStationEntryLogList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshStationList, this.refreshStationList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshPersonnelList, this.refreshPersonnelList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshOverridePersonnelList, this.refreshOverridePersonnelList);
            this.listenTo(appEvents, AppEventNamesEnum.refreshMaintainPurposes, this.refreshMaintainPurposes);
            this.listenTo(appEvents, AppEventNamesEnum.refreshMaintainExclusions, this.refreshMaintainExclusions);
            this.listenTo(appEvents, AppEventNamesEnum.refreshStationWarningList, this.refreshStationWarningList);

            this.listenTo(appEvents, AppEventNamesEnum.checkIn, this.checkIn);
            this.listenTo(appEvents, AppEventNamesEnum.checkOut, this.checkOut);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckIn, this.updateCheckIn);

            this.listenTo(appEvents, AppEventNamesEnum.refreshOptions, this.refreshOptions);
            this.listenTo(appEvents, AppEventNamesEnum.refreshFilters, this.refreshFilters);

            this.listenTo(appEvents, AppEventNamesEnum.addItem, this.addItem);
            this.listenTo(appEvents, AppEventNamesEnum.updateItem, this.updateItem);

            this.listenTo(appEvents, AppEventNamesEnum.addExclusion, this.addExclusion);
            this.listenTo(appEvents, AppEventNamesEnum.deleteExclusion, this.deleteExclusion);

            this.listenTo(appEvents, AppEventNamesEnum.addLinkedStation, this.addLinkedStation);
            this.listenTo(appEvents, AppEventNamesEnum.clearLinkedStation, this.clearLinkedStation);
            this.listenTo(appEvents, AppEventNamesEnum.refreshLinkedStation, this.refreshLinkedStation);
            this.listenTo(appEvents, AppEventNamesEnum.refreshLinkedStationDetails, this.refreshLinkedStationDetails);
            this.listenTo(appEvents, AppEventNamesEnum.getToaStation, this.getToaStation);

            this.listenTo(appEvents, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
            this.listenTo(appEvents, AppEventNamesEnum.goToExportStationEntryLogList, this.goToExportStationEntryLogList);

            this.listenTo(appEvents, AppEventNamesEnum.addWarning, this.addStationWarning);
            this.listenTo(appEvents, AppEventNamesEnum.clearWarning, this.clearStationWarning);
            this.listenTo(appEvents, AppEventNamesEnum.updateWarning, this.updateStationWarning);

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
            var dolRegionCompleteCollection = new ListItemCollection();
            var dolRegionCollection = new ListItemCollection();
            var dolAreaCompleteCollection = new ListItemCollection();
            var dolAreaCollection = new ListItemCollection();
            var stationEntryLogListViewInstance = new StationEntryLogListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationEntryLogCollection,
                stationIdentifierCompleteCollection: stationIdentifierCompleteCollection,
                stationIdentifierCollection: stationIdentifierCollection,
                regionCompleteCollection: regionCompleteCollection,
                regionCollection: regionCollection,
                areaCompleteCollection: areaCompleteCollection,
                areaCollection: areaCollection,
                dolRregionCompleteCollection: dolRegionCompleteCollection,
                dolRegionCollection: dolRegionCollection,
                dolAreaCompleteCollection: dolAreaCompleteCollection,
                dolAreaCollection: dolAreaCollection
            });

            currentContext.router.swapContent(stationEntryLogListViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'stationEntryLog' || Backbone.history.fragment === '');
            currentContext.router.navigate('stationEntryLog', {replace: fragmentAlreadyMatches});

            stationEntryLogListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs({onlyOpen: true, showNoc: true, showDol: true})).done(function(getStationEntryLogsResponse) {
                var getStationEntryLogsData = getStationEntryLogsResponse;
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogsData.userRole);
                stationEntryLogListViewInstance.setUserRole(getStationEntryLogsData.userRole);
                stationEntryLogCollection.reset(getStationEntryLogsData.stationEntryLogs);

                if (options && options.stationEntryLog.isCheckOutAction) {
                    var userName = options.stationEntryLog.userName;
                    var stationName = options.stationEntryLog.stationName;
                    var checkOutSucessMessage = 'Successful check-out for ' + userName + ' at ' + stationName;
                    stationEntryLogListViewInstance.showSuccess(checkOutSucessMessage);
                } else if (options && options.stationEntryLog) {
                    var userName = options.stationEntryLog.userName;
                    var stationName = options.stationEntryLog.stationName;
                    var updateCheckInSucessMessage = 'Successful update of check-in for ' + userName + ' at ' + stationName;
                    stationEntryLogListViewInstance.showSuccess(updateCheckInSucessMessage);
                }
                deferred.resolve(stationEntryLogListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogCollection.reset();
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    stationEntryLogListViewInstance.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    stationEntryLogListViewInstance.showError(textStatus);
                }
                deferred.reject({
                    stationEntryLogListView: stationEntryLogListViewInstance,
                    error: textStatus
                });
            });

            $.when(currentContext.dashboardService.getFilters({showDol: true})).done(function(getFiltersResponse) {
                var getFiltersData = getFiltersResponse;
                stationIdentifierCompleteCollection.reset(getFiltersData.stationIdentifiers);
                stationIdentifierCollection.reset(getFiltersData.stationIdentifiers);
                regionCompleteCollection.reset(getFiltersData.regions);
                regionCollection.reset(getFiltersData.regions);
                areaCompleteCollection.reset(getFiltersData.areas);
                areaCollection.reset(getFiltersData.areas);
                dolRegionCompleteCollection.reset(getFiltersData.dolRegions);
                dolRegionCollection.reset(getFiltersData.dolRegions);
                dolAreaCompleteCollection.reset(getFiltersData.dolAreas);
                dolAreaCollection.reset(getFiltersData.dolAreas);
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
            var dolRegionCompleteCollection = new ListItemCollection();
            var dolRegionCollection = new ListItemCollection();
            var dolAreaCompleteCollection = new ListItemCollection();
            var dolAreaCollection = new ListItemCollection();
            var stationEntryLogHistoryListViewInstance = new StationEntryLogHistoryListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationEntryLogCollection,
                stationIdentifierCompleteCollection: stationIdentifierCompleteCollection,
                stationIdentifierCollection: stationIdentifierCollection,
                regionCompleteCollection: regionCompleteCollection,
                regionCollection: regionCollection,
                areaCompleteCollection: areaCompleteCollection,
                areaCollection: areaCollection,
                dolRregionCompleteCollection: dolRegionCompleteCollection,
                dolRegionCollection: dolRegionCollection,
                dolAreaCompleteCollection: dolAreaCompleteCollection,
                dolAreaCollection: dolAreaCollection
            });

            currentContext.router.swapContent(stationEntryLogHistoryListViewInstance);
            currentContext.router.navigate('stationEntryLogHistory');

            stationEntryLogHistoryListViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs({onlyCheckedOut: true, showNoc: true, showDol: true})).done(function(getStationEntryLogsResponse) {
                var getStationEntryLogsData = getStationEntryLogsResponse;
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogsData.userRole);
                stationEntryLogHistoryListViewInstance.setUserRole(getStationEntryLogsData.userRole);
                stationEntryLogCollection.reset(getStationEntryLogsData.stationEntryLogs);
                deferred.resolve(stationEntryLogHistoryListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogCollection.reset();
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    stationEntryLogHistoryListViewInstance.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    stationEntryLogHistoryListViewInstance.showError(textStatus);
                }
                deferred.reject({
                    stationEntryLogHistoryListView: stationEntryLogHistoryListViewInstance,
                    error: textStatus
                });
            });

            $.when(currentContext.dashboardService.getFilters({showDol: true})).done(function(getFiltersResponse) {
                var getFiltersData = getFiltersResponse;
                stationIdentifierCompleteCollection.reset(getFiltersData.stationIdentifiers);
                stationIdentifierCollection.reset(getFiltersData.stationIdentifiers);
                regionCompleteCollection.reset(getFiltersData.regions);
                regionCollection.reset(getFiltersData.regions);
                areaCompleteCollection.reset(getFiltersData.areas);
                areaCollection.reset(getFiltersData.areas);
                dolRegionCompleteCollection.reset(getFiltersData.dolRegions);
                dolRegionCollection.reset(getFiltersData.dolRegions);
                dolAreaCompleteCollection.reset(getFiltersData.dolAreas);
                dolAreaCollection.reset(getFiltersData.dolAreas);
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
                var getStationsData = getStationsResponse;
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationsData.userRole);
                stationListViewInstance.setUserRole(getStationsData.userRole);
                stationCollection.reset(getStationsData.stations);
                deferred.resolve(stationListViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationCollection.reset();
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    stationListViewInstance.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    stationListViewInstance.showError(textStatus);
                }
                deferred.reject({
                    stationListView: stationListViewInstance,
                    error: textStatus
                });
            });

            $.when(currentContext.dashboardService.getFilters({showDol: true})).done(function(getFiltersResponse) {
                var getFiltersData = getFiltersResponse;
                stationIdentifierCompleteCollection.reset(getFiltersData.stationIdentifiers);
                stationIdentifierCollection.reset(getFiltersData.stationIdentifiers);
                regionCompleteCollection.reset(getFiltersData.regions);
                regionCollection.reset(getFiltersData.regions);
                areaCompleteCollection.reset(getFiltersData.areas);
                areaCollection.reset(getFiltersData.areas);
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
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    personnelListViewInstance.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    personnelListViewInstance.showError(textStatus);
                }
                deferred.reject({
                    personnelListView: personnelListViewInstance,
                    error: textStatus
                });
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
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    purposeMaintenanceViewInstance.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    purposeMaintenanceViewInstance.showError(textStatus);
                }
                deferred.reject({
                    purposeMaintenanceView: purposeMaintenanceViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },
        goToMaintainExclusions: function() {
            console.trace('DashboardController.goToMaintainExclusions');
            var currentContext = this,
                    deferred = $.Deferred();

            var entryLogExclusionCollection = new EntryLogExclusionCollection();
            var exclusionMaintenanceViewInstance = new EditExclusionListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: entryLogExclusionCollection
            });

            currentContext.router.swapContent(exclusionMaintenanceViewInstance);
            currentContext.router.navigate('maintenance/exclusions');

            exclusionMaintenanceViewInstance.showLoading();
            $.when(currentContext.dashboardService.getEntryLogExclusions()).done(function(getEntryLogExclusionsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getEntryLogExclusionsResponse.userRole);
                exclusionMaintenanceViewInstance.setUserRole(getEntryLogExclusionsResponse.userRole);
                entryLogExclusionCollection.reset(getEntryLogExclusionsResponse.entryLogExclusions);
                deferred.resolve(exclusionMaintenanceViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                entryLogExclusionCollection.reset();
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    exclusionMaintenanceViewInstance.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    exclusionMaintenanceViewInstance.showError(textStatus);
                }

                deferred.reject({
                    exclusionMaintenanceView: exclusionMaintenanceViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },
        goToStationEntryLogWithId: function(stationEntryLogId, referringAppEvent, personnelViewOptions, selectedStationEntryLogOptions) {
            console.trace('DashboardController.goToStationEntryLogWithId');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationEntryLogModelInstance = new StationEntryLogModel({stationEntryLogId: stationEntryLogId, showNoc: true});
            var durationCollection = new LookupDataItemCollection();
            var stationEntryLogViewInstance = new StationEntryLogView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: stationEntryLogModelInstance,
                durationCollection: durationCollection,
                referringAppEvent: referringAppEvent,
                personnelViewOptions: personnelViewOptions,
                selectedStationEntryLogOptions: selectedStationEntryLogOptions
            });

            currentContext.router.swapContent(stationEntryLogViewInstance);
            currentContext.router.navigate('stationEntryLog/' + stationEntryLogId);

            stationEntryLogViewInstance.showLoading();
            $.when(currentContext.dashboardService.getStationEntryLogs(stationEntryLogModelInstance.attributes), currentContext.dashboardService.getOptions()).done(function(getStationEntryLogResults, getOptionsResults) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogResults[0].userRole);
                if (getStationEntryLogResults[0].stationEntryLogs && getStationEntryLogResults[0].stationEntryLogs.length > 0) {
                    stationEntryLogViewInstance.setUserRole(getStationEntryLogResults[0].userRole);
                    stationEntryLogModelInstance.set(getStationEntryLogResults[0].stationEntryLogs[0]);
                    if (typeof selectedStationEntryLogOptions !== 'undefined') {
                        if (selectedStationEntryLogOptions.isCheckOutAction) {
                            stationEntryLogViewInstance.setCheckOutAction(selectedStationEntryLogOptions.isCheckOutAction);
                        }
                        if (selectedStationEntryLogOptions.isViewOnlyAction) {
                            stationEntryLogViewInstance.setViewOnlyAction(selectedStationEntryLogOptions.isViewOnlyAction);
                        }
                    }
                    stationEntryLogViewInstance.setInitialFieldFocus();
                    durationCollection.reset(getOptionsResults[0].durations);
                    stationEntryLogViewInstance.trigger('loaded');
                    deferred.resolve(stationEntryLogViewInstance);
                } else {
                    stationEntryLogModelInstance.clear();
                    stationEntryLogViewInstance.showError('not found!');
                    deferred.reject({
                        stationEntryLogView: stationEntryLogViewInstance,
                        error: 'not found!'
                    });
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationEntryLogModelInstance.clear();
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    stationEntryLogViewInstance.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    stationEntryLogViewInstance.showError(textStatus);
                }
                deferred.reject({
                    stationEntryLogView: stationEntryLogViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },
        /**
         * 
         * @param {type} stationId
         * @returns {promise}
         * 
         * Logic for go to Foo with Id should do the following:
         * 1. new Deferred
         * 2. new Model with id
         * 3. new View with controller, dispatcher, model
         * 4. render the view
         * 5. update the router
         * 6. show the loading indicator
         * 7. get the model from the server
         * 8. update the user data from the service response
         * 9. update the model from the service response
         * 10. trigger the view.loaded event
         * 11. resolve the promise
         */
        goToStationWithId: function(stationId) {
            console.trace('DashboardController.goToStationWithId');
            var currentContext = this;
            var deferred = $.Deferred();

            var stationModel = new StationModel({stationId: stationId});
            var stationView = new StationView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: stationModel
            });

            currentContext.router.swapContent(stationView);
            currentContext.router.navigate('station/' + stationId);

            stationView.showLoading();
            $.when(currentContext.dashboardService.getStations({stationId: stationId})).done(function(getStationByIdResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationByIdResponse.userRole);
                if (getStationByIdResponse.stations && getStationByIdResponse.stations.length > 0) {
                    stationView.setUserRole(getStationByIdResponse.userRole);
                    stationView.setUserName(getStationByIdResponse.userName);
                    stationModel.set(getStationByIdResponse.stations[0]);
                    stationView.updateViewFromModel();
                    stationView.trigger('loaded');
                    deferred.resolve(stationView);
                } else {
                    stationView.showError('not found!');
                    deferred.reject({
                        stationView: stationView,
                        error: 'not found!'
                    });
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationModel.clear();
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    stationView.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    stationView.showError(textStatus);
                }
                deferred.reject({
                    stationView: stationView,
                    error: textStatus
                });
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
                if (jqXHR.status === 500) {
                    var guid = env.getNewGuid();
                    personnelViewInstance.addAlertBox(guid, 'alert', 'Critical Error: Please call the IT Service Desk.');
                } else {
                    personnelViewInstance.showError(textStatus);
                }
                personnelViewInstance.showError(textStatus);
                deferred.reject({
                    personnelView: personnelViewInstance,
                    error: textStatus
                });
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
        refreshOverridePersonnelList: function(personnelCollection, options) {
            console.trace('DashboardController.refreshOverridePersonnelList');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getOverridePersonnels(options)).done(function(getPersonnelsResponse) {
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
        refreshMaintainExclusions: function(entryLogExclusionCollection, options) {
            console.trace('DashboardController.refreshMaintainExclusions');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getEntryLogExclusions()).done(function(getEntryLogExclusionsResponse) {
                entryLogExclusionCollection.reset(getEntryLogExclusionsResponse.entryLogExclusions);
                deferred.resolve(getEntryLogExclusionsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                entryLogExclusionCollection.reset();
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
                if (jqXHR.status === 403 && jqXHR.responseJSON && jqXHR.responseJSON.hazardFlag) {
                    appEvents.trigger(AppEventNamesEnum.checkInFailedWithHazard, jqXHR.responseJSON);
                } else {
                    appEvents.trigger(AppEventNamesEnum.checkInError, errorMessage);
                }
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
                    if (jqXHR.responseJSON && jqXHR.responseJSON.hazardFlag) {
                        appEvents.trigger(AppEventNamesEnum.checkOutFailedWithHazard, jqXHR.responseJSON);
                    } else {
                        msg = 'You do not have permission to check-out this user.';
                    }
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
                    if (jqXHR.responseJSON && jqXHR.responseJSON.hazardFlag) {
                        appEvents.trigger(AppEventNamesEnum.updateCheckInFailedWithHazard, jqXHR.responseJSON);
                    } else {
                        msg = 'You do not have permission to check-out this user.';
                    }
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
        addExclusion: function(entryLogExclusionModel) {
            console.trace('DashboardController.addExclusion');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postAddEntryLogExclusion(entryLogExclusionModel.attributes)).done(function(postAddEntryLogExclusionResponse) {
                //set the id
                entryLogExclusionModel.trigger(AppEventNamesEnum.addExclusionSuccess, postAddEntryLogExclusionResponse.entryLogExclusion);
                deferred.resolve(postAddEntryLogExclusionResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                entryLogExclusionModel.trigger(AppEventNamesEnum.addExclusionError, 'error');
                deferred.reject('error');
            });

            return deferred.promise();
        },
        deleteExclusion: function(entryLogExclusionModel) {
            console.trace('DashboardController.deleteExclusion');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postDeleteEntryLogExclusion(entryLogExclusionModel.attributes)).done(function(postDeleteEntryLogExclusionResults) {
                entryLogExclusionModel.trigger(AppEventNamesEnum.deleteExclusionSuccess, postDeleteEntryLogExclusionResults.entryLogExclusion);
                deferred.resolve(postDeleteEntryLogExclusionResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                entryLogExclusionModel.trigger(AppEventNamesEnum.deleteExclusionError, 'error');
                deferred.reject('error');
            });

            return deferred.promise();
        },
        addLinkedStation: function(linkedStation) {
            console.trace('DashboardController.addLinkedStation');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postAddLinkedStation(linkedStation)).done(function(postAddLinkedStationResults) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.addLinkedStationSuccess, postAddLinkedStationResults.linkedStation);
                deferred.resolve(postAddLinkedStationResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.addLinkedStationError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },
        clearLinkedStation: function(linkedStation) {
            console.trace('DashboardController.clearLinkedStation');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postClearLinkedStation(linkedStation)).done(function(postClearLinkedStationResults) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.clearLinkedStationSuccess, postClearLinkedStationResults.linkedStation);
                deferred.resolve(postClearLinkedStationResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.clearLinkedStationError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },
        refreshLinkedStationDetails: function(newDolStationViewInstance, options) {
            console.trace('DashboardController.refreshLinkedStationDetails');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getLinkedStation(options)).done(function(getStationResponse) {
                newDolStationViewInstance.set(getStationResponse[0]);
                deferred.resolve(getStationResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                newDolStationViewInstance.clear();
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        getToaStation: function(options) {
            console.trace('DashboardController.getToaStation');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getLinkedStation(options)).done(function(getStationResponse) {
                var linkedStationData = getStationResponse.stations[0];
                appEvents.trigger(AppEventNamesEnum.getToaStationSuccess, linkedStationData);
                deferred.resolve(getStationResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                appEvents.trigger(AppEventNamesEnum.getToaStationError, errorThrown);
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToDirectionsWithLatLng: function(latitude, longitude, linkedLatitude, linkedLongitude) {
            console.trace('DashboardController.goToDirectionsWithLatLng');
            var directionsUri = '';
            if (linkedLatitude && linkedLongitude) {
                directionsUri = 'https://maps.google.com?t=k&saddr=' + latitude + ',' + longitude + '&daddr=' + linkedLatitude + ',' + linkedLongitude;
            } else {
                directionsUri = 'https://maps.google.com?t=k&q=loc:' + latitude + '+' + longitude;
            }
            globals.window.open(directionsUri);
        },
        goToExportStationEntryLogList: function(stationEntryLogCollection, options) {
            var csv = CSVExportTemplate({logArray: stationEntryLogCollection.models});
            var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
            var fileName = utils.getCSVFileName(options);
            saveAs(blob, fileName);
        },
        addStationWarning: function(stationWarningModel) {
            console.trace('DashboardController.addStationWarning');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postAddStationWarning(stationWarningModel.attributes)).done(function(postAddWarningResults) {
                stationWarningModel.set(postAddWarningResults.stationWarning);
                stationWarningModel.trigger(AppEventNamesEnum.addWarningSuccess, postAddWarningResults.stationWarning);
                deferred.resolve(postAddWarningResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningModel.trigger(AppEventNamesEnum.addWarningError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },
        updateStationWarning: function(stationWarningModel) {
            console.trace('DashboardController.updateStationWarning');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postUpdateStationWarning(stationWarningModel.attributes)).done(function(postUpdateWarningResults) {
                stationWarningModel.set(postUpdateWarningResults.stationWarning);
                stationWarningModel.trigger(AppEventNamesEnum.updateWarningSuccess, postUpdateWarningResults.stationWarning);
                deferred.resolve(postUpdateWarningResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningModel.trigger(AppEventNamesEnum.updateWarningError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },
        clearStationWarning: function(stationWarningModel) {
            console.trace('DashboardController.clearStationWarning');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.postClearStationWarning(stationWarningModel.attributes)).done(function(postClearWarningResults) {
                stationWarningModel.set(postClearWarningResults.stationWarning);
                stationWarningModel.trigger(AppEventNamesEnum.clearWarningSuccess, postClearWarningResults.stationWarning);
                deferred.resolve(postClearWarningResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningModel.trigger(AppEventNamesEnum.clearWarningError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },
        refreshStationWarningList: function(stationWarningCollection, options) {
            console.trace('DashboardController.refreshStationWarningList');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.dashboardService.getStationWarnings(options)).done(function(getStationWarningsResponse) {
                stationWarningCollection.reset(getStationWarningsResponse.stationWarnings);
                deferred.resolve(getStationWarningsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningCollection.trigger('error');
                deferred.reject(textStatus);
            });

            return deferred.promise();
        }
    });

    return DashboardController;
});