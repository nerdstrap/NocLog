define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationModel = require('models/StationModel');

    var simpleComparator = function(a, b, sortDirection) {
        if (sortDirection !== 1) {
            return (a === b) ? 0 : (a < b) ? 1 : -1;
        } else {
            return (a === b) ? 0 : (a > b) ? 1 : -1;
        }
    };

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
        setSecondarySortAttribute: function(sortAttribute, sortDirection) {
            this.secondarySortAttribute = sortAttribute;
            this.secondarySortDirection = sortDirection || 1;
        },
        comparator: function(a, b) {
            var currentContext = this;
            var result = simpleComparator(a.get(currentContext.sortAttribute), b.get(currentContext.sortAttribute), currentContext.sortDirection);
            if (result === 0 && currentContext.secondarySortAttribute) {
                result = simpleComparator(a.get(currentContext.secondarySortAttribute), b.get(currentContext.secondarySortAttribute), currentContext.secondarySortDirection);
            }
            return result;
        }
    });
    return StationCollection;
});
