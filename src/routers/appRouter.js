define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            SwappingRouter = require('routers/SwappingRouter'),
            ShellView = require('views/ShellView'),
            DashboardController = require('controllers/DashboardController'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources');

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
            'stationEntryLog/:id': 'goToStationEntryLogWithId',
            'station/:id': 'goToStationWithId',
            'personnel/:id': 'goToPersonnelWithId'
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
        goToStationEntryLogWithId: function(stationEntryLogId) {
            console.trace('appRouter.goToStationEntryLogWithId');
            this.dashboardControllerInstance.goToStationWithId(stationEntryLogId);
        },
        goToStationWithId: function(stationId) {
            console.trace('appRouter.goToStationWithId');
            this.dashboardControllerInstance.goToStationWithId(stationId);
        },
        goToPersonnelWithId: function(personnelId) {
            console.trace('appRouter.goToPersonnelWithId');
            this.dashboardControllerInstance.goToPersonnelWithId(personnelId);
        },
        navigate: function(fragment, options) {
            SwappingRouter.prototype.navigate.call(this, fragment, options);
            this.trigger('after-navigate', fragment, options);
        }
    });

    var appRouter = new AppRouter();
    return appRouter;
});