define(function(require) {
    'use strict';

    var module = require('module'),
            $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils'),
            helpers = require('handlebars.helpers'),
            CheckInTypeEnum = require('enums/CheckInTypeEnum');

    var StationEntryModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
        csvHeaders: function() {
            return ['stationEntryLogId', 'stationId', 'stationName', 'userId', 'userName', 'purpose', 'duration', 'inTime', 'expectedOutTime', 'outTime', 'actualDuration', 'contactNumber', 'email', 'regionName', 'areaName', 'hasCrew'];
        },
        toCsv: function() {
            var currentContext = this;
            var line = '';
            var csvHeaders = currentContext.csvHeaders();
            for (var i in csvHeaders) {
                var csvHeader = csvHeaders[i];
                var csvValue = '""';
                if (this.has(csvHeader)) {
                    var propertyValue = this.get(csvHeader);
                    if (propertyValue) {
                        csvValue = '"' + propertyValue.toString().replace(/"/g, '""') + '"';
                    }
                }
                line = line + csvValue + ',';
            }
            line = line.slice(0, -1);
            return line;
        },
        set: function(key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }
            
            if (attributes.hasOwnProperty('userId')) {
                var userId = attributes.userId;
                if (userId.length > 0) {
                    attributes.thirdParty = false;
                }
            }
            if (attributes.hasOwnProperty('companyName')) {
                var companyName = attributes.companyName;
                if (companyName.length > 0) {
                    attributes.thirdParty = true;
                }
            }
            if (attributes.hasOwnProperty('stationId')) {
                var stationId = attributes.stationId;
                if (stationId.length > 0) {
                    attributes.checkInType = CheckInTypeEnum.station;
                }else{
                    attributes.checkInType = CheckInTypeEnum.adHoc;                    
                }
            }

            var inTimeParsed = false;
            var durationParsed = false;
            if (attributes.hasOwnProperty('inTime')) {
                var inTime = attributes.inTime;
                if (inTime && !isNaN(inTime)) {
                    attributes.inTime = new Date(inTime);
                    inTimeParsed = true;
                }
            }

            if (attributes.hasOwnProperty('duration')) {
                var duration = attributes.duration;
                if (duration && !isNaN(duration)) {
                    attributes.duration = Number(duration);
                    durationParsed = true;
                }
            }

            if (inTimeParsed && durationParsed) {
                attributes.expectedOutTime = utils.addMinutes(attributes.inTime, attributes.duration);
            }

            var checkedOut = false;
            if (attributes.hasOwnProperty('outTime')) {
                var outTime = attributes.outTime;
                var inTime = attributes.inTime;
                if (outTime && !isNaN(outTime)) {
                    attributes.outTime = new Date(outTime);
                    attributes.actualDuration = (outTime - inTime);
                    checkedOut = true;
                }
            }
            attributes.checkedOut = checkedOut;

            if (checkedOut === false && attributes.expectedOutTime) {
                var expectedOutTimeElapsed = new Date() - attributes.expectedOutTime;
                if (expectedOutTimeElapsed >= env.getExpirationThreshold()) {
                    attributes.checkOutOverdue = true;
                } else if (expectedOutTimeElapsed > 0) {
                    attributes.checkOutExpired = true;
                }
            }

            if (attributes.hasOwnProperty('latitude')) {
                var latitude = attributes.latitude;
                if (latitude && !isNaN(latitude)) {
                    attributes.latitude = Number(latitude);
                }
            }else{
                attributes.latitude = null;
            }

            if (attributes.hasOwnProperty('longitude')) {
                var longitude = attributes.longitude;
                if (longitude && !isNaN(longitude)) {
                    attributes.longitude = Number(longitude);
                }
            }else{
                attributes.longitude = null;
            }

            if (attributes.hasOwnProperty('distanceInMiles')) {
                var distanceInMiles = attributes.distanceInMiles;
                if (distanceInMiles && !isNaN(distanceInMiles)) {
                    attributes.distanceInMiles = Number(distanceInMiles);
                }
            }

            if (attributes.hasOwnProperty('contactNumber')) {
                var cleanedPhone = helpers.cleanPhone(attributes.contactNumber);
                attributes.contactNumber = cleanedPhone;
            }

            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        validation: {
            userId: {
                required: function() {
                    return (this.get('thirdParty') !== true);
                }
            },
            companyName: {
                required: function() {
                    return (this.get('thirdParty') === true);
                }
            },
            firstName: {
                required: true,
                minLength: 1
            },
            lastName: {
                required: true,
                minLength: 1
            },
            contactNumber: {
                required: true,
                pattern: 'digits',
                minLength: 7,
                maxLength: 10
            },
            email: {
                required: function() {
                    return (this.get('thirdParty') !== true);
                },
                pattern: 'email'
            },
            stationId: {
                required: function() {
                    return (this.get('checkInType') === CheckInTypeEnum.station);
                }
            },
            purpose: {
                required: true,
                minLength: 1
            },
            duration: {
                required: true
            },
            dispatchCenterId: {
                required: true
            },
            description: {
                 required: function() {
                    return (this.get('checkInType') === CheckInTypeEnum.adHoc);
                }               
            },
            latitude: {
                pattern: 'number',
                required: false
            },
            longitude: {
                pattern: 'number',
                required: false
            }
        }
    });

    return StationEntryModel;
});