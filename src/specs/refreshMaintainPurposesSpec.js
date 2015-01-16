define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            console = require('console'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            MockAppRouter = require('mocks/MockAppRouter'),
            MockPurposeCollection = require('mocks/MockPurposeCollection'),
            Squire = require('squire');

    var injector = new Squire();

    var builder = injector.mock({
        'console': console,
        'routers/AppRouter': MockAppRouter,
        'collections/PurposeCollection': MockPurposeCollection
    });

    describe('refresh maintain purposes', function() {
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

        it('should update the collection', function(done) {
            //arrange
            var fakeDashboardServiceInstance = {};
            var fakeUserRole = UserRolesEnum.NocAdmin;
            fakeDashboardServiceInstance.getOptions = function() {
                var deferred = $.Deferred();
                var results = {
                    stationIdentifiers: [],
                    purposes: [],
                    durations: [],
                    userRole: fakeUserRole
                };
                setTimeout(function() {
                    deferred.resolve(results, 'success', null);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'getOptions').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            var purposeCollection = {
                reset: jasmine.createSpy()
            };
            var options = {};

            //act
            var promise = self.dashboardControllerInstance.refreshMaintainPurposes(purposeCollection, options);

            promise.then(function(getOptionsResponse) {
                //assert
                expect(getOptionsResponse.purposes).toBeDefined();
                expect(self.dashboardControllerInstance.dashboardService.getOptions).toHaveBeenCalled();
                expect(purposeCollection.reset).toHaveBeenCalledWith([]);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToMaintainPurposes call failed'));
                done();
            });
        });

        it('should clear the collection', function(done) {
            //arrange
            var fakeDashboardServiceInstance = {};
            var jqXHR = {};
            var textStatus = 'fail';
            var errorThrown = {};
            fakeDashboardServiceInstance.getOptions = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'getOptions').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            var purposeCollection = {
                reset: jasmine.createSpy()
            };
            var options = {};
            
            //act
            var promise = self.dashboardControllerInstance.refreshMaintainPurposes(purposeCollection, options);

            promise.fail(function(errorMessage) {
                //assert
                expect(purposeCollection.reset).toHaveBeenCalled();
                expect(errorMessage).toEqual(textStatus);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToMaintainPurposes call failed'));
                done();
            });
        });

    });
});