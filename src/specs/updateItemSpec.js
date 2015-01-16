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

    describe('update item', function() {
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
            var purposeModelModel = {
                attributes: {},
                trigger: jasmine.createSpy()
            };
            var fakeDashboardServiceInstance = {};
            var fakeUserRole = UserRolesEnum.NocAdmin;
            fakeDashboardServiceInstance.postUpdateItem = function() {
                var deferred = $.Deferred();
                var results = {
                    lookupDataItem: {},
                    userRole: fakeUserRole
                };
                setTimeout(function() {
                    deferred.resolve(results, 'success', null);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postUpdateItem').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;

            //act
            var promise = self.dashboardControllerInstance.updateItem(purposeModelModel);

            promise.then(function(postUpdateItemResults) {
                //assert
                expect(postUpdateItemResults.lookupDataItem).toBeDefined();
                expect(self.dashboardControllerInstance.dashboardService.postUpdateItem).toHaveBeenCalledWith(purposeModelModel.attributes);
                expect(purposeModelModel.trigger).toHaveBeenCalledWith(AppEventNamesEnum.updateItemSuccess, postUpdateItemResults.lookupDataItem);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.updateItem call failed'));
                done();
            });
        });

        it('should trigger the default error', function(done) {
            //arrange
            var purposeModelModel = {
                attributes: {},
                trigger: jasmine.createSpy()
            };
            var fakeDashboardServiceInstance = {};
            var jqXHR = {
                status: 400,
                responseText: 'error'
            };
            var textStatus = 'error';
            var errorThrown = {};
            fakeDashboardServiceInstance.postUpdateItem = function() {
                var deferred = $.Deferred();
                setTimeout(function() {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'postUpdateItem').and.callThrough();
            self.dashboardControllerInstance.dashboardService = fakeDashboardServiceInstance;
            var expectedErrorMessage = 'error';

            //act
            var promise = self.dashboardControllerInstance.updateItem(purposeModelModel);

            promise.fail(function(errorMessage) {
                //assert
                expect(errorMessage).toEqual(expectedErrorMessage);
                expect(self.dashboardControllerInstance.dashboardService.postUpdateItem).toHaveBeenCalledWith(purposeModelModel.attributes);
                expect(purposeModelModel.trigger).toHaveBeenCalledWith(AppEventNamesEnum.updateItemError, expectedErrorMessage);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.updateItem call failed'));
                done();
            });
        });

    });
});