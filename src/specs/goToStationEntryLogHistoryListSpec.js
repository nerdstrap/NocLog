define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            console = require('console'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            MockAppRouter = require('mocks/MockAppRouter'),
            MockStationEntryLogCollection = require('mocks/MockStationEntryLogCollection'),
            MockStationEntryLogListView = require('mocks/MockStationEntryLogListView'),
            Squire = require('squire');

    var injector = new Squire();

    var builder = injector.mock({
        'console': console,
        'routers/AppRouter': MockAppRouter,
        'collections/StationEntryLogCollection': MockStationEntryLogCollection,
        'views/StationEntryLogHistoryListView': MockStationEntryLogListView
    });

    describe('go to station entry log history list', function() {
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
            fakeDashboardServiceInstance.getStationEntryLogs = function() {
                var deferred = $.Deferred();
                var results = {
                    stationEntryLogs: [],
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
            spyOn(fakeDashboardServiceInstance, 'getStationEntryLogs').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            //act
            var promise = self.dashboardControllerInstance.goToStationEntryLogHistoryList();

            promise.then(function(stationEntryLogHistoryListViewInstance) {
                //assert
                expect(stationEntryLogHistoryListViewInstance.collection.setSortAttribute).toHaveBeenCalledWith('outTime');
                expect(self.dashboardControllerInstance.router.swapContent).toHaveBeenCalledWith(stationEntryLogHistoryListViewInstance);
                expect(self.dashboardControllerInstance.router.navigate).toHaveBeenCalledWith('stationEntryLogHistory');
                expect(stationEntryLogHistoryListViewInstance.showLoading).toHaveBeenCalled();
                expect(self.dashboardControllerInstance.dashboardService.getStationEntryLogs).toHaveBeenCalledWith({onlyCheckedOut: true});
                expect(self.dashboardControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(stationEntryLogHistoryListViewInstance.setUserRole).toHaveBeenCalledWith(fakeUserRole);
                expect(stationEntryLogHistoryListViewInstance.collection.reset).toHaveBeenCalledWith([]);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToStationEntryLogHistoryList call failed'));
                done();
            });
        });

        it('should show error', function(done) {
            //arrange
            var fakeDashboardServiceInstance = {};
            var jqXHR = {};
            var textStatus = 'fail';
            var errorThrown = {};
            fakeDashboardServiceInstance.getStationEntryLogs = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'getStationEntryLogs').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            //act
            var promise = self.dashboardControllerInstance.goToStationEntryLogHistoryList();

            promise.fail(function(results) {
                //assert
                expect(results.stationEntryLogHistoryListView).toBeDefined();
                expect(results.stationEntryLogHistoryListView.showError).toHaveBeenCalledWith(textStatus);
                expect(results.stationEntryLogHistoryListView.collection.reset).toHaveBeenCalled();
                expect(results.error).toEqual(textStatus);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToStationEntryLogHistoryList call failed'));
                done();
            });
        });
    });
});