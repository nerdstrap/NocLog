define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var StationWarningModel = Backbone.Model.extend({
        idAttribute: 'stationWarningId',
        validation: {
//            userId: {
//                required: true,
//                pattern: /^[a-zA-Z0-9]*/,
//                minLength: 7,
//                maxLength: 10
//            }
        }
    });

    return StationWarningModel;
});