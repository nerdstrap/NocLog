define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationWarningModel = require('models/StationWarningModel'),
            utils = require('utils');

    var StationWarningCollection = Backbone.Collection.extend({
        model: StationWarningModel,
        initialize: function(options) {
            options || (options = {});
        }
    });
    return StationWarningCollection;
});
