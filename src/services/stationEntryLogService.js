define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var inMemoryStationEntryLogs = [
        {
            'stationEntryLogId': 20,
            'stationId': 'COLUS',
            'userName': 'CheckOut, CheckIn',
            'firstName': 'CheckIn',
            'lastName': 'CheckOut',
            'outsideId': 's210749',
            'purpose': 'Battery Inspection',
            'inTime': 1409155717114,
            'outTime': 1409156265536,
            'hasCrew': 'N',
            'contact': '9-1-6147163015',
            'duration': 30,
            'stationName': 'Columbus POP'
        },
        {
            'stationEntryLogId': 78,
            'stationId': 'COLUS',
            'userName': 'Walden, Heather',
            'firstName': 'Heather',
            'lastName': 'Walden',
            'middleName': 'M',
            'outsideId': 'S253769',
            'purpose': 'Antenna Maintenance',
            'inTime': 1409767944829,
            'outTime': 1409767976204,
            'hasCrew': 'N',
            'contact': '9-1-6145622909',
            'duration': 90,
            'stationName': 'Columbus POP'
        },
        {
            'stationEntryLogId': 80,
            'stationId': 'COLUS',
            'userName': 'CheckOut, CheckIn',
            'firstName': 'CheckIn',
            'lastName': 'CheckOut',
            'outsideId': 's210749',
            'purpose': 'Battery Inspection',
            'inTime': 1409772952690,
            'outTime': 1409840588960,
            'hasCrew': 'N',
            'contact': '9-1-6147163015',
            'duration': 120,
            'stationName': 'Columbus POP'
        },
        {
            'stationEntryLogId': 74,
            'stationId': 'COLUS',
            'userName': 'Walden, Heather',
            'firstName': 'Heather',
            'lastName': 'Walden',
            'middleName': 'M',
            'outsideId': 'S253769',
            'purpose': 'Antenna Maintenance',
            'inTime': 1409759613916,
            'outTime': 1409760651849,
            'hasCrew': 'N',
            'contact': '9-1-6145622909',
            'duration': 150,
            'stationName': 'Columbus POP'
        },
        {
            'stationEntryLogId': 73,
            'stationId': 'COLUS',
            'userName': 'Shu, Shujing',
            'firstName': 'Shujing',
            'lastName': 'Shu',
            'outsideId': 'S210749',
            'purpose': 'Generator Maintenance',
            'inTime': 1409751759451,
            'outTime': 1409755879033,
            'hasCrew': 'N',
            'contact': '9-1-6147163015',
            'duration': 180,
            'stationName': 'Columbus POP'
        },
        {
            'stationEntryLogId': 72,
            'stationId': 'COLUS',
            'userName': 'Shu, Shujing',
            'firstName': 'Shujing',
            'lastName': 'Shu',
            'outsideId': 'S210749',
            'purpose': 'Charger&#x2f;AC Maintenance',
            'inTime': 1409751701218,
            'outTime': 1409751706607,
            'hasCrew': 'N',
            'contact': '9-1-6147163015',
            'duration': 180,
            'stationName': 'Columbus POP'
        },
        {
            'stationEntryLogId': 51,
            'stationId': 'COLUS',
            'userName': 'CheckOut, CheckIn',
            'firstName': 'CheckIn',
            'lastName': 'CheckOut',
            'outsideId': 's210749',
            'purpose': 'Battery Maintenance',
            'inTime': 1409323526829,
            'outTime': 1409323571678,
            'hasCrew': 'N',
            'contact': '9-1-6147163015',
            'duration': 180,
            'stationName': 'Columbus POP'
        },
        {
            'stationEntryLogId': 52,
            'stationId': 'COLUS',
            'userName': 'CheckOut, CheckIn',
            'firstName': 'CheckIn',
            'lastName': 'CheckOut',
            'outsideId': 's210749',
            'purpose': 'Battery Maintenance',
            'inTime': 1409323588701,
            'hasCrew': 'N',
            'contact': '9-1-6147163015',
            'duration': 180,
            'stationName': 'Columbus POP'
        },
        {
            'stationEntryLogId': 43,
            'stationId': 'COLUS',
            'userName': 'CheckOut, CheckIn',
            'firstName': 'CheckIn',
            'lastName': 'CheckOut',
            'outsideId': 's210749',
            'purpose': 'Battery Inspection',
            'inTime': 1409321805499,
            'hasCrew': 'N',
            'contact': '9-1-6147163015',
            'duration': 120,
            'stationName': 'Columbus POP'
        }
    ];

    var inMemoryRegions = [
        {
            'regionId': 1,
            'regionName': 'AP/KP'
        },
        {
            'regionId': 2,
            'regionName': 'Central'
        },
        {
            'regionId': 3,
            'regionName': 'Eastern'
        },
        {
            'regionId': 4,
            'regionName': 'IM'
        },
        {
            'regionId': 5,
            'regionName': 'Midwest'
        },
        {
            'regionId': 6,
            'regionName': 'Northern'
        },
        {
            'regionId': 7,
            'regionName': 'Ohio'
        },
        {
            'regionId': 8,
            'regionName': 'PSO'
        },
        {
            'regionId': 9,
            'regionName': 'Region Support'
        },
        {
            'regionId': 10,
            'regionName': 'SWEPCO'
        },
        {
            'regionId': 11,
            'regionName': 'Southern'
        },
        {
            'regionId': 12,
            'regionName': 'Southwest'
        },
        {
            'regionId': 13,
            'regionName': 'Texas'
        },
        {
            'regionId': 14,
            'regionName': 'Western'
        }
    ];

    var inMemoryAreas = [
        {
        'areaId': 1,
        'areaName': 'AEPHQ'
        },
        {
            'areaId': 2,
            'areaName': 'Abilene'
        },
        {
            'areaId': 3,
            'areaName': 'Ashland'
        },
        {
            'areaId': 4,
            'areaName': 'Bluefield'
        },
        {
            'areaId': 5,
            'areaName': 'C3 Central'
        },
        {
            'areaId': 6,
            'areaName': 'C3 North'
        },
        {
            'areaId': 7,
            'areaName': 'C3 South'
        },
        {
            'areaId': 8,
            'areaName': 'Canton'
        },
        {
            'areaId': 9,
            'areaName': 'Charleston'
        },
        {
            'areaId': 10,
            'areaName': 'Coastal Texas'
        },
        {
            'areaId': 11,
            'areaName': 'Columbus'
        },
        {
            'areaId': 12,
            'areaName': 'Corpus Christi'
        },
        {
            'areaId': 13,
            'areaName': 'Dallas'
        },
        {
            'areaId': 14,
            'areaName': 'East Texas'
        },
        {
            'areaId': 15,
            'areaName': 'Fort Wayne'
        },
        {
            'areaId': 16,
            'areaName': 'Groveport'
        },
        {
            'areaId': 17,
            'areaName': 'Laredo'
        },
        {
            'areaId': 18,
            'areaName': 'Lawton'
        },
        {
            'areaId': 19,
            'areaName': 'Muncie'
        },
        {
            'areaId': 20,
            'areaName': 'Oklahoma'
        },
        {
            'areaId': 21,
            'areaName': 'Pharr'
        },
        {
            'areaId': 22,
            'areaName': 'Roanoke'
        },
        {
            'areaId': 23,
            'areaName': 'Shreveport'
        },
        {
            'areaId': 24,
            'areaName': 'South Bend'
        },
        {
            'areaId': 25,
            'areaName': 'Southern Ohio'
        },
        {
            'areaId': 26,
            'areaName': 'Texarkana'
        },
        {
            'areaId': 27,
            'areaName': 'Tulsa'
        }
    ];

    var _getById = function (stationEntryLogId) {
        var deferred = $.Deferred(),
                result = null,
                l = inMemoryStationEntryLogs.length,
                i;

        for (i = 0; i < l; i = i + 1) {
            if (inMemoryStationEntryLogs[i].stationEntryLogId === stationEntryLogId) {
                result = inMemoryStationEntryLogs[i];
                break;
            }
        }
        deferred.resolve(result);
        return deferred.promise();
    };

    var _getAll = function () {
        var deferred = $.Deferred(),
                results = inMemoryStationEntryLogs;
        deferred.resolve(results, 'success', null);
        return deferred.promise();
    };

    var _getOpen = function () {
        var deferred = $.Deferred(),
                results = inMemoryStationEntryLogs.filter(function (stationEntryLog) {
                    return stationEntryLog.outTime !== undefined;
                });
        deferred.resolve(results);
        return deferred.promise();
    };

    var _getExpired = function () {
        var deferred = $.Deferred(),
                results = inMemoryStationEntryLogs;
        deferred.resolve(results, 'success', null);
        return deferred.promise();
    };

    var stationEntryLogService = {
        getById: function (stationEntryLogId) {
            return _getById(stationEntryLogId);
        },
        getAll: function () {
            return _getAll();
        },
        getOpen: function () {
            return _getOpen();
        },
        getExpired: function () {
            return _getExpired();
        }
    };

    return stationEntryLogService;
});