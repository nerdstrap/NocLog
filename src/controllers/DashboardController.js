define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        DashboardView = require('views/DashboardView'),
        StationView = require('views/StationView'),
        StationEntryLogView = require('views/StationEntryLogView'),
        StationModel = require('models/StationModel'),
        StationEntryLogModel = require('models/StationEntryLogModel'),
        StationCollection = require('collections/StationCollection'),
        StationEntryLogCollection = require('collections/StationEntryLogCollection'),
        events = require('events');

    /**
     * Creates a new DashboardController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var DashboardController = function (options) {
        console.trace('new DashboardController()');
        this.initialize.apply(this, arguments);
    };

    _.extend(DashboardController.prototype, Backbone.Events, {
        /** @class DashboardController
         * @contructs DashboardController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('DashboardController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher || events;
            this.stationSearchResults = options.stationSearchResults || new StationCollection();
            this.stationEntryLogSearchResults = options.stationEntryLogSearchResults || new StationEntryLogCollection();

            this.listenTo(events, AppEventNamesEnum.goToDashboard, this.goToDashboard);
            this.listenTo(events, AppEventNamesEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(events, AppEventNamesEnum.goToPersonnelWithId, this.goToPersonnelWithId);
            this.listenTo(events, AppEventNamesEnum.goToStationEntryLogWithId, this.goToStationEntryLogWithId);
            
            this.listenTo(events, AppEventNamesEnum.showOpenStationEntryLogs, this.showOpenStationEntryLogs);
            this.listenTo(events, AppEventNamesEnum.showExpiredStationEntryLogs, this.showExpiredStationEntryLogs);
            this.listenTo(events, AppEventNamesEnum.showStationEntryLogs, this.showStationEntryLogs);
        },
        /** Shows the station search view 
         */
        goToDashboard: function () {
            console.trace('DashboardController.goToDashboard');
            var currentContext = this,
                    deferred = $.Deferred();

            var dashboardViewInstance = new DashboardView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: new Backbone.Model({id: 1}),
                stationSearchResults: currentContext.stationSearchResults,
                stationEntryLogSearchResults: currentContext.stationEntryLogSearchResults
            });

            currentContext.router.swapContent(dashboardViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'dashboard' || Backbone.history.fragment === '');
            currentContext.router.navigate('dashboard', { replace: fragmentAlreadyMatches });
            
            $.when(
                    currentContext.stationSearchResults.getStations(),
                    currentContext.stationEntryLogSearchResults.getStationEntryLogsByOpen()
            ).done(function(getStationSearchResults, getStationEntryLogSearchResults) {
                currentContext.stationSearchResults.reset(getStationSearchResults[0]);
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogSearchResults[0]);
                
                deferred.resolve(dashboardViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        
        goToStationWithId: function (stationId) {
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
            
            $.when(
                    stationModelInstance.getStationById(stationId)
            ).done(function(getStationResults) {
                stationModelInstance.set(getStationResults);
                
                currentContext.router.navigate('station/' + stationId);
                deferred.resolve(stationViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        goToPersonnelWithId: function (personnelId) {
            console.trace('DashboardController.goToPersonnelWithId');
//            var currentContext = this,
//                    deferred = $.Deferred();
//            
//            var stationModelInstance = new StationModel({stationId: stationId});
//
//            var stationViewInstance = new StationView({
//                controller: currentContext,
//                dispatcher: currentContext.dispatcher,
//                model: stationModelInstance
//            });
//
//            currentContext.router.swapContent(stationViewInstance);
//            
//            $.when(
//                    stationModelInstance.getStationById(stationId)
//            ).done(function(getStationResults) {
//                stationModelInstance.set(getStationResults);
//                
//                currentContext.router.navigate('station/' + stationId);
//                deferred.resolve(stationViewInstance);
//            }).fail(function(jqXHR, textStatus, errorThrown) {
//                deferred.reject(textStatus);
//            });
//
//            return deferred.promise();
        },
        goToStationEntryLogWithId: function (stationEntryLogId) {
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
            
            $.when(
                    stationEntryLogModelInstance.getStationEntryLogById(stationEntryLogId)
            ).done(function(getStationResults) {
                stationEntryLogModelInstance.set(getStationResults);
                
                currentContext.router.navigate('stationEntryLog/' + stationEntryLogId);
                deferred.resolve(stationEntryLogViewInstance);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });

            return deferred.promise();
        },
        
        showStationEntryLogs: function() {
            console.trace('DashboardController.showStationEntryLogs');
            var currentContext = this,
                    deferred = $.Deferred();
            
            $.when(
                    currentContext.stationEntryLogSearchResults.getStationEntryLogs()
            ).done(function(getStationEntryLogSearchResults) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogSearchResults);
                
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
            
            $.when(
                    currentContext.stationEntryLogSearchResults.getStationEntryLogsByOpen()
            ).done(function(getStationEntryLogSearchResults) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogSearchResults);
                
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
            
            $.when(
                    currentContext.stationEntryLogSearchResults.getStationEntryLogsByExpired()
            ).done(function(getStationEntryLogSearchResults) {
                currentContext.stationEntryLogSearchResults.reset(getStationEntryLogSearchResults);
                
                deferred.resolve(getStationEntryLogSearchResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(textStatus);
            });
            
            return deferred.promise();
        }
    });

    return DashboardController;
});