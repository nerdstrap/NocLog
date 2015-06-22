define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var EntryLogExclusionModel = Backbone.Model.extend({
        idAttribute: 'userId',
        validation: {
            userId: {
                required: true,
                pattern: /^[a-zA-Z0-9]*/,
                minLength: 7,
                maxLength: 10
            }
        }
    });

    return EntryLogExclusionModel;
});