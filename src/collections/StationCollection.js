define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationModel = require('models/StationModel'),
            utils = require('utils');

    var StationCollection = Backbone.Collection.extend({
        model: StationModel,
        initialize: function(options) {
            options || (options = {});
            this.sortAttribute = options.sortAttribute || 'stationName';
            this.sortDirection = options.sortDirection || 1;
        },
        setSortAttribute: function(sortAttribute, sortDirection) {
            this.sortAttribute = sortAttribute;
            this.sortDirection = sortDirection || 1;
        },
        comparator: function(a, b) {
            var currentContext = this;
            return utils.simpleComparator(a.get(currentContext.sortAttribute), b.get(currentContext.sortAttribute), currentContext.sortDirection);

        }
    });
    return StationCollection;
});
