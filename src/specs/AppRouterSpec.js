define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            AppRouter = require('routers/AppRouter');

//    var injector = new Squire();
//
//    var mockShellView = Backbone.View.extend({
//        contentViewEl: function() {
//        }
//    });
//
//    injector.mock({
//        'views/ShellView': mockShellView
//    });
//
//    injector.require(['routers/AppRouter'], function(AppRouter) {

    describe('App Router', function() {

        var appRouterInstance;
        var trigger = {trigger: true};

        beforeEach(function() {
            Backbone.history.stop();

            // create spies before creating a router instance
            spyOn(AppRouter.prototype, 'initialize');
            spyOn(AppRouter.prototype, 'goToStationEntryLogList');
            spyOn(AppRouter.prototype, 'goToStationList');
            spyOn(AppRouter.prototype, 'goToPersonnelList');
            spyOn(AppRouter.prototype, 'goToStationEntryLogHistoryList');
            spyOn(AppRouter.prototype, 'goToStationEntryLogWithId');
            spyOn(AppRouter.prototype, 'goToStationWithId');
            spyOn(AppRouter.prototype, 'goToPersonnelWithUserId');
            spyOn(AppRouter.prototype, 'goToPersonnelWithUserName');
            spyOn(AppRouter.prototype, 'goToMaintainPurposes');

            appRouterInstance = new AppRouter();

            Backbone.history.start();
        });

        afterEach(function() {
            appRouterInstance.navigate('/', trigger);
            Backbone.history.stop();
        });

        it('should be defined', function() {
            expect(appRouterInstance.routes).toBeDefined();
        });

        it('default route should be defined', function() {
            expect(appRouterInstance.routes['']).toBeDefined();
        });

        it('empty route routes to goToStationEntryLogList', function() {
            //arrange

            //act
            Backbone.history.navigate('', trigger);

            //assert
            expect(appRouterInstance.goToStationEntryLogList).toHaveBeenCalled();
        });

        it('/ routes to goToStationEntryLogList', function() {
            //arrange

            //act
            appRouterInstance.navigate('/', trigger);

            //assert
            expect(appRouterInstance.goToStationEntryLogList).toHaveBeenCalled();
        });

        it('/stationEntryLog routes to goToStationEntryLogList', function() {
            //arrange

            //act
            appRouterInstance.navigate('/stationEntryLog', trigger);

            //assert
            expect(appRouterInstance.goToStationEntryLogList).toHaveBeenCalled();
        });

        it('/station routes to goToStationList', function() {
            //arrange

            //act
            appRouterInstance.navigate('/station', trigger);

            //assert
            expect(appRouterInstance.goToStationList).toHaveBeenCalled();
        });

        it('/personnel routes to goToPersonnelList', function() {
            //arrange

            //act
            appRouterInstance.navigate('/personnel', trigger);

            //assert
            expect(appRouterInstance.goToPersonnelList).toHaveBeenCalled();
        });

        it('/stationEntryLogHistory routes to goToStationEntryLogHistoryList', function() {
            //arrange

            //act
            appRouterInstance.navigate('/stationEntryLogHistory', trigger);

            //assert
            expect(appRouterInstance.goToStationEntryLogHistoryList).toHaveBeenCalled();
        });

        it('/stationEntryLog/:id routes to goToStationEntryLogWithId', function() {
            //arrange
            var stationEntryLogId = '1';

            //act
            appRouterInstance.navigate('/stationEntryLog/' + stationEntryLogId, trigger);

            //assert
            expect(appRouterInstance.goToStationEntryLogWithId).toHaveBeenCalled();
            expect(appRouterInstance.goToStationEntryLogWithId).toHaveBeenCalledWith(stationEntryLogId, null);
        });
    });
});