define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            MockAppRouter = require('mocks/MockAppRouter'),
            MockStationEntryLogCollection = require('mocks/MockStationEntryLogCollection'),
            MockStationEntryLogListView = require('mocks/MockStationEntryLogListView'),
            Squire = require('squire');

    var injector = new Squire();

    injector.mock({
        'routers/AppRouter': MockAppRouter,
        'collections/StationEntryLogCollection': MockStationEntryLogCollection,
        'views/StationEntryLogListView': MockStationEntryLogListView
    });

    injector.require(['controllers/DashboardController'], function(DashboardController) {

        describe('goToStationEntryLogList', function() {

            it('should render the view', function(done) {
                //arrange
                var mockAppRouterInstance = new MockAppRouter();

                var fakeDashboardServiceInstance = {};
                var fakeStationEntryLogs = [];
                var fakeStationIdentifiers = [];
                var fakeRegions = [];
                var fakeAreas = [];
                var fakeUserRole = UserRolesEnum.NocAdmin;
                fakeDashboardServiceInstance.getStationEntryLogs = function() {
                    var deferred = $.Deferred();
                    var results = {
                        stationEntryLogs: fakeStationEntryLogs,
                        stationIdentifiers: fakeStationIdentifiers,
                        regions: fakeRegions,
                        areas: fakeAreas,
                        userRole: fakeUserRole
                    };
                    setTimeout(function() {
                        deferred.resolve(results, 'success', null);
                    }, 200);
                    return deferred.promise();
                };
                spyOn(fakeDashboardServiceInstance, 'getStationEntryLogs').and.callThrough();

                var dashboardControllerInstance = new DashboardController({
                    router: mockAppRouterInstance,
                    dashboardService: fakeDashboardServiceInstance
                });
                spyOn(dashboardControllerInstance.dispatcher, 'trigger').and.callThrough();

                //act
                var promise = dashboardControllerInstance.goToStationEntryLogList();

                promise.then(function(stationEntryLogListViewInstance) {
                    //assert
                    expect(stationEntryLogListViewInstance.collection.setSortAttribute).toHaveBeenCalledWith('expectedOutTime');
                    expect(dashboardControllerInstance.router.swapContent).toHaveBeenCalledWith(stationEntryLogListViewInstance);
                    expect(dashboardControllerInstance.router.navigate).toHaveBeenCalledWith('stationEntryLog', jasmine.any(Object));
                    expect(stationEntryLogListViewInstance.showLoading).toHaveBeenCalled();
                    expect(dashboardControllerInstance.dashboardService.getStationEntryLogs).toHaveBeenCalledWith({onlyOpen: true});
                    expect(dashboardControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                    expect(stationEntryLogListViewInstance.setUserRole).toHaveBeenCalledWith(fakeUserRole);
                    expect(stationEntryLogListViewInstance.collection.reset).toHaveBeenCalledWith(fakeStationEntryLogs);
                    expect(stationEntryLogListViewInstance.stationIdentifierCollection.reset).toHaveBeenCalledWith(fakeStationIdentifiers);
                    expect(stationEntryLogListViewInstance.regionCollection.reset).toHaveBeenCalledWith(fakeRegions);
                    expect(stationEntryLogListViewInstance.areaCollection.reset).toHaveBeenCalledWith(fakeAreas);
                    done();
                }, function() {
                    this.fail(new Error('dashboardControllerInstance.goToStationEntryLogList call failed'));
                    done();
                });
            });

            it('should show success', function(done) {
                //arrange
                var mockAppRouterInstance = new MockAppRouter();

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

                var dashboardControllerInstance = new DashboardController({
                    router: mockAppRouterInstance,
                    dashboardService: fakeDashboardServiceInstance
                });
                spyOn(dashboardControllerInstance.dispatcher, 'trigger').and.callThrough();

                var userName = 'user name';
                var stationName = 'station name';
                var options = {
                    stationEntryLog: {
                        userName: userName,
                        stationName: stationName
                    }
                };
                var expectedUpdateCheckInSucessMessage = 'Successful update of check-in for ' + userName + ' at ' + stationName;

                //act
                var promise = dashboardControllerInstance.goToStationEntryLogList(options);

                promise.then(function(stationEntryLogListViewInstance) {
                    //assert
                    expect(stationEntryLogListViewInstance.collection.setSortAttribute).toHaveBeenCalledWith('expectedOutTime');
                    expect(dashboardControllerInstance.router.swapContent).toHaveBeenCalledWith(stationEntryLogListViewInstance);
                    expect(dashboardControllerInstance.router.navigate).toHaveBeenCalledWith('stationEntryLog', jasmine.any(Object));
                    expect(stationEntryLogListViewInstance.showLoading).toHaveBeenCalled();
                    expect(dashboardControllerInstance.dashboardService.getStationEntryLogs).toHaveBeenCalledWith({onlyOpen: true});
                    expect(dashboardControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                    expect(stationEntryLogListViewInstance.setUserRole).toHaveBeenCalledWith(fakeUserRole);
                    expect(stationEntryLogListViewInstance.collection.reset).toHaveBeenCalledWith([]);
                    expect(stationEntryLogListViewInstance.showSuccess).toHaveBeenCalledWith(expectedUpdateCheckInSucessMessage);
                    done();
                }, function() {
                    this.fail(new Error('dashboardControllerInstance.goToStationEntryLogList call failed'));
                    done();
                });
            });

            it('should show error', function(done) {
                //arrange
                var mockAppRouterInstance = new MockAppRouter();

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

                var dashboardControllerInstance = new DashboardController({
                    router: mockAppRouterInstance,
                    dashboardService: fakeDashboardServiceInstance
                });

                //act
                var promise = dashboardControllerInstance.goToStationEntryLogList();

                promise.fail(function(results) {
                    //assert
                    expect(results.stationEntryLogListView).toBeDefined();
                    expect(results.stationEntryLogListView.showError).toHaveBeenCalledWith(textStatus);
                    expect(results.stationEntryLogListView.collection.reset).toHaveBeenCalled();
                    expect(results.error).toEqual(textStatus);
                    done();
                }, function() {
                    this.fail(new Error('dashboardControllerInstance.goToStationEntryLogList call failed'));
                    done();
                });
            });
        });
    });
});