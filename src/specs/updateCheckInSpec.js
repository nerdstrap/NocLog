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

    describe('update check in', function() {
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

        it('trigger a success', function(done) {
            //arrange
            var stationEntryLogModel = {
                attributes: {},
                trigger: jasmine.createSpy()
            };
            var fakeDashboardServiceInstance = {};
            var fakeUserRole = UserRolesEnum.NocAdmin;
            fakeDashboardServiceInstance.postUpdateCheckIn = function() {
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
            spyOn(fakeDashboardServiceInstance, 'postUpdateCheckIn').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            //act
            var promise = self.dashboardControllerInstance.updateCheckIn(stationEntryLogModel);

            promise.then(function(updateCheckInResults) {
                //assert
                expect(self.dashboardControllerInstance.dashboardService.postUpdateCheckIn).toHaveBeenCalledWith(stationEntryLogModel.attributes);
                expect(updateCheckInResults.stationEntryLog).toBeDefined();
                expect(self.dashboardControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(mockAppEventsSingleton.trigger).toHaveBeenCalledWith(AppEventNamesEnum.updateCheckInSuccess, updateCheckInResults.stationEntryLog);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.updateCheckIn call failed'));
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
                responseText: 'Error updating entry.'
            };
            var textStatus = 'Error updating entry.';
            var errorThrown = {};
            fakeDashboardServiceInstance.postUpdateCheckIn = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postUpdateCheckIn').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;
            var expectedErrorMessage = 'Error updating entry.';

            //act
            var promise = self.dashboardControllerInstance.updateCheckIn(stationEntryLogModel);

            promise.fail(function(errorMessage) {
                //assert
                expect(errorMessage).toEqual(expectedErrorMessage);
                expect(self.dashboardControllerInstance.dashboardService.postUpdateCheckIn).toHaveBeenCalledWith(stationEntryLogModel.attributes);
                expect(mockAppEventsSingleton.trigger).toHaveBeenCalledWith(AppEventNamesEnum.updateCheckInError, expectedErrorMessage);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.updateCheckIn call failed'));
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
                responseText: 'The user is already checked-out.'
            };
            var textStatus = 'The user is already checked-out.';
            var errorThrown = {};
            fakeDashboardServiceInstance.postUpdateCheckIn = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postUpdateCheckIn').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;
            var expectedErrorMessage = 'The user is already checked-out.';

            //act
            var promise = self.dashboardControllerInstance.updateCheckIn(stationEntryLogModel);

            promise.fail(function(errorMessage) {
                //assert
                expect(errorMessage).toEqual(expectedErrorMessage);
                expect(self.dashboardControllerInstance.dashboardService.postUpdateCheckIn).toHaveBeenCalledWith(stationEntryLogModel.attributes);
                expect(mockAppEventsSingleton.trigger).toHaveBeenCalledWith(AppEventNamesEnum.updateCheckInError, expectedErrorMessage);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.updateCheckIn call failed'));
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
                responseText: 'You do not have permission to check-out this user.'
            };
            var textStatus = 'You do not have permission to check-out this user.';
            var errorThrown = {};
            fakeDashboardServiceInstance.postUpdateCheckIn = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postUpdateCheckIn').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;
            var expectedErrorMessage = 'You do not have permission to check-out this user.';

            //act
            var promise = self.dashboardControllerInstance.updateCheckIn(stationEntryLogModel);

            promise.fail(function(errorMessage) {
                //assert
                expect(errorMessage).toEqual(expectedErrorMessage);
                expect(self.dashboardControllerInstance.dashboardService.postUpdateCheckIn).toHaveBeenCalledWith(stationEntryLogModel.attributes);
                expect(mockAppEventsSingleton.trigger).toHaveBeenCalledWith(AppEventNamesEnum.updateCheckInError, expectedErrorMessage);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.updateCheckIn call failed'));
                done();
            });
        });

    });
});