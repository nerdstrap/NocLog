define(function(require) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        env = require("env");

    var inMemoryStations = [
	{"stationId":"THALI","complexName":"txthaliats","stationName":"Thalia TS","owningOrganization":"","benefittingOrganization":"119","contactId":"CN=S Craig McCarty/O=AEPIN","contactPhone":"780-7113","contactSecurityPhone":"","regionName":"Texas","areaName":"Abilene","telecomNpa":"","telecomNxx":"","siteType":"Telecom Site","latitude":"34-01-06.0 N","longitude":"099-32-58.0 W","landOwner":"","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"","policeDepartmentPhone":"","servingElectricUtility":"South west Rural Electric in Vernon TX 1-800-","servingUtilityTelephone":"","acCircuitFeeder":"Account# 11758101 - Meter# 20253","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"","contactAudinet":"","address1":"FM 262","city":"Thalia","state":"TX","postalCode":"79227","country":"US","county":"Foard","contactAddress1":"FM 262","contactCity":"Thalia","contactState":"TX","contactPostalCode":"79227","topFloor":"0","form":"Location","equipment":"Microwave;Owned Tower;Generator","notes":"","faaReportable":"No","faaRegion":"","towerNumber":"ASR Not Required","nearestAirport":"","directions":"2.1 miles north of Thalia/HWY 70, at the corner of FM 262 and County dirt road 292","leasedCircuits":"103970","lastSyncDate":1417030330965,"disabled":"N"},
	{"stationId":"MCHUB","complexName":"txmccameyhub","stationName":"McCamey Hub","owningOrganization":"","benefittingOrganization":"119","contactId":"CN=S Craig McCarty/O=AEPIN","contactPhone":"780-7113","contactSecurityPhone":"","regionName":"Texas","areaName":"Abilene","telecomNpa":"432","telecomNxx":"652","siteType":"Telecom Site","latitude":"","longitude":"","landOwner":"","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"","policeDepartmentPhone":"","servingElectricUtility":"","servingUtilityTelephone":"","acCircuitFeeder":"","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"","contactAudinet":"","address1":"518 McKinney Ave.","city":"McCamey","state":"TX","postalCode":"79752","country":"US","county":"","contactAddress1":"518 McKinney Ave.","contactCity":"McCamey","contactState":"TX","contactPostalCode":"79752","topFloor":"0","form":"Location","equipment":"","notes":"","faaReportable":"No","faaRegion":"","towerNumber":"","nearestAirport":"","directions":"McCamey Hub =>  521 W. McKinney, McCamey TX\n\nNot sure which is the correct address for McCamey Hub.","leasedCircuits":"31FDPA000037SW;33FDPA405289;33FDPA450211;35HCGS609228SW;35HCGS805564SW;35LGGS803070SW;35LGGS803071SW;35LGGS803079SW;35LNGS604792SW;35LNGS607526SW;36FDPA450210;36FDPA450212;36FDPA450212SW;36FDPA450213;36FDPA450214;4326523043;4326523043DSL;4326523836;MGBH5JSX0001;MGBHPTWW0001;MGBJX9NF0001","lastSyncDate":1417030287349,"disabled":"N"},
	{"stationId":"HUGOW","complexName":"okhugowfects","stationName":"Western Farmers Hugo TS","owningOrganization":"Public Service Company of Oklahoma","benefittingOrganization":"167","contactId":"CN=Rodney L Turner/O=AEPIN","contactPhone":"704-4232","contactSecurityPhone":"","regionName":"PSO","areaName":"Lawton","telecomNpa":"","telecomNxx":"","siteType":"Telecom Site","latitude":"34.00705555","longitude":"-95.46663888","landOwner":"Chocktaw Electric Coop","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"","policeDepartmentPhone":"","servingElectricUtility":"","servingUtilityTelephone":"","acCircuitFeeder":"","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"","contactAudinet":"","address1":"SR 93","city":"Hugo","state":"OK","postalCode":"74743","country":"US","county":"Choctaw","contactAddress1":"SR 93","contactCity":"Hugo","contactState":"OK","contactPostalCode":"74743","topFloor":"0","form":"Location","equipment":"Microwave","notes":"","faaReportable":"No","faaRegion":"","towerNumber":"1222628","nearestAirport":"HHQ - Stan Stamper Muni","directions":"From Jct US70 & SR93, 0.67 Miles North of SR93., 783 ft on access road","leasedCircuits":"","lastSyncDate":1417030342092,"disabled":"N"},
	{"stationId":"ROSSI","complexName":"ohrossimcts","stationName":"Ross IMC","owningOrganization":"Ohio Power Company","benefittingOrganization":"250","contactId":"CN=David R Leunissen/OU=OR2/O=AEPIN","contactPhone":"966-4444","contactSecurityPhone":"","regionName":"Ohio","areaName":"Southern Ohio","telecomNpa":"","telecomNxx":"","siteType":"Telecom Site","latitude":"","longitude":"","landOwner":"","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"","policeDepartmentPhone":"","servingElectricUtility":"","servingUtilityTelephone":"","acCircuitFeeder":"","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"","contactAudinet":"960-7182","address1":"701 Hardin Dr.","city":"Chillicothe","state":"OH","postalCode":"45601","country":"US","county":"Ross","contactAddress1":"701 Hardin Dr.","contactCity":"Chillicothe","contactState":"OH","contactPostalCode":"45601","topFloor":"0","form":"Location","equipment":"Radio;Lightwave;Router;PBX","notes":"","faaReportable":"No","faaRegion":"","towerNumber":"","nearestAirport":"","directions":"(From S Paint Street) - Start out going NORTH on S PAINT ST/OH-772 toward S MARKET ST.  Turn RIGHT onto E MAIN ST/US-50/OH-104. Continue to follow E MAIN ST/US-50.  Turn LEFT onto N WATT ST. Turn RIGHT onto HARDIN DR.  End at 701 Hardin Dr.","leasedCircuits":"2005374;MDBG32HN0001","lastSyncDate":1417030318324,"disabled":"N"},
	{"stationId":"FOREM","complexName":"arforemants","stationName":"Foreman TS","owningOrganization":"Southwestern Electric Power Company","benefittingOrganization":"159","contactId":"CN=Barbara M Martin/OU=CA1/O=AEPIN","contactPhone":"748-5769","contactSecurityPhone":"","regionName":"SWEPCO","areaName":"Texarkana","telecomNpa":"","telecomNxx":"","siteType":"Telecom Site","latitude":"33-44-36.4 N","longitude":"094-19-55.2 W","landOwner":"SEP","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"","policeDepartmentPhone":"","servingElectricUtility":"Southwest Arkansas Electric","servingUtilityTelephone":"800-782-2743 or","acCircuitFeeder":"account# 12815200","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"No Telco Equipment inside Tower Site.","telephone":"","contactAudinet":"","address1":"Hwy 108","city":"Foreman","state":"AR","postalCode":"71836","country":"US","county":"Little River","contactAddress1":"Hwy 108","contactCity":"Foreman","contactState":"AR","contactPostalCode":"71836","topFloor":"0","form":"Location","equipment":"800 Trunked Repeater;Microwave;Owned Tower;Generator","notes":"","faaReportable":"Yes","faaRegion":"Arkansas","towerNumber":"1255925","nearestAirport":"KDEQ - J Lynn Helms Sevier County Airport","directions":"I-30 to Hwy 8.  Go north on Hwy 8  (Hwy 8 becomes Hwy 41 on Arkansas side).  Continue on Hwy 41 north to Hwy 108, turn right and follow about 4 miles.  Site is located on the right side and is next to a lot with a mobile home.","leasedCircuits":"21485","lastSyncDate":1417030254358,"disabled":"N"},
	{"stationId":"WELLN","complexName":"txwellingtonts","stationName":"Wellington TS","owningOrganization":"AEP Texas North Company","benefittingOrganization":"119","contactId":"CN=S Craig McCarty/O=AEPIN","contactPhone":"780-7113","contactSecurityPhone":"","regionName":"Texas","areaName":"Abilene","telecomNpa":"806","telecomNxx":"447","siteType":"Telecom Site","latitude":"34.77555555","longitude":"-100.19444444","landOwner":"","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"","policeDepartmentPhone":"","servingElectricUtility":"Greenbelt Electric Meter # 94338967","servingUtilityTelephone":"800-527-3082","acCircuitFeeder":"","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"325-674-7786","contactAudinet":"780-7786","address1":"3321 US HWY 83","city":"Wellington","state":"TX","postalCode":"79095","country":"US","county":"Collingsworth","contactAddress1":"701 N 4th St","contactCity":"Abilene","contactState":"TX","contactPostalCode":"79601","topFloor":"0","form":"Location","equipment":"Microwave;Spread Spectrum;Leased Tower;Batteries;Generator","notes":"Communications Site","faaReportable":"No","faaRegion":"Texas","towerNumber":"1050986","nearestAirport":"F06 - Marian Airpark Airport","directions":"","leasedCircuits":"12LGGS201280GTEC;36LGGS201329GTSW;36LGGS201329GTSWV;94338967","lastSyncDate":1417030340641,"disabled":"N"},
	{"stationId":"CALTS","complexName":"okcalvints","stationName":"Calvin TS","owningOrganization":"Public Service Company of Oklahoma","benefittingOrganization":"167","contactId":"CN=Rodney L Turner/O=AEPIN","contactPhone":"704-4232","contactSecurityPhone":"","regionName":"PSO","areaName":"Lawton","telecomNpa":"","telecomNxx":"","siteType":"Telecom Site","latitude":"34.92516666","longitude":"-96.25572222","landOwner":"Public Service Company","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"","policeDepartmentPhone":"","servingElectricUtility":"People's Electric Cooperative","servingUtilityTelephone":"580-332-3031","acCircuitFeeder":"","transformerPole":"PEC-65665","servingTelephoneCompany":"","demarcationLocation":"","telephone":"","contactAudinet":"","address1":"UNKNOWN","city":"Calvin","state":"OK","postalCode":"74531","country":"US","county":"Hughes","contactAddress1":"","contactCity":"Calvin","contactState":"OK","contactPostalCode":"74531","topFloor":"0","form":"Location","equipment":"800 Trunked Repeater;Owned Tower;Generator","notes":"PEC electric meter number 27103","faaReportable":"Yes","faaRegion":"Oklahoma","towerNumber":"1244407","nearestAirport":"F99 - Holdenville Municipal Airport","directions":"","leasedCircuits":"","lastSyncDate":1417030230202,"disabled":"N"},
	{"stationId":"BKNBO","complexName":"okbrokenbowts","stationName":"Broken Bow MW TS","owningOrganization":"Public Service Company of Oklahoma","benefittingOrganization":"167","contactId":"CN=Rodney L Turner/O=AEPIN","contactPhone":"704-4232","contactSecurityPhone":"","regionName":"PSO","areaName":"Lawton","telecomNpa":"","telecomNxx":"","siteType":"Telecom Site","latitude":"34.00427777","longitude":"-94.73602777","landOwner":"","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"Emergency  Mcurtaib County Sherriff","policeDepartmentPhone":"405-286-3331","servingElectricUtility":"","servingUtilityTelephone":"","acCircuitFeeder":"","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"718-7924","contactAudinet":"718-7924","address1":"110 East 3rd Street","city":"Broken Bow","state":"OK","postalCode":"74728","country":"US","county":"McCurtain","contactAddress1":"Street address unknown","contactCity":"Broken Bow","contactState":"OK","contactPostalCode":"74728","topFloor":"0","form":"Location","equipment":"Spread Spectrum;Owned Tower","notes":"Communications Site","faaReportable":"No","faaRegion":"","towerNumber":"ASR Not Required","nearestAirport":"","directions":"","leasedCircuits":"","lastSyncDate":1417030227581,"disabled":"N"},
	{"stationId":"GROV","complexName":"okgrovelmrts","stationName":"Grove LMR TS","owningOrganization":"Public Service Company of Oklahoma","benefittingOrganization":"167","contactId":"CN=Lionel E Kemp/O=AEPIN","contactPhone":"700-4910","contactSecurityPhone":"","regionName":"PSO","areaName":"Tulsa","telecomNpa":"","telecomNxx":"","siteType":"Telecom Site","latitude":"36.66525000","longitude":"-94.83441666","landOwner":"","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"","medicalEmergencyDepartmentPhone":"","fireDepartment":"","fireDepartmentPhone":"","policeDepartment":"Delaware  County Sheriff","policeDepartmentPhone":"918-253-4531","servingElectricUtility":"PSO  (last 4 digits of meter is 5107)","servingUtilityTelephone":"","acCircuitFeeder":"","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"918-669-3715","contactAudinet":"918-669-","address1":"3.75 miles North of Grove","city":"Grove","state":"OK","postalCode":"74344","country":"US","county":"","contactAddress1":"Street address unknown","contactCity":"Grove","contactState":"OK","contactPostalCode":"74344","topFloor":"0","form":"Location","equipment":"800 Trunked Repeater;Microwave;Leased Tower;Generator","notes":"Communications Site","faaReportable":"No","faaRegion":"","towerNumber":"1031781","nearestAirport":"79F - Teramiranda Airport","directions":"3.75 miles North of Grove, 4.5 miles East of Junction of US 59 and OK 125.","leasedCircuits":"","lastSyncDate":1417030261519,"disabled":"N"},
	{"stationId":"CCMCI","complexName":"txcorpuschristimcipop","stationName":"Corpus Christi-MCI POP","owningOrganization":"AEP Texas Central Company","benefittingOrganization":"211","contactId":"Ryan Cummings/AEPIN","contactPhone":"430-5831","contactSecurityPhone":"","regionName":"Texas","areaName":"Corpus Christi","telecomNpa":"361","telecomNxx":"289","siteType":"POP","latitude":"","longitude":"","landOwner":"","siteAccessMethod":"","fuelProvider":"","medicalEmergencyDepartment":"361-881-3811","medicalEmergencyDepartmentPhone":"361-881-3000","fireDepartment":"361-880-3900","fireDepartmentPhone":"361-880-3932","policeDepartment":"361-886-2600","policeDepartmentPhone":"361-886-2615","servingElectricUtility":"","servingUtilityTelephone":"","acCircuitFeeder":"","transformerPole":"","servingTelephoneCompany":"","demarcationLocation":"","telephone":"","contactAudinet":"","address1":"606 N Carancahua","city":"Corpus Christi","state":"TX","postalCode":"78403","country":"US","county":"Nueces","contactAddress1":"606 N Carancahua","contactCity":"Corpus Christi","contactState":"TX","contactPostalCode":"78403","topFloor":"0","form":"Location","equipment":"","notes":"Telco POP","faaReportable":"No","faaRegion":"","towerNumber":"","nearestAirport":"","directions":"","leasedCircuits":"8002744138;8002852296;8006806845;8007117956003;8008762520003;8664966061;8773167949;8773552666MCI;8773734858;8882183923002;IBBCDL7B0001;MGBHV3TS0001;MGBHVYW30001","lastSyncDate":1417030241705,"disabled":"N"}
	];

    var inMemoryStationEntryLogs = [
	{"stationEntryLogId":380,"stationId":"ALLTN","stationType":"TC","dispatchCenterId":777,"userName":"Walden, Heather","firstName":"Heather","lastName":"Walden","middleName":"M","userId":"S253769","purpose":"Unloading Materials","additionalInfo":"testing additional info field expanded, tabbing order, etc,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,","inTime":1416959468287,"contactNumber":"6147161129","email":"hmwalden@aep.com","duration":330,"stationName":"Allentown POP (GPU)","stationPhone":"","latitude":"40.45666666","longitude":"-75.50472222","regionName":"Ohio","areaName":"Groveport","hasCrew":true},
	{"stationEntryLogId":373,"stationId":"WALDR","stationType":"TC","dispatchCenterId":777,"userName":"Weedkiller, Tom","firstName":"Tom","lastName":"Weedkiller","companyName":"Weed Control","purpose":"Weed Control","additionalInfo":"Spraying for weeds.  Found huge weeds, will take longer ","inTime":1416421796893,"contactNumber":"1235559876","email":"t.weedkiller@weedcontrol.com","duration":480,"stationName":"Waldron TS","stationPhone":"501-637-4022","latitude":"34.89511111","longitude":"-94.09213888","regionName":"SWEPCO","areaName":"Texarkana","hasCrew":false},
	{"stationEntryLogId":372,"stationId":"COLUS","stationType":"TC","dispatchCenterId":777,"userName":"Baltic, Michael","firstName":"Michael","lastName":"Baltic","userId":"s251201","purpose":"Antenna Maint","inTime":1416421667392,"contactNumber":"9-1-6147163718","duration":120,"stationName":"Columbus POP","stationPhone":"","latitude":"39.96500000","longitude":"-83.00555555","regionName":"Ohio","areaName":"Groveport","hasCrew":false},
	{"stationEntryLogId":371,"stationId":"LAPLM","stationType":"TC","dispatchCenterId":777,"userName":"Canary, Richard","firstName":"Richard","lastName":"Canary","middleName":"W","userId":"s009864","purpose":"Unloading Materials","additionalInfo":"Just happen to be at the site","inTime":1416413065286,"contactNumber":"6147162300","email":"rwcanary@aep.com","duration":210,"stationName":"La Palma TS","stationPhone":"946-361-7320","latitude":"26-08--28.0","longitude":"097-38-26.0","regionName":"Texas","areaName":"Pharr","hasCrew":false},
	{"stationEntryLogId":370,"stationId":"LAPLM","stationType":"TC","dispatchCenterId":777,"userName":"Smith, Bob","firstName":"Bob","lastName":"Smith","companyName":"Hired hand","purpose":"Building Maintenance","inTime":1416412992263,"contactNumber":"6145551232","email":"bobsmith@hiredhand.com","duration":180,"stationName":"La Palma TS","stationPhone":"946-361-7320","latitude":"26-08--28.0","longitude":"097-38-26.0","regionName":"Texas","areaName":"Pharr","hasCrew":false},
	{"stationEntryLogId":366,"stationId":"BLDKN","stationType":"TC","dispatchCenterId":777,"userName":"Party, Inc, Third","firstName":"Third","lastName":"Party, Inc","middleName":"I","companyName":"third party, inc","purpose":"Unloading Materials","additionalInfo":"testing of new third party toggle","inTime":1416245185164,"contactNumber":"6141121122","email":"tparty@what.c","duration":60,"stationName":"Bald Knob TS","stationPhone":"","latitude":"32.02486111","longitude":"-99.80313888","regionName":"Texas","areaName":"Abilene","hasCrew":false}];

    var inMemoryStationEntryLog = {"stationEntryLogId":381,"stationId":"ANTWP","stationType":"TC","dispatchCenterId":777,"userName":"Shu, Shujing","firstName":"Shujing","lastName":"Shu","userId":"s210749","purpose":"Tower Beacon Inspection","inTime":1417015756655,"contactNumber":"6147163015","email":"sshu@aep.com","duration":90,"stationName":"Antwerp TS","stationPhone":"","latitude":"41-14-07.8 N","longitude":"084-40-45.5 W","regionName":"IM","areaName":"Fort Wayne","hasCrew":true};
    
    var inMemoryLookupDataItems = [];
    
    var inMemoryLookupDataItem = {};
    
    var inMemoryPersonnels = [
	{"contactNumber":"196145551212","userName":"smith, bob","companyName":"amce"},
	{"contactNumber":"6141234567","email":"JWS@amce.com","userName":"Smith, John","companyName":"AMCE weed control"},
	{"contactNumber":"1234567890","email":"fdmiller@ford.com","userName":"Miller, Fred","companyName":"Ford"},
	{"contactNumber":"7404501486","email":"ssmith@ford.com","userName":"Smith, Sam","companyName":"Ford"},
	{"contactNumber":"910987654321","email":"bmijones@amce.com","userName":"Smith, Bobby","companyName":"ACME Toolset"},
	{"contactNumber":"6145551232","email":"bobsmith@hiredhand.com","userName":"Smith, Bob","companyName":"Hired hand"},
	{"userId":"S251201","contactNumber":"6147163718","email":"mebaltic@aep.com","userName":"Baltic, Michael"},
	{"userId":"S253769","contactNumber":"6147161129","userName":"Smith, Martha"},
	{"contactNumber":"6145551212","userName":"what, milka","companyName":"milkawhat"}];
    
    var inMemoryPurposes = [
	{"itemId":1,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Antenna Maintenance","itemText":"Antenna Maintenance","itemDescription":"Antenna Maintenance","itemAdditionalData":"240","itemEnabled":false,"itemOrder":0},
	{"itemId":2,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Battery Inspection","itemText":"Battery Inspection","itemDescription":"Battery Inspection","itemAdditionalData":"120","itemEnabled":true,"itemOrder":1},
	{"itemId":3,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Battery Maintenance","itemText":"Battery Maintenance","itemDescription":"Battery Maintenance","itemAdditionalData":"180","itemEnabled":true,"itemOrder":2},
	{"itemId":4,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Building Maintenance","itemText":"Building Maintenance","itemDescription":"Building Maintenance","itemAdditionalData":"240","itemEnabled":true,"itemOrder":3},
	{"itemId":5,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Charger/AC Maintenance","itemText":"Charger/AC Maintenance","itemDescription":"Charger/AC Maintenance","itemAdditionalData":"180","itemEnabled":true,"itemOrder":4},
	{"itemId":6,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Construction","itemText":"Construction","itemDescription":"Construction","itemAdditionalData":"480","itemEnabled":true,"itemOrder":5},
	{"itemId":7,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Generator Inspection","itemText":"Generator Inspection","itemDescription":"Generator Inspection","itemAdditionalData":"120","itemEnabled":false,"itemOrder":6},
	{"itemId":8,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Generator Maintenance","itemText":"Generator Maintenance","itemDescription":"Generator Maintenance","itemAdditionalData":"180","itemEnabled":true,"itemOrder":7},
	{"itemId":9,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"HVAC Maintenance","itemText":"HVAC Maintenance","itemDescription":"HVAC Maintenance","itemAdditionalData":"180","itemEnabled":true,"itemOrder":8},
	{"itemId":10,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Investigate Alarms","itemText":"Investigate Alarms","itemDescription":"Investigate Alarms","itemAdditionalData":"120","itemEnabled":true,"itemOrder":9},
	{"itemId":11,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Other","itemText":"Other","itemDescription":"Other","itemAdditionalData":"120","itemEnabled":true,"itemOrder":10},
	{"itemId":12,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Radio Inspection","itemText":"Radio Inspection","itemDescription":"Radio Inspection","itemAdditionalData":"360","itemEnabled":true,"itemOrder":11},
	{"itemId":13,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Radio Maintenance","itemText":"Radio Maintenance","itemDescription":"Radio Maintenance","itemAdditionalData":"240","itemEnabled":true,"itemOrder":12},
	{"itemId":14,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Site Inspection","itemText":"Site Inspection","itemDescription":"Site Inspection","itemAdditionalData":"60","itemEnabled":true,"itemOrder":13},
	{"itemId":15,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Site Maintenance","itemText":"Site Maintenance","itemDescription":"Site Maintenance","itemAdditionalData":"180","itemEnabled":true,"itemOrder":14},
	{"itemId":16,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Site Meeting","itemText":"Site Meeting","itemDescription":"Site Meeting","itemAdditionalData":"240","itemEnabled":true,"itemOrder":15},
	{"itemId":17,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Tower Beacon Inspection","itemText":"Tower Beacon Inspection","itemDescription":"Tower Beacon Inspection","itemAdditionalData":"60","itemEnabled":true,"itemOrder":16},
	{"itemId":18,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Tower Climb Inspection","itemText":"Tower Climb Inspection","itemDescription":"Tower Climb Inspection","itemAdditionalData":"300","itemEnabled":true,"itemOrder":17},
	{"itemId":19,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Transport Inspection","itemText":"Transport Inspection","itemDescription":"Transport Inspection","itemAdditionalData":"240","itemEnabled":true,"itemOrder":18},
	{"itemId":20,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Transport Maintenance","itemText":"Transport Maintenance","itemDescription":"Transport Maintenance","itemAdditionalData":"240","itemEnabled":true,"itemOrder":19},
	{"itemId":21,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Unloading Materials","itemText":"Unloading Materials","itemDescription":"Unloading Materials","itemAdditionalData":"60","itemEnabled":true,"itemOrder":20},
	{"itemId":22,"itemType":"STATION_ENTRY_PURPOSE","itemValue":"Weed Control","itemText":"Weed Control","itemDescription":"Weed Control","itemAdditionalData":"180","itemEnabled":true,"itemOrder":21}];
    var inMemoryDurations = [
	{"itemId":23,"itemType":"STATION_ENTRY_DURATION","itemValue":"30","itemText":"30 Minutes","itemEnabled":true,"itemOrder":0},
	{"itemId":24,"itemType":"STATION_ENTRY_DURATION","itemValue":"60","itemText":"1 Hour","itemEnabled":false,"itemOrder":1},
	{"itemId":25,"itemType":"STATION_ENTRY_DURATION","itemValue":"90","itemText":"1.5 Hours","itemEnabled":true,"itemOrder":2},
	{"itemId":26,"itemType":"STATION_ENTRY_DURATION","itemValue":"120","itemText":"2 Hours","itemEnabled":true,"itemOrder":3},
	{"itemId":27,"itemType":"STATION_ENTRY_DURATION","itemValue":"150","itemText":"2.5 Hours","itemEnabled":true,"itemOrder":4},
	{"itemId":28,"itemType":"STATION_ENTRY_DURATION","itemValue":"180","itemText":"3 Hours","itemEnabled":true,"itemOrder":5},
	{"itemId":29,"itemType":"STATION_ENTRY_DURATION","itemValue":"210","itemText":"3.5 Hours","itemEnabled":true,"itemOrder":6},
	{"itemId":30,"itemType":"STATION_ENTRY_DURATION","itemValue":"240","itemText":"4 Hours","itemEnabled":true,"itemOrder":7},
	{"itemId":31,"itemType":"STATION_ENTRY_DURATION","itemValue":"300","itemText":"5 Hours","itemEnabled":true,"itemOrder":8},
	{"itemId":32,"itemType":"STATION_ENTRY_DURATION","itemValue":"360","itemText":"6 Hours","itemEnabled":true,"itemOrder":9},
	{"itemId":33,"itemType":"STATION_ENTRY_DURATION","itemValue":"420","itemText":"7 Hours","itemEnabled":true,"itemOrder":10},
	{"itemId":34,"itemType":"STATION_ENTRY_DURATION","itemValue":"480","itemText":"8 Hours","itemEnabled":true,"itemOrder":11}];

    var inMemoryStationIdentifiers = [
	{ "stationId": "AEPHS", "stationName": "AEP Headquarters POP", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "ABILD", "stationName": "Abilene T&D Office TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "ABGON", "stationName": "Abingdon TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "ADAR", "stationName": "Adair TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "ADARI", "stationName": "Adario TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "ADENA", "stationName": "Adena TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "ALBAY", "stationName": "Albany TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "ALBIN", "stationName": "Albion TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "ALIC", "stationName": "Alice SC TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "ALLST", "stationName": "Allen Stuart TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "ALLHT", "stationName": "Allenhurst POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "ALLTN", "stationName": "Allentown POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "ALTNA", "stationName": "Altoona POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "AMITY", "stationName": "Amity TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "AMOSP", "stationName": "Amos Plant TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "ANTTS", "stationName": "Antlers TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "ANTWP", "stationName": "Antwerp TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "ARART", "stationName": "Ararat TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "ARIST", "stationName": "Arista TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "ARSHL", "stationName": "Arsenal Hill TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "ASHDO", "stationName": "Ashdown TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "ASHER", "stationName": "Asherton TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "ASHLD", "stationName": "Ashland POP", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "ATHEN", "stationName": "Athens POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "ATLTA", "stationName": "Atlanta TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "ATOKW", "stationName": "Atoka WFEC TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "AUSTI", "stationName": "Austin POP (Uni-Point)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "POPAU", "stationName": "Austin POP Brazos (Grande)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "POPAS", "stationName": "Austin POP Riverside (Grande)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "AVOCA", "stationName": "Avoca TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "BLDKN", "stationName": "Bald Knob TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "BALMH", "stationName": "Balmorhea TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "BANGO", "stationName": "Bangor TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "BARKD", "stationName": "Barksdale TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "BARNV", "stationName": "Barnesville TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "BARVL", "stationName": "Bartlesville LMR TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "BAS73", "stationName": "Bashan Tower 73", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "BAS74", "stationName": "Bashan Tower 74", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "BATVL", "stationName": "Batesville TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "BAYCT", "stationName": "Bay City TS (Liberman)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "BAYMT", "stationName": "Bays Mountain TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "BEALV", "stationName": "Beallsville TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "BEARW", "stationName": "Bearwallow TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "BEATT", "stationName": "Beatty TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "BMTTS", "stationName": "Bee Mountain TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "BEEBE", "stationName": "Beebe TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "BCHFK", "stationName": "Beech Fork TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "BEECH", "stationName": "Beech Mountain TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "BEEST", "stationName": "Beeville STEC TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "BEVIL", "stationName": "Beeville TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "BLDTS", "stationName": "Belding TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "BLFON", "stationName": "Bellefontaine TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "BLLVU", "stationName": "Bellevue TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "BELVL", "stationName": "Bellville TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "BELMT", "stationName": "Belmont TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "BELPE", "stationName": "Belpre TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "BENVL", "stationName": "Bentonville TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "BERCO", "stationName": "Berrien County Empire EOC", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "BEST", "stationName": "Best TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "BETHY", "stationName": "Bethany TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "BIGA", "stationName": "Big A Mountain TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "BIGHL", "stationName": "Big Hill TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "BIGSD", "stationName": "Big Sandy TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "BIGUG", "stationName": "Big Ugly Creek TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "BISTX", "stationName": "Bishop TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "NEWCA", "stationName": "Blanchard TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "BLWTS", "stationName": "Blevins/Washington TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "BLOMV", "stationName": "Bloomville TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "BLUCK", "stationName": "Blue Creek TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "BLUFD", "stationName": "Bluefield POP", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "BLUFT", "stationName": "Bluffton TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "BOONV", "stationName": "Booneville TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "BORDN", "stationName": "Borden Building POP", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "BRKTV", "stationName": "Brackettville TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "BRADL", "stationName": "Bradley POP", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "BREET", "stationName": "Breed Plant TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "BRMFD", "stationName": "Brimfield TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "BRKHN", "stationName": "Brinkhaven TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "BKNBO", "stationName": "Broken Bow MW TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "BRMMT", "stationName": "Brumley Mountain TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "BUCHN", "stationName": "Buchanan TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "BUCKH", "stationName": "Buckhorn TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "BCYUS", "stationName": "Bucyrus TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "BUEVA", "stationName": "Buena Vista TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "BFFMN", "stationName": "Buffalo Mountain TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "BFFMT", "stationName": "Buffalo Mtn Rpt TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "BULMT", "stationName": "Bull Mountain TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "BULFG", "stationName": "Bullfrog Mtn TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "BRGRK", "stationName": "Burning Rock TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "BUTLE", "stationName": "Butler TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "CALTS", "stationName": "Calvin TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CAMBR", "stationName": "Cambridge POP", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "CAMRN", "stationName": "Cameron TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "CANTO", "stationName": "Canton POP", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "CANTN", "stationName": "Canton TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "CANTE", "stationName": "Canute TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CARLI", "stationName": "Carlisle POP (ValleyNet)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "CARSP", "stationName": "Carrizo Springs TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "CARTR", "stationName": "Carter Mtn TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CRTHG", "stationName": "Carthage TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "CATAL", "stationName": "Catalpa TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "CAVMT", "stationName": "Cavanal Mountain TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CGPTS", "stationName": "Cedar Gap TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "CNTER", "stationName": "Center TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "CHARS", "stationName": "Charleston POP", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "CHRLT", "stationName": "Charlotte TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "CHESP", "stationName": "Chesapeake Connectlink POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "CHETS", "stationName": "Cheyenne TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CHCKH", "stationName": "Chickasha TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CHILR", "stationName": "Childress TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "CHLDS", "stationName": "Childress TS (OLD)", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "CHLTH", "stationName": "Chillicothe POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "CIENG", "stationName": "Cienega Peak TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "CIRCL", "stationName": "Circleville POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "CISCT", "stationName": "Cisco TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "CLARN", "stationName": "Clarendon TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "CLATS", "stationName": "Clayton TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CLAYR", "stationName": "Claytor TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "CLHRV", "stationName": "Clinch River TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "CLINE", "stationName": "Cline TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "CLINT", "stationName": "Clinton POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "CLNTN", "stationName": "Clinton TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CLTWD", "stationName": "Clintwood TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "CLYMT", "stationName": "Cloudy Mtn TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "COLFK", "stationName": "Coal Fork TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "PURCL", "stationName": "Cole TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CLETO", "stationName": "Coleto Creek TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "COLGV", "stationName": "Columbus Grove TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "COLUS", "stationName": "Columbus POP", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "CLMBS", "stationName": "Columbus TS (TX)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "COMCH", "stationName": "Comanche TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CONCD", "stationName": "Concordia TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "CONVE", "stationName": "Conesville POP", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "CONVL", "stationName": "Connersville TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "COK", "stationName": "Cook TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "POPCC", "stationName": "Corpus Christi POP Wilson Plaza (Grande)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "CCTEL", "stationName": "Corpus Christi Telco POP (Grande)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "CCMCI", "stationName": "Corpus Christi-MCI POP", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "CORDR", "stationName": "Corridor TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "COSHC", "stationName": "Coshocton TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "COTHL", "stationName": "Cotton Hill TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "COTWD", "stationName": "Cottonwood TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "CTULA", "stationName": "Cotulla TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "COVET", "stationName": "Covert TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "CRAJC", "stationName": "Craig Junction TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "CRSTO", "stationName": "Crestonio TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "CRSPL", "stationName": "Cross Plains TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "CROWE", "stationName": "Crowell TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "CROWN", "stationName": "Crown City TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "CUTLR", "stationName": "Cutler TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "CYRL", "stationName": "Cyril CS TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "DCONT", "stationName": "DCON IT Telecom Training Center", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "DANGD", "stationName": "Daingerfield TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "DARRH", "stationName": "Darrah POP", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "DARWN", "stationName": "Darwin TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "DEQEN", "stationName": "De Queen TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "DECTR", "stationName": "Decatur TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "DEERV", "stationName": "Deersville TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "DLRIO", "stationName": "Del Rio TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "DELAW", "stationName": "Delaware POP", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "DELWR", "stationName": "Delaware TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "DELBA", "stationName": "Delbarton TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "DEQUE", "stationName": "Dequine TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "DESTS", "stationName": "Desert Sky Wind TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "DICKN", "stationName": "Dickens LMR TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "DILEY", "stationName": "Dilley TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "DLNVL", "stationName": "Dillonvale TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "DINGT", "stationName": "Dingess TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "DISPK", "stationName": "Dismal Peak TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "DBLMT", "stationName": "Double Mountain TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "DOWGC", "stationName": "Dowagiac TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "DRESN", "stationName": "Dresden TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "DNKK", "stationName": "Dunkirk TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "EAGEP", "stationName": "Eagle Pass MW/LMR TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "EDNAT", "stationName": "Edna TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "ELCAM", "stationName": "El Campo TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "ELDTX", "stationName": "Eldorado (TX) Station", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "ELECT", "stationName": "Electra TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "ELKCY", "stationName": "Elk City LMR TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "ELIOT", "stationName": "Elliott TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "ELMCK", "stationName": "Elm Creek TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "ERNA", "stationName": "Erna TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "ETN", "stationName": "Etna TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "EURSP", "stationName": "Eureka Springs TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "EVANS", "stationName": "Evans TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "FALFR", "stationName": "Falfurrias TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "FANGP", "stationName": "Fancy Gap TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "FAYIM", "stationName": "Fayetteville IMC TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "FAYTV", "stationName": "Fayetteville LMR TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "FERRM", "stationName": "Ferrum TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "FINDY", "stationName": "Findlay TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "FITCH", "stationName": "Fitch TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "FLTTP", "stationName": "Flat Top TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "FLTWD", "stationName": "Flatwoods TS (KY)", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "FLEMI", "stationName": "Fleming TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "FOREM", "stationName": "Foreman TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "FKRDG", "stationName": "Fork Ridge TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "FRANC", "stationName": "Francitas TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "FREDK", "stationName": "Frederick Junction Station TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "HOLSR", "stationName": "Frederick TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "FRDIA", "stationName": "Fredonia TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "FRER", "stationName": "Freer TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "FREMO", "stationName": "Fremont TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "FNDSP", "stationName": "Friendship TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "FTCTS", "stationName": "Ft Cobb TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "FTDAV", "stationName": "Ft Davis TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "FTSTN", "stationName": "Ft Stockton TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "FTWYE", "stationName": "Ft Wayne POP", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "GALLP", "stationName": "Gallipolis TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "GLYMT", "stationName": "Gauley Mountain TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "GILLD", "stationName": "Gilliland TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "ROSWD", "stationName": "Gilmer TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "GLENL", "stationName": "Glen Lyn POP (VA)", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "GLNLN", "stationName": "Glen Lyn TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "GONZL", "stationName": "Gonzales TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "GOSHN", "stationName": "Goshen TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "GRSTS", "stationName": "Grand Saline TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "GRNDF", "stationName": "Grandfield TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "GRNLK", "stationName": "Green Lake TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "GRNKB", "stationName": "Greens Knob TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "GRNBG", "stationName": "Greensburg POP (ACC)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "GRNUP", "stationName": "Greenup TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "GREWD", "stationName": "Greenwood TS (ARK)", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "GROV", "stationName": "Grove LMR TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "GRVE", "stationName": "Grove MW TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "GROPT", "stationName": "Groveport TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "GRNDY", "stationName": "Grundy TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "GUYDT", "stationName": "Guyandotte TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "HAGHL", "stationName": "Hager Hill TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "HALMN", "stationName": "Hallman TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "HAMLI", "stationName": "Hamlin TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "POPNA", "stationName": "Harlingen POP (Grande)", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "HARBG", "stationName": "Harrisburg POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "HARCY", "stationName": "Hartford City TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "PTEAU", "stationName": "Hartford TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "HAYEN", "stationName": "Hayden TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "HAYSJ", "stationName": "Haysi TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "HAZRD", "stationName": "Hazard TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "HRDMT", "stationName": "Heard Mountain TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "HENDN", "stationName": "Henderson TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "HNRY", "stationName": "Henryetta LMR TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "HERND", "stationName": "Herndon POP (ValleyNet)", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "HGHLL", "stationName": "High Hill TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "HIKNB", "stationName": "High Knob TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "HIPEK", "stationName": "High Peak TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "HITOP", "stationName": "High Top TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "HLBOR", "stationName": "Hillsboro TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "HINDM", "stationName": "Hindman TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "HBART", "stationName": "Hobart MW TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "HORNT", "stationName": "Hornbeck TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "HORPN", "stationName": "Horsepen Mountain TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "HOSTN", "stationName": "Hosston TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "HOUTX", "stationName": "Houston C3 POP", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "HUGLM", "stationName": "Hugo LMR TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "HUGMW", "stationName": "Hugo MW TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "HUNTN", "stationName": "Huntington POP", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "HYDEN", "stationName": "Hyden TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "IDALM", "stationName": "Idabel LMR TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "IDABE", "stationName": "Idabel TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "IDNCP", "stationName": "Indian Camp TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "INEZT", "stationName": "Inez TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "INSTI", "stationName": "Institute TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "IRNLM", "stationName": "Iraan LMR TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "IRON", "stationName": "Ironton POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "IROTS", "stationName": "Ironton TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "IVYKB", "stationName": "Ivy Knob TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "JLBTS", "stationName": "J L Bates TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "JCKCH", "stationName": "Jackson Chapel TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "JCKSO", "stationName": "Jackson TS (KY)", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "JACKS", "stationName": "Jacksons Ferry TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "JOHNS", "stationName": "Johnstown POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "JUNTW", "stationName": "Junction Tower LMR TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "VINIT", "stationName": "KAMO Vinita TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "KANAH", "stationName": "Kanawha TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "KANKE", "stationName": "Kankakee POP", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "KANAS", "stationName": "Kansas TS (OK)", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "KARCY", "stationName": "Karnes City LMR TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "KEENT", "stationName": "Keen Mountain TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "KEEKN", "stationName": "Keeney Knob TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "KELLY", "stationName": "Kellysville (WV) TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "KENNA", "stationName": "Kenna TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "KILGO", "stationName": "Kilgore TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "KNGRH", "stationName": "King Ranch TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "KOKMO", "stationName": "Kokomo TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "KYRCK", "stationName": "Kyger Creek TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "LDDS", "stationName": "LDDS POP", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "LAPLM", "stationName": "La Palma TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "LAQNT", "stationName": "La Quinta TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "LKEUC", "stationName": "Lake Eucha TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "LAMKB", "stationName": "Lamberts Knob TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "LANCR", "stationName": "Lancaster TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "LAREN", "stationName": "Laredo North TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "LARD", "stationName": "Laredo TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "LATHM", "stationName": "Latham TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "LAVAL", "stationName": "Lavalette TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "LAWRB", "stationName": "Lawrenceburg TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "LAWET", "stationName": "Lawton Eastside TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "LWTN", "stationName": "Lawton TS (MARS)", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "LWT", "stationName": "Lawton TS (MI)", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "LAWT", "stationName": "Lawton TS (OK)", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "LAYLN", "stationName": "Layland TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "LEAWD", "stationName": "Leatherwood TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "LEBON", "stationName": "Lebanon POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "LEEVL", "stationName": "Leesville TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "LEOND", "stationName": "Leonard TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "LEONB", "stationName": "Leonardsburg TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "LEWTN", "stationName": "Lewistown POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "LKKNB", "stationName": "Lick Knob TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "LIEBR", "stationName": "Lieberman TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "LIGNR", "stationName": "Ligonier POP", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "LIMA", "stationName": "Lima TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "LINCN", "stationName": "Lincoln TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "LINN", "stationName": "Linn TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "LOBOT", "stationName": "Lobo TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "LOGA", "stationName": "Logan TS (WV)", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "LCHLL", "stationName": "Lon Hill TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "LNGMT", "stationName": "Long Mountain TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "LNGST", "stationName": "Longstreet TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "LONTX", "stationName": "Longview POP (Grande)", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "LNGVW", "stationName": "Longview TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "LOOKA", "stationName": "Lookeba TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "LOOKB", "stationName": "Lookeba TS (MARS)", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "LOSFS", "stationName": "Los Fresnos TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "LOUKY", "stationName": "Louisville POP (Qwest)", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "LWRNP", "stationName": "Lower Newport TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "MACKS", "stationName": "Macksburg TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "MADSN", "stationName": "Madison TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "MASBC", "stationName": "Madison TWP (OH) SBC POP (837)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "MALVR", "stationName": "Malvern TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "MANGM", "stationName": "Mangum TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "MANSD", "stationName": "Mansfield SC TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "MANY", "stationName": "Many TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "MARF", "stationName": "Marfa TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "MARIT", "stationName": "Marietta TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "MARIO", "stationName": "Marion POP", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "MARSL", "stationName": "Marshall TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "MARYE", "stationName": "Marysville POP", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "MARYV", "stationName": "Marysville TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "MASTW", "stationName": "Mason LCRA Tower TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "MAUD", "stationName": "Maud TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "MAYFL", "stationName": "Mayhew Flats TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "MAYVL", "stationName": "Maysville TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "MCARP", "stationName": "McAlester Repeater TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "MFETX", "stationName": "McAllen POP (Grande)", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "MCHUB", "stationName": "McCamey Hub", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "MCCTS", "stationName": "McCamey TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "MCCON", "stationName": "McConnelsville Radio Station (OLD)", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "MCCRP", "stationName": "McConnelsville TS (Repeater Building)", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "MEMTN", "stationName": "Memphis POP (Level 3)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "MEMPS", "stationName": "Memphis TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "MENLM", "stationName": "Mena LMR TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "MNRD", "stationName": "Menard TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "MIDBY", "stationName": "Middlebury TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "MIDPR", "stationName": "Middleport TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "MILN", "stationName": "Milan TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "MILBG", "stationName": "Millersburg TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "MINEA", "stationName": "Mineola TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "MINFD", "stationName": "Minford TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "MORTN", "stationName": "Morristown POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "MNDVL", "stationName": "Moundsville TS (OH)", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "MTNLK", "stationName": "Mountain Lake TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "MNTVW", "stationName": "Mountain View TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "MONTR", "stationName": "Mountaineer TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "MTHCD", "stationName": "Mouthcard TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "MTCRS", "stationName": "Mt Cross TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "MTJOY", "stationName": "Mt Joy TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "MTPLS", "stationName": "Mt Pleasant TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "MTSTG", "stationName": "Mt Sterling TS", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "MULCK", "stationName": "Mulberry Creek TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "MUNCI", "stationName": "Muncie POP", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "MUNCE", "stationName": "Muncie TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "MUNDY", "stationName": "Munday TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "BNATN", "stationName": "Nashville POP (Level 3)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "NASVL", "stationName": "Nashville TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "NEWAL", "stationName": "New Alexandria TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "NNBOS", "stationName": "New Boston TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "NEWBF", "stationName": "New Buffalo TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "NEWLX", "stationName": "New Lexington TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "NEWMV", "stationName": "New Martinsville TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "NPHIA", "stationName": "New Philadelphia POP", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "NEWPH", "stationName": "New Philadelphia TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "NEWRG", "stationName": "New Riegel TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "NEWCN", "stationName": "Newark Center POP", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "NEWAR", "stationName": "Newark TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "NEWCM", "stationName": "Newcomerstown TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "NEWPT", "stationName": "Newport TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "NILE", "stationName": "Niles TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "NORG", "stationName": "Norge TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "NEDBG", "stationName": "North Edinburg Sub TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "NPOR", "stationName": "North Portsmouth TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "NPRTM", "stationName": "North Portsmouth TS POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "NOTBK", "stationName": "Notch Block TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "NOWTA", "stationName": "Nowata TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "NUEBY", "stationName": "Nueces Bay TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "NURSY", "stationName": "Nursery TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "OAKTX", "stationName": "Oak Creek TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "OAKHL", "stationName": "Oak Hill (OH) TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "OAKLD", "stationName": "Oakland TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "OGDEN", "stationName": "Ogden Microwave Site", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "OKLUN", "stationName": "Oklaunion TS (PSO)", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "OKLON", "stationName": "Oklaunion TS (TNC)", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "OLIV", "stationName": "Olive TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "ONDPK", "stationName": "Oneida Peak TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "ORIEN", "stationName": "Orient LMR TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "OVRTS", "stationName": "Overton TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "OWASO", "stationName": "Owasso TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "OZNA", "stationName": "Ozona TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "PADST", "stationName": "Paducah City Station", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "PNTCR", "stationName": "Paint Creek TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "PANTR", "stationName": "Panther TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "PAWHK", "stationName": "Pawhuska TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "PEACK", "stationName": "Peacock TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "PEAKB", "stationName": "Peak Knob TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "PRSAL", "stationName": "Pearsall Service Center (MARS) TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "PEEBL", "stationName": "Peebles TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "PHLBG", "stationName": "Phillipsburg POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "PHILO", "stationName": "Philo TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "PIKTN", "stationName": "Piketon POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "PIRKE", "stationName": "Pirkey Plant TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "PITBR", "stationName": "Pittsburg POP (ACC)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "PLADL", "stationName": "Plain Dealing TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "PLSBD", "stationName": "Pleasant Bend TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "PLSN", "stationName": "Pleasant City TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "PLCHR", "stationName": "Pletcher Station", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "PLYM", "stationName": "Plymouth TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "PRMT2", "stationName": "Poor Mountain #2 TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "PORTN", "stationName": "Portland TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "PZOOM", "stationName": "Portsmouth Zoomnet TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "PRAGV", "stationName": "Prairie Grove TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "PRETN", "stationName": "Preston TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "PRCVL", "stationName": "Proctorville TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "PRYOR", "stationName": "Pryor TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "PTLOK", "stationName": "Pt Lookout Mountain TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "PTPLE", "stationName": "Pt Pleasant TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "PURGA", "stationName": "Purgatory TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "RACON", "stationName": "Raccoon TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "RACHL", "stationName": "Rachal TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "RANEL", "stationName": "Rainelle TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "RATCL", "stationName": "Ratcliffburg TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "RAVWO", "stationName": "Ravenswood POP", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "RAYTX", "stationName": "Raymondville TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "READG", "stationName": "Reading POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "REDCR", "stationName": "Red Creek TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "REDFK", "stationName": "Red Fork TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "REEDV", "stationName": "Reedsville TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "REFGO", "stationName": "Refugio TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "RICHN", "stationName": "Richardson TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "RICHM", "stationName": "Richmond TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "RINGD", "stationName": "Ringgold TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "RGCME", "stationName": "Rio Grande City (Medina) TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "RGCLM", "stationName": "Rio Grande City LMR TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "RIOHN", "stationName": "Rio Hondo TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "ROANE", "stationName": "Roanoke POP", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "ROBPA", "stationName": "Robison Park TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "ROCKB", "stationName": "Rockbridge TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "ROCKH", "stationName": "Rockhill POP", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "RCKHL", "stationName": "Rockhill TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "ROCKT", "stationName": "Rockport Plant TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "ROCKP", "stationName": "Rockport TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "RCKSP", "stationName": "Rocksprings TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "ROGRT", "stationName": "Rogers LMR TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "ROSSI", "stationName": "Ross IMC", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "ROSSP", "stationName": "Ross POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "ROS", "stationName": "Ross TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "RUL", "stationName": "Rule TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "RUSTS", "stationName": "Rush Springs TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "SALYR", "stationName": "Salyersville TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "SANAG", "stationName": "San Angelo LMR TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "SAPS", "stationName": "San Angelo PS TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "SAPTS", "stationName": "San Angelo Station TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "SANDM", "stationName": "Sand Mountain TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "SNDSP", "stationName": "Sand Springs LMR TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "SMARI", "stationName": "Santa Maria TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "SROSA", "stationName": "Santa Rosa TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "SARGS", "stationName": "Saragosa TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "SARAH", "stationName": "Sarahsville TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "SARDN", "stationName": "Sardinia TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "SAYTS", "stationName": "Sayre TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "SCHIF", "stationName": "Schiff TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "SCHKB", "stationName": "Schoonover Knob TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "SCIOO", "stationName": "Scio TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "SMRCK", "stationName": "Shamrock TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "SHAWE", "stationName": "Shawnee TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "SHIST", "stationName": "Shinnick Street POP", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "SHRC3", "stationName": "Shreveport POP (Grande)", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "SINTS", "stationName": "Sinton TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "SISSV", "stationName": "Sissonville TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "SMMTN", "stationName": "Smith Mountain TS", "regionName": "AP/KP", "areaName": "Roanoke" },
	{ "stationId": "SNYDE", "stationName": "Snyder TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "SONTW", "stationName": "Sonora Tower LMR TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "SOREN", "stationName": "Sorenson TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "SCREG", "stationName": "South Charleston Regen (OH)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "SLANT", "stationName": "South Lancaster TS POP", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "SWILN", "stationName": "South Williamson TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "SWOOS", "stationName": "South Wooster TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "SPAVW", "stationName": "Spavinaw TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "SPONS", "stationName": "Sponseller TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "SPRN", "stationName": "Sporn Plant TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "STMAR", "stationName": "St Marys TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "STCOL", "stationName": "State College POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "STECY", "stationName": "Sterling City TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "STIGE", "stationName": "Stigler TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "STCKP", "stationName": "Stockport TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "STNCK", "stationName": "Stone Creek TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "STRBG", "stationName": "Strasburg TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "SUGGR", "stationName": "Sugar Grove TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "TALP", "stationName": "Talpa TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "TXAR", "stationName": "Texarkana Area TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "TEXCM", "stationName": "Texas Comm Tower TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "TEXCT", "stationName": "Texas Communications Tower TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "THALI", "stationName": "Thalia TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "THMAS", "stationName": "Thomas TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "TRIVR", "stationName": "Three Rivers LMR TS (TX)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "TRERV", "stationName": "Three Rivers TS (MI)", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "THRTS", "stationName": "Three Rivers TS (TX)", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "TMNTN", "stationName": "Throckmorton TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "TIFF", "stationName": "Tiffin TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "TGRHL", "stationName": "Tiger Hill TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "TILLM", "stationName": "Tillman TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "TOMRV", "stationName": "Toms River POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "TRIMB", "stationName": "Trimble TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "TROUS", "stationName": "Trousdale TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "TRYON", "stationName": "Tryon Road TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "POPTU", "stationName": "Tulsa POP (Grande)", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "TUSSE", "stationName": "Tulsa Southeast MW TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "TULYL", "stationName": "Tulsa Yale TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "TURKT", "stationName": "Turk PS Telecom Building", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "TRKEY", "stationName": "Turkey TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "TURNR", "stationName": "Turner TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "TWBRA", "stationName": "Twin Branch TS", "regionName": "IM", "areaName": "South Bend" },
	{ "stationId": "UNIST", "stationName": "Union Street TS", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "UVMEC", "stationName": "Uvalde MEC TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "UVAL", "stationName": "Uvalde TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "VALLS", "stationName": "Valliant 345KV Station TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "VWERT", "stationName": "Van Wert TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "MCISH", "stationName": "Verizon Business Shreveport POP", "regionName": "SWEPCO", "areaName": "Shreveport" },
	{ "stationId": "VICTA", "stationName": "Victoria POP", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "VICTR", "stationName": "Victoria SC TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "VINTB", "stationName": "Vinita TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "VIOLT", "stationName": "Violet TS", "regionName": "Texas", "areaName": "Corpus Christi" },
	{ "stationId": "WCJC", "stationName": "WCJC TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "WPS", "stationName": "WPS TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "WALDO", "stationName": "Waldo TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "WALDR", "stationName": "Waldron TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "WALMT", "stationName": "Walker Mountain TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "WLTER", "stationName": "Walters TS (New Location)", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "WARRN", "stationName": "Warren TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "WATTS", "stationName": "Watts TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "WAVRY", "stationName": "Waverly TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "WAYN", "stationName": "Wayne TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "WEATH", "stationName": "Weatherford TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "WEBMW", "stationName": "Webb MW TS", "regionName": "Texas", "areaName": "Pharr" },
	{ "stationId": "WEDTN", "stationName": "Weddington TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "WELH", "stationName": "Welch TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "WELKA", "stationName": "Weleetka LMR TS", "regionName": "PSO", "areaName": "Tulsa" },
	{ "stationId": "WELLN", "stationName": "Wellington TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "WELLV", "stationName": "Wellsville TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "WALKN", "stationName": "West Alikanna TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "WCAM", "stationName": "West Cambridge TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "WLIBY", "stationName": "West Liberty TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "WNPHA", "stationName": "West New Philadelphia POP", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "WPORT", "stationName": "West Portsmouth TS", "regionName": "Ohio", "areaName": "Southern Ohio" },
	{ "stationId": "WPOWN", "stationName": "West Powhatan TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "HUGOW", "stationName": "Western Farmers Hugo TS", "regionName": "PSO", "areaName": "Lawton" },
	{ "stationId": "WHECP", "stationName": "Wheeling C&P TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "WHELW", "stationName": "Wheelwright TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "WTEOK", "stationName": "White Oak TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "WHTBG", "stationName": "Whitesburg TS", "regionName": "AP/KP", "areaName": "Ashland" },
	{ "stationId": "WHTOP", "stationName": "Whitetop Mountain TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "WHITY", "stationName": "Whitney TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "WILKE", "stationName": "Wilkes TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "WILMT", "stationName": "Willis Mountain TS", "regionName": "AP/KP", "areaName": "Charleston" },
	{ "stationId": "WINTR", "stationName": "Winchester TS", "regionName": "IM", "areaName": "Fort Wayne" },
	{ "stationId": "WINBR", "stationName": "Winnsboro TS", "regionName": "SWEPCO", "areaName": "Texarkana" },
	{ "stationId": "WNTTS", "stationName": "Winters TS", "regionName": "Texas", "areaName": "Abilene" },
	{ "stationId": "WOOSE", "stationName": "Wooster POP", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "WOOST", "stationName": "Wooster TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "WT168", "stationName": "Wyoming Station Tower 168-B1 TS", "regionName": "AP/KP", "areaName": "Bluefield" },
	{ "stationId": "YRK", "stationName": "York POP (GPU)", "regionName": "Ohio", "areaName": "Groveport" },
	{ "stationId": "ZANES", "stationName": "Zanesville TS", "regionName": "Ohio", "areaName": "Canton" },
	{ "stationId": "ZAPTA", "stationName": "Zapata TS", "regionName": "Texas", "areaName": "Pharr" }
	];

	var inMemoryRegions = [
	{"regionId": "AP/KP", "regionName": "AP/KP"},
	{"regionId": "IM", "regionName": "IM"},
	{"regionId": "Ohio", "regionName": "Ohio"},
	{"regionId": "PSO", "regionName": "PSO"},
	{"regionId": "SWEPCO", "regionName": "SWEPCO"},
	{"regionId": "Texas", "regionName": "Texas"}
	];

    var inMemoryAreas = [
	{"areaId": "Abilene", "areaName": "Abilene", "regionName": "Texas"},
	{"areaId": "Ashland", "areaName": "Ashland", "regionName": "AP/KP"},
	{"areaId": "Bluefield", "areaName": "Bluefield", "regionName": "AP/KP"},
	{"areaId": "Canton", "areaName": "Canton", "regionName": "Ohio"},
	{"areaId": "Charleston", "areaName": "Charleston", "regionName": "AP/KP"},
	{"areaId": "Corpus Christi", "areaName": "Corpus Christi", "regionName": "Texas"},
	{"areaId": "Fort Wayne", "areaName": "Fort Wayne", "regionName": "IM"},
	{"areaId": "Groveport", "areaName": "Groveport", "regionName": "Ohio"},
	{"areaId": "Lawton", "areaName": "Lawton", "regionName": "PSO"},
	{"areaId": "Pharr", "areaName": "Pharr", "regionName": "Texas"},
	{"areaId": "Roanoke", "areaName": "Roanoke", "regionName": "AP/KP"},
	{"areaId": "Shreveport", "areaName": "Shreveport", "regionName": "SWEPCO"},
	{"areaId": "South Bend", "areaName": "South Bend", "regionName": "IM"},
	{"areaId": "Southern Ohio", "areaName": "Southern Ohio", "regionName": "Ohio"},
	{"areaId": "Texarkana", "areaName": "Texarkana", "regionName": "SWEPCO"},
	{"areaId": "Tulsa", "areaName": "Tulsa", "regionName": "PSO"}
	];

	var inMemoryLinkedStation = {
		stationId: 'THALI',
		linkedStationId: '1234',
		linkedStationName: 'TD_DEFAULT'
	};

    var inMemoryStationWarnings = [];
    var inMemoryEntryLogExclusions = [];
    var inMemoryUserRole = "NOC_Admin";
    var inMemoryUserName = "NOC_Admin";

    var findOpen = function(options) {
        var stationEntryLogs;
        if (options.stationId) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.stationId === options.stationId && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else if (options.userId) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.userId === options.userId && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else if (options.userName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.userName === options.userName && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else if (options.areaName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.areaName === options.areaName && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else if (options.regionName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.regionName === options.regionName && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.hasOwnProperty('outTime') === false;
            });
        }
        return stationEntryLogs;
    };

    var findExpired = function(options) {
        var stationEntryLogs;
        if (options.stationId) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.stationId === options.stationId && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else if (options.userId) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.userId === options.userId && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else if (options.userName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.userName === options.userName && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else if (options.areaName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.areaName === options.areaName && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else if (options.regionName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.regionName === options.regionName && stationEntryLog.hasOwnProperty('outTime') === false;
            });
        } else {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.hasOwnProperty('outTime') === false;
            });
        }
        return stationEntryLogs;
    };

    var findCheckedOut = function(options) {
        var stationEntryLogs;
        if (options.stationId) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.stationId === options.stationId && stationEntryLog.outTime;
            });
        } else if (options.userId) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.userId === options.userId && stationEntryLog.outTime;
            });
        } else if (options.userName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.userName === options.userName && stationEntryLog.outTime;
            });
        } else if (options.areaName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.areaName === options.areaName && stationEntryLog.outTime;
            });
        } else if (options.regionName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.regionName === options.regionName && stationEntryLog.outTime;
            });
        } else {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.outTime;
            });
        }
        return stationEntryLogs;
    };

    var findAll = function(options) {
        var stationEntryLogs;
        if (options.stationId) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.stationId === options.stationId;
            });
        } else if (options.userId) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.userId === options.userId;
            });
        } else if (options.userName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.userName === options.userName;
            });
        } else if (options.areaName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.areaName === options.areaName;
            });
        } else if (options.regionName) {
            stationEntryLogs = _.where(inMemoryStationEntryLogs, function(stationEntryLog) {
                return stationEntryLog.regionName === options.regionName;
            });
        } else {
            stationEntryLogs = inMemoryStationEntryLogs;
        }
        return stationEntryLogs;
    };


    var DashboardService = function(options) {
        console.trace("new DashboardService()");
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(DashboardService.prototype, {
        initialize: function(options) {
            console.trace("DashboardService.initialize");
            options || (options = {});
        },
        getStations: function(options) {
            options || (options = {});

            var stations;
            if (options.stationId) {
                stations = _.where(inMemoryStations, function(station) {
                    return station.stationId === options.stationId;
                });
            } else if (options.areaName) {
                stations = _.where(inMemoryStations, function(station) {
                    return station.areaName === options.areaName;
                });
            } else if (options.regionName) {
                stations = _.where(inMemoryStations, function(station) {
                    return station.regionName === options.regionName;
                });
            } else {
                stations = inMemoryStations;
            }

            var deferred = $.Deferred();
            var results = {
                stations: stations,
                regions: inMemoryRegions,
                areas: inMemoryAreas,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
		getLinkedStation: function(options) {
			options || (options = {});
			var data = $.param(options);

            var stations;
            if (options.stationId) {
                stations = _.where(inMemoryStations, function(station) {
                    return station.stationId === options.stationId;
                });
            } else if (options.areaName) {
                stations = _.where(inMemoryStations, function(station) {
                    return station.areaName === options.areaName;
                });
            } else if (options.regionName) {
                stations = _.where(inMemoryStations, function(station) {
                    return station.regionName === options.regionName;
                });
            } else {
                stations = inMemoryStations;
            }

			var deferred = $.Deferred();
			var results = {
				stations: stations,
				regions: inMemoryRegions,
				areas: inMemoryAreas,
				userRole: inMemoryUserRole
			};
			setTimeout(function() {
				deferred.resolve(results, "success", null);
			}, 3000);
			return deferred.promise();
		},
        getStationEntryLogs: function(options) {
            options || (options = {});

            var stationEntryLogs;
            if (options.onlyExpired) {
                stationEntryLogs = findExpired(options);
            } else if (options.onlyOpen) {
                stationEntryLogs = findOpen(options);
            } else if (options.onlyCheckedOut) {
                stationEntryLogs = findCheckedOut(options);
            } else {
                stationEntryLogs = findAll(options);
            }

            var deferred = $.Deferred();
            var results = {
                stationEntryLogs: stationEntryLogs,
                stationIdentifiers: inMemoryStationIdentifiers,
                regions: inMemoryRegions,
                areas: inMemoryAreas,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
        getPersonnels: function(options) {
            options || (options = {});

            var personnels;
            if (options.userId) {
                personnels = _.where(inMemoryPersonnels, function(personnel) {
                    return personnel.userId === options.userId;
                });
            } else if (options.userName) {
                personnels = _.where(inMemoryPersonnels, function(personnel) {
                    return personnel.userName === options.userName;
                });
            } else {
                personnels = inMemoryPersonnels;
            }

            var deferred = $.Deferred();
            var results = {
                personnels: personnels,
                stationIdentifiers: inMemoryStationIdentifiers,
                regions: inMemoryRegions,
                areas: inMemoryAreas,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 2000);
            return deferred.promise();
        },
        postCheckIn: function(options) {
            options || (options = {});

            var deferred = $.Deferred();
            var results = {
                stationEntryLog: inMemoryStationEntryLog,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
        postCheckOut: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                stationEntryLog: inMemoryStationEntryLog,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
        postUpdateCheckIn: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                stationEntryLog: inMemoryStationEntryLog,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
        getLookupDataItems: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                lookupDataItems: inMemoryLookupDataItems,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },

        getOptions: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                stationIdentifiers: inMemoryStationIdentifiers,
                purposes: inMemoryPurposes,
                durations: inMemoryDurations,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
        getFilters: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                stationIdentifiers: inMemoryStationIdentifiers,
                regions: inMemoryRegions,
                areas: inMemoryAreas,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
        postAddItem: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                lookupDataItem: inMemoryLookupDataItem,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
        postUpdateItem: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                lookupDataItem: inMemoryLookupDataItem,
                userRole: inMemoryUserRole
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
        },
		postAddLinkedStation: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
				linkedStation: inMemoryLinkedStation,
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		},
		postClearLinkedStation: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		},
		getEntryLogExclusions: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		},
		postAddEntryLogExclusion: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		},
		postDeleteEntryLogExclusion: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		},
		postAddStationWarning: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		},
		postUpdateStationWarning: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		},
		postClearStationWarning: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		},
		getStationWarnings: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            var deferred = $.Deferred();
            var results = {
                stationWarnings: inMemoryStationWarnings,
                userRole: inMemoryUserRole,
                userName: inMemoryUserName
            };
            setTimeout(function() {
                deferred.resolve(results, "success", null);
            }, 3000);
            return deferred.promise();
		}
    });

    return DashboardService;
});