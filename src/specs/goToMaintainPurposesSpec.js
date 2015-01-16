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
            MockLookupDataItemCollection = require('mocks/MockLookupDataItemCollection'),
            MockEditPurposeListView = require('mocks/MockEditPurposeListView'),
            Squire = require('squire');

    var injector = new Squire();

    var builder = injector.mock({
        'console': console,
        'routers/AppRouter': MockAppRouter,
        'collections/PurposeCollection': MockPurposeCollection,
        'collections/LookupDataItemCollection': MockLookupDataItemCollection,
        'views/EditPurposeListView': MockEditPurposeListView
    });

    describe('go to maintain purposes', function() {
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

            //act
            var promise = self.dashboardControllerInstance.goToMaintainPurposes();

            promise.then(function(purposeMaintenanceViewInstance) {
                //assert
                expect(self.dashboardControllerInstance.router.swapContent).toHaveBeenCalledWith(purposeMaintenanceViewInstance);
                expect(self.dashboardControllerInstance.router.navigate).toHaveBeenCalledWith('maintenance');
                expect(purposeMaintenanceViewInstance.showLoading).toHaveBeenCalled();
                expect(self.dashboardControllerInstance.dashboardService.getOptions).toHaveBeenCalled();
                expect(self.dashboardControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(purposeMaintenanceViewInstance.setUserRole).toHaveBeenCalledWith(fakeUserRole);
                expect(purposeMaintenanceViewInstance.collection.reset).toHaveBeenCalledWith([]);
                expect(purposeMaintenanceViewInstance.durationCollection.reset).toHaveBeenCalledWith([]);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToMaintainPurposes call failed'));
                done();
            });
        });
        
        it('should show error', function(done) {
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

            //act
            var promise = self.dashboardControllerInstance.goToMaintainPurposes();

            promise.fail(function(results) {
                //assert
                expect(results.purposeMaintenanceView).toBeDefined();
                expect(results.purposeMaintenanceView.showError).toHaveBeenCalledWith(textStatus);
                expect(results.purposeMaintenanceView.collection.reset).toHaveBeenCalled();
                expect(results.error).toEqual(textStatus);
                done();
            }, function() {
                this.fail(new Error('dashboardControllerInstance.goToMaintainPurposes call failed'));
                done();
            });
        });

    });
});