define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            env = require('env'),
            utils = require('utils');

    var NewStationEntryLogModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
        validation: {
            userId: {
                required: true,
                minLength: 1
            },
            firstName: {
                required: true
            },
//            middleInitial: {
//                required: true
//            },
            lastName: {
                required: true
            },
            contactNumber: {
                required: true,
                pattern: 'digits',
                length: 10
            },
            email: {
                required: true,
                pattern: 'email'
            },
            stationId: {
                required: true,
                minLength: 1
            },
            purpose: {
                required: true,
                minLength: 1
            },
            duration: {
                required: true,
                minLength: 1
            },
            dispatchCenterId: {
                required: true
            },
            purposeOther: {
                required: function() {
                    return (this.get('purpose') === 'Other');
                }
            }
        },
        sync: function(method, model, options) {
            console.trace('Backbone.sync methods have been disabled.');
        }
    });

    return NewStationEntryLogModel;
});