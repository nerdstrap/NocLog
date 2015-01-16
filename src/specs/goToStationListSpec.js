define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            console = require('console'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            MockAppRouter = require('mocks/MockAppRouter'),
            MockStationCollection = require('mocks/MockStationCollection'),
            MockListItemCollection = require('mocks/MockListItemCollection'),
            MockStationListView = require('mocks/MockStationListView'),
            Squire = require('squire');

    var injector = new Squire();

    var builder = injector.mock({
        'console': console,
        'routers/AppRouter': MockAppRouter,
        'collections/StationCollection': MockStationCollection,
        'collections/ListItemCollection': MockListItemCollection,
        'views/StationListView': MockStationListView
    });

    describe('go to station list', function() {
        var self = this;

        beforeEach(function(done) {
            self.mockAppRouterInstance = new MockAppRouter();
            self.mockDispatcher = {};
            self.mockDispatcher.trigger = jasmine.createSpy();

            builder.require(['controllers/DashboardController'], function(DashboardController) {
                self.dashboardControllerInstance = new DashboardController({
                    router: self.mockAppRouterInstance,
                    dispatcher: self.mockDispatcher
                });
                done();
            }, function(err) {
                this.fail('require controllers/DashboardController failed to load!');
            });
        });

        it('should render the view', function(done) {
            //arrange
            var fakeDashboardServiceInstance = {};
            var fakeUserRole = UserRolesEnum.NocAdmin;
            fakeDashboardServiceInstance.getStations = function() {
                var deferred = $.Deferred();
                var results = {
                    stations: [],
                    stationIdentifiers: [],
                    regions: [],
                    areas: [],
                    userRole: fakeUserRole
                };
                setTimeout(function() {
                    deferred.resolve(results, 'success', null);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'getStations').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            //act
            var promise = self.dashboardControllerInstance.goToStationList();

            promise.then(function(stationListViewInstance) {
                //assert
                expect(stationListViewInstance.collection.setSortAttribute).toHaveBeenCalledWith('stationName');
                expect(self.dashboardControllerInstance.router.swapContent).toHaveBeenCalledWith(stationListViewInstance);
                expect(self.dashboardControllerInstance.router.navigate).toHaveBeenCalledWith('station');
                expect(stationListViewInstance.showLoading).toHaveBeenCalled();
                expect(self.dashboardControllerInstance.dashboardService.getStations).toHaveBeenCalledWith();
                expect(self.dashboardControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(stationListViewInstance.setUserRole).toHaveBeenCalledWith(fakeUserRole);
                expect(stationListViewInstance.collection.reset).toHaveBeenCalledWith([]);
                expect(stationListViewInstance.stationIdentifierCompleteCollection.reset).toHaveBeenCalledWith([]);
                expect(stationListViewInstance.stationIdentifierCollection.reset).toHaveBeenCalledWith([]);
                expect(stationListViewInstance.regionCompleteCollection.reset).toHaveBeenCalledWith([]);
                expect(stationListViewInstance.regionCollection.reset).toHaveBeenCalledWith([]);
                expect(stationListViewInstance.areaCompleteCollection.reset).toHaveBeenCalledWith([]);
                expect(stationListViewInstance.areaCollection.reset).toHaveBeenCalledWith([]);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToStationList call failed'));
                done();
            });
        });

        it('should show error', function(done) {
            //arrange
            var fakeDashboardServiceInstance = {};
            var jqXHR = {};
            var textStatus = 'fail';
            var errorThrown = {};
            fakeDashboardServiceInstance.getStations = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'getStations').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            //act
            var promise = self.dashboardControllerInstance.goToStationList();

            promise.fail(function(results) {
                //assert
                expect(results.stationListView).toBeDefined();
                expect(results.stationListView.showError).toHaveBeenCalledWith(textStatus);
                expect(results.stationListView.collection.reset).toHaveBeenCalled();
                expect(results.error).toEqual(textStatus);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToStationEntryLogHistoryList call failed'));
                done();
            });
        });

    });
});