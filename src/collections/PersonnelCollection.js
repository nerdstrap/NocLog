define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            PersonnelModel = require('models/PersonnelModel');

    var simpleComparator = function(a, b, sortDirection) {
        if (sortDirection !== 1) {
            return (a === b) ? 0 : (a < b) ? 1 : -1;
        } else {
            return (a === b) ? 0 : (a > b) ? 1 : -1;
        }
    };

    var PersonnelCollection = Backbone.Collection.extend({
        model: PersonnelModel,
        initialize: function(options) {
            options || (options = {});
            this.sortAttribute = options.sortAttribute || 'userName';
            this.sortDirection = options.sortDirection || 1;
        },
        setSortAttribute: function(sortAttribute, sortDirection) {
            this.sortAttribute = sortAttribute;
            this.sortDirection = sortDirection || 1;
        },
        comparator: function(a, b) {
            var currentContext = this;
            return simpleComparator(a.get(currentContext.sortAttribute), b.get(currentContext.sortAttribute), currentContext.sortDirection);

        }
    });

    return PersonnelCollection;
});