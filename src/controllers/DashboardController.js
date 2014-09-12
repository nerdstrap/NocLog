define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationEntryLogListView = require('views/StationEntryLogListView'),
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
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources');

    /**
     * Creates a new DashboardController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var DashboardController = function(options) {
        console.trace('new DashboardController()');
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
            this.stationEntryLogSearchResults = options.stationEntryLogSearchResults || new StationEntryLogCollection();
            this.stationSearchResults = options.stationSearchResults || new StationCollection();
            this.personnelSearchResults = options.personnelSearchResults || new PersonnelCollection();
            this.regionResults = options.regionCollection || new Backbone.Collection();
            this.areaResults = options.areaCollection || new Backbone.Collection();

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogList, this.goToStationEntryLogList);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationList, this.goToStationList);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnelList, this.goToPersonnelList);

            this.listenTo(appEvents, AppEventNamesEnum.goToStationEntryLogWithId, this.goToStationEntryLogWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(appEvents, AppEventNamesEnum.goToPersonnelWithId, this.goToPersonnelWithId);

            this.listenTo(appEvents, AppEventNamesEnum.showOpenStationEntryLogs, this.showOpenStationEntryLogs);
            this.listenTo(appEvents, AppEventNamesEnum.showExpiredStationEntryLogs, this.showExpiredStationEntryLogs);
            this.listenTo(appEvents, AppEventNamesEnum.showStationEntryLogs, this.showStationEntryLogs);
        },
        goToStationEntryLogList: function() {
            console.trace('DashboardController.goToStationEntryLogList');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationEntryLogListViewInstance = new StationEntryLogListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationEntryLogSearchResults,
                regionCollection: currentContext.regionResults,
                areaCollection: currentContext.areaResults
            });

            currentContext.router.swapContent(stationEntryLogListViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'stationEntryLog' || Backbone.history.fragment === '');
            currentContext.router.navigate('stationEntryLog', {replace: fragmentAlreadyMatches});

            $.when(currentContext.stationEntryLogSearchResults.getStationEntryLogsByOpen()).done(function(getStationEntryLogSearchResults) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogSearchResults.stationEntryLogs);
                currentContext.regionResults.reset(getStationEntryLogSearchResults.regions);
                currentContext.areaResults.reset(getStationEntryLogSearchResults.areas);
                deferred.resolve(stationEntryLogListViewInstance);
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

            var stationListViewInstance = new StationListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationSearchResults
            });

            currentContext.router.swapContent(stationListViewInstance);
            currentContext.router.navigate('station');

            $.when(currentContext.stationSearchResults.getStations()).done(function(getStationSearchResults) {
                currentContext.stationSearchResults.reset(getStationSearchResults);
                deferred.resolve(stationListViewInstance);
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

            $.when(currentContext.personnelSearchResults.getPersonnel()).done(function(getPersonnelSearchResults) {
                currentContext.personnelSearchResults.reset(getPersonnelSearchResults);
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
                model: stationEntryLogModelInstance
            });

            currentContext.router.swapContent(stationEntryLogViewInstance);
            currentContext.router.navigate('stationEntryLog/' + stationEntryLogId);

            $.when(stationEntryLogModelInstance.getStationEntryLogById(stationEntryLogId)).done(function(getStationResults) {
                stationEntryLogModelInstance.set(getStationResults);
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

            $.when(stationModelInstance.getStationById(stationId)).done(function(getStationResults) {
                stationModelInstance.set(getStationResults);
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

            $.when(personnelModelInstance.getPersonnelById(personnelId)).done(function(getPersonnelResults) {
                personnelModelInstance.set(getPersonnelResults);
                deferred.resolve(personnelViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        showStationEntryLogs: function() {
            console.trace('DashboardController.showStationEntryLogs');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.stationEntryLogSearchResults.getStationEntryLogs()).done(function(getStationEntryLogSearchResults) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogSearchResults.stationEntryLogs);
                currentContext.regionResults.reset(getStationEntryLogSearchResults.regions);
                currentContext.areaResults.reset(getStationEntryLogSearchResults.areas);
                deferred.resolve(getStationEntryLogSearchResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        showOpenStationEntryLogs: function() {
            console.trace('DashboardController.showOpenStationEntryLogs');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.stationEntryLogSearchResults.getStationEntryLogsByOpen()).done(function(getStationEntryLogSearchResults) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogSearchResults.stationEntryLogs);
                currentContext.regionResults.reset(getStationEntryLogSearchResults.regions);
                currentContext.areaResults.reset(getStationEntryLogSearchResults.areas);
                deferred.resolve(getStationEntryLogSearchResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        showExpiredStationEntryLogs: function() {
            console.trace('DashboardController.showExpiredStationEntryLogs');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.stationEntryLogSearchResults.getStationEntryLogsByExpired()).done(function(getStationEntryLogSearchResults) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogSearchResults.stationEntryLogs);
                currentContext.regionResults.reset(getStationEntryLogSearchResults.regions);
                currentContext.areaResults.reset(getStationEntryLogSearchResults.areas);
                deferred.resolve(getStationEntryLogSearchResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        }
    });

    return DashboardController;
});