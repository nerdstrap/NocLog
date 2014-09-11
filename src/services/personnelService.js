define(function(require) {
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

    var _getById = function(stationEntryLogId) {
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
    
    var _getAll = function() {
        var deferred = $.Deferred(),
                results = inMemoryStationEntryLogs;
        deferred.resolve(results, 'success', null);
        return deferred.promise();
    };
    
    var _getOpen = function() {
        var deferred = $.Deferred(),
                results = inMemoryStationEntryLogs.filter(function(stationEntryLog) {
                    return stationEntryLog.outTime !== undefined;
                });
        deferred.resolve(results);
        return deferred.promise();
    };
    
    var _getExpired = function() {
        var deferred = $.Deferred(),
                results = inMemoryStationEntryLogs;
        deferred.resolve(results, 'success', null);
        return deferred.promise();
    };
    
    var stationEntryLogService = {
        getById: function(stationEntryLogId) {
            return _getById(stationEntryLogId);
        },
        getAll: function() {
            return _getAll();
        },
        getOpen: function() {
            return _getOpen();
        },
        getExpired: function() {
            return _getExpired();
        }
    };

    return stationEntryLogService;
});