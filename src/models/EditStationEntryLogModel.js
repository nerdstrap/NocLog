define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var EditStationEntryLogModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
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
                required: true
            },
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
            }
        }
    });

    return EditStationEntryLogModel;
});