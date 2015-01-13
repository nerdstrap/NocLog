define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            SwappingRouter = require('routers/SwappingRouter'),
            ShellView = require('views/ShellView'),
            DashboardController = require('controllers/DashboardController'),
            appEvents = require('events');

    var AppRouter = SwappingRouter.extend({
        initialize: function(options) {
            console.trace('appRouter.initialize');
            options || (options = {});
            var currentContext = this;

            var shellViewInstance = new ShellView({
                model: new Backbone.Model({id: 1}),
                el: $('body'),
                dispatcher: appEvents
            });
            shellViewInstance.render();
            this.contentViewEl = shellViewInstance.contentViewEl();

            this.dashboardControllerInstance = new DashboardController({
                router: currentContext
            });
        },
        routes: {
            '': 'goToStationEntryLogList',
            'stationEntryLog': 'goToStationEntryLogList',
            'station': 'goToStationList',
            'personnel': 'goToPersonnelList',
            'stationEntryLogHistory': 'goToStationEntryLogHistoryList',
            'stationEntryLog/:id': 'goToStationEntryLogWithId',
            'station/:id': 'goToStationWithId',
            'personnel/userId/:id': 'goToPersonnelWithUserId',
            'personnel/userName/:userName': 'goToPersonnelWithUserName',
            'maintenance': 'goToMaintainPurposes'
        },
        goToStationEntryLogList: function() {
            console.trace('appRouter.goToStationEntryLogList');
            this.dashboardControllerInstance.goToStationEntryLogList();
        },
        goToStationList: function() {
            console.trace('appRouter.goToStationList');
            this.dashboardControllerInstance.goToStationList();
        },
        goToPersonnelList: function() {
            console.trace('appRouter.goToPersonnelList');
            this.dashboardControllerInstance.goToPersonnelList();
        },
        goToStationEntryLogHistoryList: function() {
            console.trace('appRouter.goToStationEntryLogHistoryList');
            this.dashboardControllerInstance.goToStationEntryLogHistoryList();
        },
        goToStationEntryLogWithId: function(stationEntryLogId) {
            console.trace('appRouter.goToStationEntryLogWithId');
            this.dashboardControllerInstance.goToStationEntryLogWithId(stationEntryLogId);
        },
        goToStationWithId: function(stationId) {
            console.trace('appRouter.goToStationWithId');
            this.dashboardControllerInstance.goToStationWithId(stationId);
        },
        goToPersonnelWithUserId: function(userId) {
            console.trace('appRouter.goToPersonnelWithUserId');
            this.dashboardControllerInstance.goToPersonnel({userId: userId});
        },
        goToPersonnelWithUserName: function(userName) {
            console.trace('appRouter.goToPersonnelWithUserName');
            this.dashboardControllerInstance.goToPersonnel({userName: userName});
        },
        navigate: function(fragment, options) {
            SwappingRouter.prototype.navigate.call(this, fragment, options);
            this.trigger('after-navigate', fragment, options);
        },
        goToMaintainPurposes: function() {
            console.trace('appRouter.goToMaintainPurposes');
            this.dashboardControllerInstance.goToMaintainPurposes();
        }
    });

    return AppRouter;
});