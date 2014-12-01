define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var PurposeModel = Backbone.Model.extend({
        idAttribute: 'lookupDataItemId',
        validation: {
            itemText: {
                required: true
            },
            itemDescription: {
                required: true
            },
            itemValue: {
                required: true
            },
            itemEnabled: {
                required: true
            },
            itemAdditionalData: {
                required: true
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