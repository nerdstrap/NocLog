define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            MockAppRouter = require('mocks/MockAppRouter'),
            mockAppEventsSingleton = require('mocks/mockAppEventsSingleton'),
            Squire = require('squire');

    var injector = new Squire();

    var builder = injector.mock({
        'events': mockAppEventsSingleton
    });

    describe('check in', function() {
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

        it('should trigger a success', function(done) {
            //arrange
            var stationEntryLogModel = {
                attributes: {}
            };
            var fakeDashboardServiceInstance = {};
            var fakeUserRole = UserRolesEnum.NocAdmin;
            fakeDashboardServiceInstance.postCheckIn = function() {
                var deferred = $.Deferred();
                var results = {
                    stationEntryLog: {},
                    userRole: fakeUserRole
                };
                setTimeout(function() {
                    deferred.resolve(results, 'success', null);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postCheckIn').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            //act
            var promise = self.dashboardControllerInstance.checkIn(stationEntryLogModel);

            promise.then(function(checkInResponse) {
                //assert
                expect(checkInResponse.stationEntryLog).toBeDefined();
                expect(self.dashboardControllerInstance.dashboardService.postCheckIn).toHaveBeenCalledWith(stationEntryLogModel.attributes);
                expect(mockAppEventsSingleton.trigger).toHaveBeenCalledWith(AppEventNamesEnum.checkInSuccess, checkInResponse.stationEntryLog);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.checkIn call failed'));
                done();
            });
        });

        it('should trigger the default error', function(done) {
            //arrange
            var stationEntryLogModel = {
                attributes: {}
            };
            var fakeDashboardServiceInstance = {};
            var jqXHR = {
                status: 400,
                responseText: 'fail'
            };
            var textStatus = '';
            var errorThrown = {};
            fakeDashboardServiceInstance.postCheckIn = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postCheckIn').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;
            var expectedErrorMessage = 'Error checking in.';

            //act
            var promise = self.dashboardControllerInstance.checkIn(stationEntryLogModel);

            promise.fail(function(errorMessage) {
                //assert
                expect(errorMessage).toEqual(expectedErrorMessage);
                expect(self.dashboardControllerInstance.dashboardService.postCheckIn).toHaveBeenCalledWith(stationEntryLogModel.attributes);
                expect(mockAppEventsSingleton.trigger).toHaveBeenCalledWith(AppEventNamesEnum.checkInError, expectedErrorMessage);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.checkIn call failed'));
                done();
            });
        });

        it('should trigger a conflict error', function(done) {
            //arrange
            var stationEntryLogModel = {
                attributes: {}
            };
            var fakeDashboardServiceInstance = {};
            var jqXHR = {
                status: 409,
                responseText: 'The user is already checked-in.'
            };
            var textStatus = 'The user is already checked-in.';
            var errorThrown = {};
            fakeDashboardServiceInstance.postCheckIn = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postCheckIn').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;
            var expectedErrorMessage = 'The user is already checked-in.';

            //act
            var promise = self.dashboardControllerInstance.checkIn(stationEntryLogModel);

            promise.fail(function(errorMessage) {
                //assert
                expect(errorMessage).toEqual(expectedErrorMessage);
                expect(self.dashboardControllerInstance.dashboardService.postCheckIn).toHaveBeenCalledWith(stationEntryLogModel.attributes);
                expect(mockAppEventsSingleton.trigger).toHaveBeenCalledWith(AppEventNamesEnum.checkInError, expectedErrorMessage);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.checkIn call failed'));
                done();
            });
        });

        it('should trigger a forbidden error', function(done) {
            //arrange
            var stationEntryLogModel = {
                attributes: {}
            };
            var fakeDashboardServiceInstance = {};
            var jqXHR = {
                status: 403,
                responseText: 'You do not have permission to check-in this user.'
            };
            var textStatus = 'You do not have permission to check-in this user.';
            var errorThrown = {};
            fakeDashboardServiceInstance.postCheckIn = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postCheckIn').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;
            var expectedErrorMessage = 'You do not have permission to check-in this user.';

            //act
            var promise = self.dashboardControllerInstance.checkIn(stationEntryLogModel);

            promise.fail(function(errorMessage) {
                //assert
                expect(errorMessage).toEqual(expectedErrorMessage);
                expect(self.dashboardControllerInstance.dashboardService.postCheckIn).toHaveBeenCalledWith(stationEntryLogModel.attributes);
                expect(mockAppEventsSingleton.trigger).toHaveBeenCalledWith(AppEventNamesEnum.checkInError, expectedErrorMessage);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.checkIn call failed'));
                done();
            });
        });
    });
});