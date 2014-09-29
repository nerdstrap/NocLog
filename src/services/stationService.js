define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var inMemoryStations = [
        {
            'stationId': 'PHILO',
            'complex': 'ohphilots',
            'stationName': 'Philo TS',
            'telecomPrimaryOrg': 'Ohio Power Company',
            'telecomBenefittingOrg': '250',
            'telecomPrimaryContact': 'CN=Charles A Hubble/OU=CA1/O=AEPIN',
            'telecomPrimaryContactPhone': '920-7159',
            'region': 'Ohio',
            'area': 'Canton',
            'telecomNpa': '740',
            'telecomNxx': '674',
            'telecomSiteType': 'Telecom Site',
            'telecomLatitude': '39.85144444',
            'telecomLongitude': '-81.88597222',
            'telecomLandOwner': 'Kenneth/Ruby Shook and Sara Friend',
            'telecomFuelProvider': 'Valley National Gases, Inc.\n61504 Southgate Rd., Cambridge, OH\nContact is Frank Hines/Marty Jones\nPhone # 800-825-1519',
            'telecomUtility': 'AEP',
            'audinetNumber': '909-5011',
            'streetAddress': '6270 Poverty Ridge Road',
            'city': 'Blue Rock',
            'state': 'OH',
            'zipcode': '43720',
            'country': 'US',
            'county': 'Muskingum',
            'mailAddress': '6270 Poverty Ridge Road',
            'mailCity': 'Blue Rock',
            'mailState': 'OH',
            'mailZipCode': '43720',
            'topFloor': '0',
            'form': 'Location'
        },
        {
            'stationId': 'PURGA',
            'complex': 'vapurgatoryts',
            'stationName': 'Purgatory TS',
            'telecomPrimaryOrg': 'Appalachian Power Company',
            'telecomBenefittingOrg': '140',
            'telecomPrimaryContact': 'CN=William T Holdren/OU=OR3/O=AEPIN',
            'telecomPrimaryContactPhone': '300-2999',
            'region': 'AP/KP',
            'area': 'Roanoke',
            'telecomSiteType': 'Telecom Site',
            'telecomLatitude': '37.56552777',
            'telecomLongitude': '-79.68891666',
            'telecomTransformerPole': 'Service by: Not Known',
            'streetAddress': '1.5 Miles from Intersection of US 11 & State Route 611 at 110 degrees',
            'city': 'Buchanan',
            'state': 'VA',
            'country': 'US',
            'county': 'Botetourt',
            'mailAddress': '1.5 Miles from Intersection of US 11 & State Route 611 at 110 degrees',
            'mailCity': 'Buchanan',
            'mailState': 'VA',
            'topFloor': '0',
            'form': 'Location'
        },
        {
            'stationId': 'THALI',
            'complex': 'txthaliats',
            'stationName': 'Thalia TS',
            'telecomBenefittingOrg': '119',
            'telecomPrimaryContact': 'CN=S Craig McCarty/O=AEPIN',
            'telecomPrimaryContactPhone': '780-7113',
            'region': 'Texas',
            'area': 'Abilene',
            'telecomSiteType': 'Telecom Site',
            'telecomLatitude': '34.01833333',
            'telecomLongitude': '-99.54944444',
            'telecomUtility': 'South west Rural Electric in Vernon TX 1-800-',
            'telecomCircuitFeeder': 'Account# 11758101 - Meter# 20253',
            'streetAddress': 'FM 262',
            'city': 'Thalia',
            'state': 'TX',
            'zipcode': '79227',
            'country': 'US',
            'county': 'Foard',
            'mailAddress': 'FM 262',
            'mailCity': 'Thalia',
            'mailState': 'TX',
            'mailZipCode': '79227',
            'topFloor': '0',
            'form': 'Location'
        },
        {
            'stationId': 'CAMRN',
            'complex': 'wvcameronts',
            'stationName': 'Cameron TS',
            'telecomPrimaryOrg': 'Wheeling Power Company',
            'telecomBenefittingOrg': '210',
            'telecomPrimaryContact': 'CN=Charles A Hubble/OU=CA1/O=AEPIN',
            'telecomPrimaryContactPhone': '920-7159',
            'region': 'Ohio',
            'area': 'Canton',
            'telecomSiteType': 'Telecom Site',
            'telecomLatitude': '39.81594444',
            'telecomLongitude': '-80.56052777',
            'telecomUtility': 'AEP Columbus DDC',
            'telecomUtilityPhone': '909-4022',
            'telecomCircuitFeeder': '6101314 LOUDENVILLE-CAMERON RIDGE',
            'telecomTransformerPole': '719D2505',
            'audinetNumber': '920-7367',
            'streetAddress': 'Off of Route 5',
            'city': 'Cameron',
            'state': 'WV',
            'zipcode': '26033',
            'country': 'US',
            'county': 'Marshall',
            'mailAddress': 'Off of Route 5',
            'mailCity': 'Cameron',
            'mailState': 'WV',
            'mailZipCode': '26033',
            'topFloor': '0',
            'form': 'Location'
        },
        {
            'stationId': 'MCHUB',
            'complex': 'txmccameyhub',
            'stationName': 'McCamey Hub',
            'telecomBenefittingOrg': '119',
            'telecomPrimaryContact': 'CN=S Craig McCarty/O=AEPIN',
            'telecomPrimaryContactPhone': '780-7113',
            'region': 'Texas',
            'area': 'Abilene',
            'telecomNpa': '432',
            'telecomNxx': '652',
            'telecomSiteType': 'Telecom Site',
            'streetAddress': '518 McKinney Ave.',
            'city': 'McCamey',
            'state': 'TX',
            'zipcode': '79752',
            'country': 'US',
            'mailAddress': '518 McKinney Ave.',
            'mailCity': 'McCamey',
            'mailState': 'TX',
            'mailZipCode': '79752',
            'topFloor': '0',
            'form': 'Location'
        },
        {
            'stationId': 'HUGOW',
            'complex': 'okhugowfects',
            'stationName': 'Western Farmers Hugo TS',
            'telecomPrimaryOrg': 'Public Service Company of Oklahoma',
            'telecomBenefittingOrg': '167',
            'telecomPrimaryContact': 'CN=Rodney L Turner/O=AEPIN',
            'telecomPrimaryContactPhone': '704-4232',
            'region': 'PSO',
            'area': 'Lawton',
            'telecomSiteType': 'Telecom Site',
            'telecomLatitude': '34.00705555',
            'telecomLongitude': '-95.46663888',
            'telecomLandOwner': 'Chocktaw Electric Coop',
            'streetAddress': 'SR 93',
            'city': 'Hugo',
            'state': 'OK',
            'zipcode': '74743',
            'country': 'US',
            'county': 'Choctaw',
            'mailAddress': 'SR 93',
            'mailCity': 'Hugo',
            'mailState': 'OK',
            'mailZipCode': '74743',
            'topFloor': '0',
            'form': 'Location'
        },
        {
            'stationId': 'SELVN',
            'stationName': 'Selvin TS',
            'telecomPrimaryOrg': 'Indiana Michigan Power Company',
            'telecomBenefittingOrg': '170',
            'telecomPrimaryContact': 'CN=Christopher A Pozorski/OU=FW1/O=AEPIN',
            'telecomPrimaryContactPhone': '500-2274',
            'region': 'Eastern',
            'area': 'Fort Wayne',
            'telecomNpa': '812',
            'telecomNxx': '897',
            'telecomSiteType': 'Telecom Site',
            'telecomSiteAccess': 'gate, telecom key',
            'telecomPoliceDept': 'Warrick',
            'telecomPoliceDeptPhone': '812-897-6180 ',
            'telecomUtility': 'VECTREN',
            'telecomUtilityPhone': '1-800-227-1376',
            'streetAddress': 'Folsomville-Selvin Rd, 2mi SW of Selvin',
            'city': 'Tennyson',
            'state': 'IN',
            'zipcode': '47637',
            'country': 'US',
            'county': 'Warrick',
            'mailAddress': 'Folsomville-Selvin Rd, 2mi SW of Selvin',
            'mailCity': 'Tennyson',
            'mailState': 'IN',
            'mailZipCode': '47637',
            'topFloor': '0',
            'form': 'LocationDeleted'
        },
        {
            'stationId': 'ROSSI',
            'complex': 'ohrossimcts',
            'stationName': 'Ross IMC',
            'telecomPrimaryOrg': 'Ohio Power Company',
            'telecomBenefittingOrg': '250',
            'telecomPrimaryContact': 'CN=David R Leunissen/OU=OR2/O=AEPIN',
            'telecomPrimaryContactPhone': '966-4444',
            'region': 'Ohio',
            'area': 'Southern Ohio',
            'telecomSiteType': 'Telecom Site',
            'audinetNumber': '960-7182',
            'streetAddress': '701 Hardin Dr.',
            'city': 'Chillicothe',
            'state': 'OH',
            'zipcode': '45601',
            'country': 'US',
            'county': 'Ross',
            'mailAddress': '701 Hardin Dr.',
            'mailCity': 'Chillicothe',
            'mailState': 'OH',
            'mailZipCode': '45601',
            'topFloor': '0',
            'form': 'Location'
        },
        {
            'stationId': 'FOREM',
            'complex': 'arforemants',
            'stationName': 'Foreman TS',
            'telecomPrimaryOrg': 'Southwestern Electric Power Company',
            'telecomBenefittingOrg': '159',
            'telecomPrimaryContact': 'CN=Barbara M Martin/OU=CA1/O=AEPIN',
            'telecomPrimaryContactPhone': '748-5769',
            'region': 'SWEPCO',
            'area': 'Texarkana',
            'telecomSiteType': 'Telecom Site',
            'telecomLatitude': '33.74344444',
            'telecomLongitude': '-94.332',
            'telecomLandOwner': 'SEP',
            'telecomUtility': 'Southwest Arkansas Electric',
            'telecomUtilityPhone': '800-782-2743 or',
            'telecomCircuitFeeder': 'account# 12815200',
            'telecomDemarcLocation': 'No Telco Equipment inside Tower Site.',
            'streetAddress': 'Hwy 108',
            'city': 'Foreman',
            'state': 'AR',
            'zipcode': '71836',
            'country': 'US',
            'county': 'Little River',
            'mailAddress': 'Hwy 108',
            'mailCity': 'Foreman',
            'mailState': 'AR',
            'mailZipCode': '71836',
            'topFloor': '0',
            'form': 'Location'
        }
    ];

    var inMemoryRegions = [{'regionId':1,'regionName':'AP/KP'},{'regionId':2,'regionName':'Central'},{'regionId':3,'regionName':'Eastern'},{'regionId':4,'regionName':'IM'},{'regionId':5,'regionName':'Midwest'},{'regionId':6,'regionName':'Northern'},{'regionId':7,'regionName':'Ohio'},{'regionId':8,'regionName':'PSO'},{'regionId':9,'regionName':'Region Support'},{'regionId':10,'regionName':'SWEPCO'},{'regionId':11,'regionName':'Southern'},{'regionId':12,'regionName':'Southwest'},{'regionId':13,'regionName':'Texas'},{'regionId':14,'regionName':'Western'}];
    var inMemoryAreas = [{'areaId':1,'areaName':'AEPHQ'},{'areaId':2,'areaName':'Abilene'},{'areaId':3,'areaName':'Ashland'},{'areaId':4,'areaName':'Bluefield'},{'areaId':5,'areaName':'C3 Central'},{'areaId':6,'areaName':'C3 North'},{'areaId':7,'areaName':'C3 South'},{'areaId':8,'areaName':'Canton'},{'areaId':9,'areaName':'Charleston'},{'areaId':10,'areaName':'Coastal Texas'},{'areaId':11,'areaName':'Columbus'},{'areaId':12,'areaName':'Corpus Christi'},{'areaId':13,'areaName':'Dallas'},{'areaId':14,'areaName':'East Texas'},{'areaId':15,'areaName':'Fort Wayne'},{'areaId':16,'areaName':'Groveport'},{'areaId':17,'areaName':'Laredo'},{'areaId':18,'areaName':'Lawton'},{'areaId':19,'areaName':'Muncie'},{'areaId':20,'areaName':'Oklahoma'},{'areaId':21,'areaName':'Pharr'},{'areaId':22,'areaName':'Roanoke'},{'areaId':23,'areaName':'Shreveport'},{'areaId':24,'areaName':'South Bend'},{'areaId':25,'areaName':'Southern Ohio'},{'areaId':26,'areaName':'Texarkana'},{'areaId':27,'areaName':'Tulsa'}];

    var _getById = function(stationId) {
        var deferred = $.Deferred(),
                result = null,
                l = inMemoryStations.length,
                i;

        for (i = 0; i < l; i = i + 1) {
            if (inMemoryStations[i].stationId === stationId) {
                result = inMemoryStations[i];
                break;
            }
        }
        deferred.resolve(result);
        return deferred.promise();
    };

    var _getAll = function() {
        var deferred = $.Deferred();
        var results = {
            stations: inMemoryStations,
            regions: inMemoryRegions,
            areas: inMemoryAreas
        };
        deferred.resolve(results, 'success', null);
        return deferred.promise();
    };

    var stationService = {
        getById: function(stationId) {
            return _getById(stationId);
        },
        getAll: function() {
            return _getAll();
        }
    };

    return stationService;
});