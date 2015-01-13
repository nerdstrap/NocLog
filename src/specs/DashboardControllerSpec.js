define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationEntryLogListView = require('views/StationEntryLogListView'),
            DashboardController = require('controllers/DashboardController');

    describe('Dashboard Controller', function() {

        var fakeRouterInstance = new Backbone.Router();
        var fakeDashboardServiceInstance = {};
        var dashboardControllerInstance;
        var test = this;

        beforeEach(function() {
            Backbone.history.stop();

            fakeRouterInstance.navigate = function(fragment, options) {
                Backbone.history.fragment = fragment;
                this.trigger('after-navigate', fragment, options);
            };
            fakeRouterInstance.swapContent = function(newContentView) {
                newContentView.render();
            };

            spyOn(fakeRouterInstance, 'navigate').and.callThrough();
            spyOn(fakeRouterInstance, 'swapContent').and.callThrough();

            fakeDashboardServiceInstance.getStationEntryLogs = function() {
                return  {
                    stationEntryLogs: [],
                    stationIdentifiers: [],
                    regions: [],
                    areas: [],
                    userRole: ''
                };
            };

            spyOn(fakeDashboardServiceInstance, 'getStationEntryLogs').and.callThrough();

            dashboardControllerInstance = new DashboardController({
                router: fakeRouterInstance,
                dashboardService: fakeDashboardServiceInstance
            });

            Backbone.history.start();
        });

        it('should be defined', function() {
            expect(dashboardControllerInstance.router).toBeDefined();
            expect(dashboardControllerInstance.dispatcher).toBeDefined();
            expect(dashboardControllerInstance.dashboardService).toBeDefined();
            expect(dashboardControllerInstance._listeningTo).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToStationEntryLogList).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToStationEntryLogHistoryList).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToStationList).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToPersonnelList).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToMaintainPurposes).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToStationEntryLogWithId).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToStationWithId).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToPersonnel).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.refreshStationEntryLogList).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.refreshStationList).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.refreshPersonnelList).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.refreshMaintainPurposes).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.checkIn).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.checkOut).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.updateCheckIn).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.refreshOptions).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.refreshFilters).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.addItem).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.updateItem).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToDirectionsWithLatLng).toBeDefined();
            expect(dashboardControllerInstance._listeningTo.l1._events.goToExportStationEntryLogList).toBeDefined();
        });

        describe('goToStationEntryLogList', function() {

            it('should render the view', function(done) {
                //arrange

                //act
                var promise = dashboardControllerInstance.goToStationEntryLogList();

                promise.then(function(stationEntryLogListViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(stationEntryLogListViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('stationEntryLog', {replace: true});
                    expect(fakeDashboardServiceInstance.getStationEntryLogs).toHaveBeenCalledWith({onlyOpen: true});
                    expect(stationEntryLogListViewInstance.userRole).toBeDefined();
                    expect(stationEntryLogListViewInstance.collection).toBeDefined();
                    expect(stationEntryLogListViewInstance.stationIdentifierCollection).toBeDefined();
                    expect(stationEntryLogListViewInstance.regionCollection).toBeDefined();
                    expect(stationEntryLogListViewInstance.areaCollection).toBeDefined();
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToStationEntryLogList call failed"));
                    done();
                });
            });
        });
    });
});
