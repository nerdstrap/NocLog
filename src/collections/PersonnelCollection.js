define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            PersonnelModel = require('models/PersonnelModel'),
            utils = require('utils');

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
            return utils.simpleComparator(a.get(currentContext.sortAttribute), b.get(currentContext.sortAttribute), currentContext.sortDirection);

        }
    });

    return PersonnelCollection;
});