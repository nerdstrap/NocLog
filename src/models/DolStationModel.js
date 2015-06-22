define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        env = require('env');

    var DolStationModel = Backbone.Model.extend({
        idAttribute: 'stationId',
        set: function (key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }

            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return DolStationModel;
});