define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var NewStationEntryLogModel = Backbone.Model.extend({
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
        }
    });

    return NewStationEntryLogModel;
});