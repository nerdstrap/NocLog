define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
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
            spyOn(fakeRouterInstance, 'navigate').and.callThrough();
            
            fakeRouterInstance.swapContent = function(newContentView) {
                newContentView.render();
            };
            spyOn(fakeRouterInstance, 'swapContent').and.callThrough();

            fakeDashboardServiceInstance.getStationEntryLogs = function() {
                var deferred = $.Deferred();
                var results = {
                    userRole: '',
                    stationEntryLogs: [
                        {"stationEntryLogId":380,"stationId":"ALLTN","stationType":"TC","dispatchCenterId":777,"userName":"Walden, Heather","firstName":"Heather","lastName":"Walden","middleName":"M","userId":"S253769","purpose":"Unloading Materials","additionalInfo":"testing additional info field expanded, tabbing order, etc,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,","inTime":1416959468287,"contactNumber":"6147161129","email":"hmwalden@aep.com","duration":330,"stationName":"Allentown POP (GPU)","stationPhone":"","latitude":"40.45666666","longitude":"-75.50472222","regionName":"Ohio","areaName":"Groveport","hasCrew":true},
                        {"stationEntryLogId":373,"stationId":"WALDR","stationType":"TC","dispatchCenterId":777,"userName":"Weedkiller, Tom","firstName":"Tom","lastName":"Weedkiller","companyName":"Weed Control","purpose":"Weed Control","additionalInfo":"Spraying for weeds.  Found huge weeds, will take longer ","inTime":1416421796893,"contactNumber":"1235559876","email":"t.weedkiller@weedcontrol.com","duration":480,"stationName":"Waldron TS","stationPhone":"501-637-4022","latitude":"34.89511111","longitude":"-94.09213888","regionName":"SWEPCO","areaName":"Texarkana","hasCrew":false},
                        {"stationEntryLogId":372,"stationId":"COLUS","stationType":"TC","dispatchCenterId":777,"userName":"Baltic, Michael","firstName":"Michael","lastName":"Baltic","userId":"s251201","purpose":"Antenna Maint","inTime":1416421667392,"contactNumber":"9-1-6147163718","duration":120,"stationName":"Columbus POP","stationPhone":"","latitude":"39.96500000","longitude":"-83.00555555","regionName":"Ohio","areaName":"Groveport","hasCrew":false},
                        {"stationEntryLogId":371,"stationId":"LAPLM","stationType":"TC","dispatchCenterId":777,"userName":"Canary, Richard","firstName":"Richard","lastName":"Canary","middleName":"W","userId":"s009864","purpose":"Unloading Materials","additionalInfo":"Just happen to be at the site","inTime":1416413065286,"contactNumber":"6147162300","email":"rwcanary@aep.com","duration":210,"stationName":"La Palma TS","stationPhone":"946-361-7320","latitude":"26-08--28.0","longitude":"097-38-26.0","regionName":"Texas","areaName":"Pharr","hasCrew":false},
                        {"stationEntryLogId":370,"stationId":"LAPLM","stationType":"TC","dispatchCenterId":777,"userName":"Smith, Bob","firstName":"Bob","lastName":"Smith","companyName":"Hired hand","purpose":"Building Maintenance","inTime":1416412992263,"contactNumber":"6145551232","email":"bobsmith@hiredhand.com","duration":180,"stationName":"La Palma TS","stationPhone":"946-361-7320","latitude":"26-08--28.0","longitude":"097-38-26.0","regionName":"Texas","areaName":"Pharr","hasCrew":false},
                        {"stationEntryLogId":366,"stationId":"BLDKN","stationType":"TC","dispatchCenterId":777,"userName":"Party, Inc, Third","firstName":"Third","lastName":"Party, Inc","middleName":"I","companyName":"third party, inc","purpose":"Unloading Materials","additionalInfo":"testing of new third party toggle","inTime":1416245185164,"contactNumber":"6141121122","email":"tparty@what.c","duration":60,"stationName":"Bald Knob TS","stationPhone":"","latitude":"32.02486111","longitude":"-99.80313888","regionName":"Texas","areaName":"Abilene","hasCrew":false}
                    ],
                    stationIdentifiers: [],
                    regions: [],
                    areas: []
                };
                setTimeout(function() {
                    deferred.resolve(results, "success", null);
                }, 200);
                return deferred.promise();
            };            
            spyOn(fakeDashboardServiceInstance, 'getStationEntryLogs').and.callThrough();

            fakeDashboardServiceInstance.getStations = function() {
                return  {
                    userRole: '',
                    stations: [
                        {"stationId":"THALI","complexName":"txthaliats","stationName":"Thalia TS","owningOrganization":"","benefittingOrganization":"119","contactId":"CN=S Craig McCarty/O=AEPIN","contactPhone":"780-7113","contactSecurityPhone":"","regionName":"Texas","areaName":"Abilene","telecomNpa":"","telecomNxx":"","siteType":"Telecom Site","latitude":"34-01-06.0 N","longitude":"099-32-58.0 W","landOwner":"","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"","policeDepartmentPhone":"","servingElectricUtility":"South west Rural Electric in Vernon TX 1-800-","servingUtilityTelephone":"","acCircuitFeeder":"Account# 11758101 - Meter# 20253","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"","contactAudinet":"","address1":"FM 262","city":"Thalia","state":"TX","postalCode":"79227","country":"US","county":"Foard","contactAddress1":"FM 262","contactCity":"Thalia","contactState":"TX","contactPostalCode":"79227","topFloor":"0","form":"Location","equipment":"Microwave;Owned Tower;Generator","notes":"","faaReportable":"No","faaRegion":"","towerNumber":"ASR Not Required","nearestAirport":"","directions":"2.1 miles north of Thalia/HWY 70, at the corner of FM 262 and County dirt road 292","leasedCircuits":"103970","lastSyncDate":1417030330965,"disabled":"N"}
                    ],
                    stationIdentifiers: [],
                    regions: [],
                    areas: []
                };
            };
            spyOn(fakeDashboardServiceInstance, 'getStations').and.callThrough();

            fakeDashboardServiceInstance.getOptions = function() {
                var deferred = $.Deferred();
                var results = {
                    userRole: '',
                    durations: [],
                    purposes: []
                };
                setTimeout(function() {
                    deferred.resolve(results, "success", null);
                }, 200);
                return deferred.promise();
            };
            spyOn(fakeDashboardServiceInstance, 'getOptions').and.callThrough();

            fakeDashboardServiceInstance.getPersonnels = function() {
                return  {
                    userRole: '',
                    personnels: [
                        {"userId":"S251201","contactNumber":"6147163718","email":"mebaltic@aep.com","userName":"Baltic, Michael"}
                    ]
                };
            };
            spyOn(fakeDashboardServiceInstance, 'getPersonnels').and.callThrough();

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
                    expect(stationEntryLogListViewInstance.stationIdentifierCompleteCollection).toBeDefined();
                    expect(stationEntryLogListViewInstance.stationIdentifierCollection).toBeDefined();
                    expect(stationEntryLogListViewInstance.regionCompleteCollection).toBeDefined();
                    expect(stationEntryLogListViewInstance.regionCollection).toBeDefined();
                    expect(stationEntryLogListViewInstance.areaCompleteCollection).toBeDefined();
                    expect(stationEntryLogListViewInstance.areaCollection).toBeDefined();
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToStationEntryLogList call failed"));
                    done();
                });
            });
        });  
        
        describe('goToStationEntryLogHistoryList', function() {

            it('should render the view', function(done) {
                //arrange

                //act
                var promise = dashboardControllerInstance.goToStationEntryLogHistoryList();

                promise.then(function(stationEntryLogHistoryListViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(stationEntryLogHistoryListViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('stationEntryLogHistory');
                    expect(fakeDashboardServiceInstance.getStationEntryLogs).toHaveBeenCalledWith({onlyCheckedOut: true});
                    
                    expect(stationEntryLogHistoryListViewInstance.userRole).toBeDefined();
                    expect(stationEntryLogHistoryListViewInstance.collection).toBeDefined();
                    expect(stationEntryLogHistoryListViewInstance.stationIdentifierCompleteCollection).toBeDefined();
                    expect(stationEntryLogHistoryListViewInstance.stationIdentifierCollection).toBeDefined();
                    expect(stationEntryLogHistoryListViewInstance.regionCompleteCollection).toBeDefined();
                    expect(stationEntryLogHistoryListViewInstance.regionCollection).toBeDefined();
                    expect(stationEntryLogHistoryListViewInstance.areaCompleteCollection).toBeDefined();
                    expect(stationEntryLogHistoryListViewInstance.areaCollection).toBeDefined();
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToStationEntryLogHistoryList call failed"));
                    done();
                });
            });
        });
        
        describe('goToStationList', function() {

            it('should render the view', function(done) {
                //arrange

                //act
                var promise = dashboardControllerInstance.goToStationList();

                promise.then(function(stationListViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(stationListViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('station');
                    
                    expect(stationListViewInstance.userRole).toBeDefined();
                    expect(stationListViewInstance.collection).toBeDefined();
                    expect(stationListViewInstance.stationIdentifierCompleteCollection).toBeDefined();
                    expect(stationListViewInstance.stationIdentifierCollection).toBeDefined();
                    expect(stationListViewInstance.regionCompleteCollection).toBeDefined();
                    expect(stationListViewInstance.regionCollection).toBeDefined();
                    expect(stationListViewInstance.areaCompleteCollection).toBeDefined();
                    expect(stationListViewInstance.areaCollection).toBeDefined();
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToStationList call failed"));
                    done();
                });
            });
        });
        
        describe('goToPersonnelList', function() {

            it('should render the view', function(done) {
                //arrange

                //act
                var promise = dashboardControllerInstance.goToPersonnelList();

                promise.then(function(personnelListViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(personnelListViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('personnel');
                    
                    expect(personnelListViewInstance.userRole).toBeDefined();
                    expect(personnelListViewInstance.collection).toBeDefined();
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToPersonnelList call failed"));
                    done();
                });
            });
        });
        
        describe('goToMaintainPurposes', function() {

            it('should render the view', function(done) {
                //arrange

                //act
                var promise = dashboardControllerInstance.goToMaintainPurposes();

                promise.then(function(purposeMaintenanceViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(purposeMaintenanceViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('maintenance');
                    
                    expect(purposeMaintenanceViewInstance.userRole).toBeDefined();
                    expect(purposeMaintenanceViewInstance.durationCollection).toBeDefined();
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToMaintainPurposes call failed"));
                    done();
                });
            });
        });
        
        describe('goToStationEntryLogWithId', function() {

            it('should render the view', function(done) {
                //arrange
                var stationEntryLogId = 380;

                //act
                var promise = dashboardControllerInstance.goToStationEntryLogWithId(stationEntryLogId);

                promise.then(function(stationEntryLogViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(stationEntryLogViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('stationEntryLog/' + stationEntryLogId);
                    
                    expect(stationEntryLogViewInstance.userRole).toBeDefined();
                    expect(stationEntryLogViewInstance.model.attributes.stationEntryLogId).toEqual(stationEntryLogId);
                    expect(stationEntryLogViewInstance.durationCollection).toBeDefined();
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToStationEntryLogWithId call failed"));
                    done();
                });
            });
        });
        
        describe('goToStationWithId', function() {

            it('should render the view', function(done) {
                //arrange
                var stationId = 'THALI';

                //act
                var promise = dashboardControllerInstance.goToStationWithId(stationId);

                promise.then(function(stationViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(stationViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('station/' + stationId);
                    
                    expect(stationViewInstance.userRole).toBeDefined();
                    expect(stationViewInstance.model.id).toEqual(stationId);
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToStationWithId call failed"));
                    done();
                });
            });
        });
        
        describe('goToPersonnel with userId', function() {

            it('should render the view', function(done) {
                //arrange
                var userId = 'S251201';

                //act
                var promise = dashboardControllerInstance.goToPersonnel({userId: userId});

                promise.then(function(personnelViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(personnelViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('personnel/userId/' + userId);
                    
                    expect(personnelViewInstance.userRole).toBeDefined();
                    expect(personnelViewInstance.model.id).toEqual(userId);
                    expect(personnelViewInstance.model.attributes.contactNumber).toEqual('6147163718');
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToPersonnel call failed"));
                    done();
                });
            });
        });
        
        describe('goToPersonnel with userName', function() {

            it('should render the view', function(done) {
                //arrange
                var userName = 'Baltic, Michael';

                //act
                var promise = dashboardControllerInstance.goToPersonnel({userName: userName});

                promise.then(function(personnelViewInstance) {
                    //assert
                    expect(fakeRouterInstance.swapContent).toHaveBeenCalledWith(personnelViewInstance);
                    expect(fakeRouterInstance.navigate).toHaveBeenCalledWith('personnel/userName/' + userName);
                    
                    expect(personnelViewInstance.userRole).toBeDefined();
                    expect(personnelViewInstance.model.attributes.contactNumber).toEqual('6147163718');
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.goToPersonnel call failed"));
                    done();
                });
            });
        });   
        
        describe('refreshStationEntryLogList', function() {

            it('should render the view', function(done) {
                //arrange
                var options = {onlyOpen: true};
                var stationEntryLogCollection = new Backbone.Collection();
                spyOn(stationEntryLogCollection, 'reset');
                
                //act
                var promise = dashboardControllerInstance.refreshStationEntryLogList(stationEntryLogCollection, options);

                promise.then(function(getStationEntryLogsResponse) {
                    //assert
                    expect(fakeDashboardServiceInstance.getStationEntryLogs).toHaveBeenCalledWith(options);
                    expect(stationEntryLogCollection.reset).toHaveBeenCalledWith(getStationEntryLogsResponse.stationEntryLogs);
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.refreshStationEntryLogList call failed"));
                    done();
                });
            });
        });     
        
        describe('refreshStationList', function() {

            it('should render the view', function(done) {
                //arrange
                var options = ({regionName: '', areaName: '', stationId: ''});
                var stationCollection = new Backbone.Collection();
                spyOn(stationCollection, 'reset');
                
                //act
                var promise = dashboardControllerInstance.refreshStationList(stationCollection, options);

                promise.then(function(getStationsResponse) {
                    //assert
                    expect(fakeDashboardServiceInstance.getStations).toHaveBeenCalledWith(options);
                    expect(stationCollection.reset).toHaveBeenCalledWith(getStationsResponse.stations);
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.refreshStationList call failed"));
                    done();
                });
            });
        });        
        
        describe('refreshPersonnelList', function() {

            it('should render the view', function(done) {
                //arrange
                var options = ({userName: 'mi'});
                var personnelCollection = new Backbone.Collection();
                spyOn(personnelCollection, 'reset');
                
                //act
                var promise = dashboardControllerInstance.refreshPersonnelList(personnelCollection, options);

                promise.then(function(getPersonnelsResponse) {
                    //assert
                    expect(fakeDashboardServiceInstance.getPersonnels).toHaveBeenCalledWith(options);
                    expect(personnelCollection.reset).toHaveBeenCalledWith(getPersonnelsResponse.personnels);
                    done();
                }, function() {
                    test.fail(new Error("dashboardControllerInstance.refreshPersonnelList call failed"));
                    done();
                });
            });
        });
        
    });
});
