define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var NewStationEntryLogModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
        validation: {
            stationId: {
                required: true
            },
            contactNumber: {
                required: true,
                pattern: 'digits',
                length: 10
            },
            purpose: {
                required: true
            },
            duration: {
                required: true
            },
            dispatchCenterId: {
                required: true
            },
            otherPurpose: {
                required: function() {
                    return (this.get('purpose') === 'Other');
                }
            }
        }
    });

    return NewStationEntryLogModel;
});