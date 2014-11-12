define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var PurposeModel = Backbone.Model.extend({
        idAttribute: 'lookupDataItemId',
        validation: {
            itemDescription: {
                required: true
            },
            itemValue: {
                required: true
            },
            itemEnabled: {
                required: true,
                length: 1
            },
            itemOrder: {
                required: true,
                pattern: 'digits'
            },
            itemType: {
                required: true
            }
        }
    });

    return PurposeModel;
});