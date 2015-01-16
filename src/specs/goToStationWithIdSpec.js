define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            MockAppRouter = require('mocks/MockAppRouter'),
            MockStationView = require('mocks/MockStationView'),
            MockStationModel = require('mocks/MockStationModel'),
            mockAppEventsSingleton = require('mocks/mockAppEventsSingleton'),
            Squire = require('squire');

    var injector = new Squire();

    var builder = injector.mock({
        'events': mockAppEventsSingleton,
        'routers/AppRouter': MockAppRouter,
        'models/StationModel': MockStationModel,
        'views/StationView': MockStationView
    });

    describe('go to station with id', function() {
        var self = this;

        beforeEach(function(done) {
            self.mockAppRouterInstance = new MockAppRouter();

            builder.require(['controllers/DashboardController'], function(DashboardController) {
                self.dashboardControllerInstance = new DashboardController({
                    router: self.mockAppRouterInstance
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
            var fakeStationId = 'THALI';
            var expectedStationModel = {stationId: 'THALI'};
            var fakeStationModel = {stationId: fakeStationId};
            fakeDashboardServiceInstance.getStations = function() {
                var deferred = $.Deferred();
                var results = {
                    stations: [expectedStationModel],
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
            var promise = self.dashboardControllerInstance.goToStationWithId(fakeStationId);

            promise.then(function(stationViewInstance) {
                //assert
                expect(self.dashboardControllerInstance.router.swapContent).toHaveBeenCalledWith(stationViewInstance);
                expect(self.dashboardControllerInstance.router.navigate).toHaveBeenCalledWith('station/' + fakeStationId);
                expect(stationViewInstance.showLoading).toHaveBeenCalled();
                expect(self.dashboardControllerInstance.dashboardService.getStations).toHaveBeenCalledWith(fakeStationModel);
                expect(self.dashboardControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(stationViewInstance.setUserRole).toHaveBeenCalledWith(fakeUserRole);
                expect(stationViewInstance.model.set).toHaveBeenCalledWith(expectedStationModel);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToStationList call failed'));
                done();
            });
        });

    });
});