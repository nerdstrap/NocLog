define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        SwappingRouter = require('routers/SwappingRouter'),
        ShellView = require('views/ShellView'),
        DashboardController = require('controllers/DashboardController');

    var AppRouter = SwappingRouter.extend({
        /** @class AppRouter
         * @contructs AppRouter object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('appRouter.initialize');
            options || (options = {});
            var currentContext = this;

            var shellViewInstance = new ShellView({
                el: $('body'),
                model: new Backbone.Model({id: 1})
            });
            shellViewInstance.render();
            this.contentViewEl = shellViewInstance.contentViewEl();

            this.dashboardControllerInstance = new DashboardController({
                router: currentContext
            });
        },
        /** Route fragment handler mappings
         */
        routes: {
            '': 'goToDashboard',
            'dashboard': 'goToDashboard',
            'station/:id': 'goToStationWithId',
            'stationEntryLog/:id': 'goToStationEntryLogWithId'
        },
        /** Navigates to the station search
         */
        goToDashboard: function () {
            console.trace('appRouter.goToDashboard');
            this.dashboardControllerInstance.goToDashboard();
        },
        /** Navigates to the station view
         * @param {string} stationId
         */
        goToStationWithId: function (stationId) {
            console.trace('appRouter.goToStationWithId');
            this.dashboardControllerInstance.goToStationWithId(stationId);
        },
        /** Navigates to the station entry log view
         * @param {string} stationEntryLogId
         */
        goToStationEntryLogWithId: function (stationEntryLogId) {
            console.trace('appRouter.goToStationEntryLogWithId');
            this.dashboardControllerInstance.goToStationWithId(stationEntryLogId);
        },
        /** Simple proxy to Backbone.history to save a fragment into the history
         * @param {object} fragment
         * @param {object} options
         */
        navigate: function (fragment, options) {
            SwappingRouter.prototype.navigate.call(this, fragment, options);
            this.trigger('after-navigate', fragment, options);
        }
    });

    var appRouter = new AppRouter();
    return appRouter;
});