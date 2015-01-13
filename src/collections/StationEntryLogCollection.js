define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            utils = require('utils');

    var StationEntryLogCollection = Backbone.Collection.extend({
        model: StationEntryLogModel,
        initialize: function(options) {
            options || (options = {});
            this.sortAttribute = options.sortAttribute || 'expectedOutTime';
            this.sortDirection = options.sortDirection || 1;
            this.listenTo(this, 'add', this.onAdd);
            this.listenTo(this, 'remove', this.onRemove);
            this.listenTo(this, 'reset', this.onReset);
        },
        setSortAttribute: function(sortAttribute, sortDirection) {
            this.sortAttribute = sortAttribute;
            this.sortDirection = sortDirection || 1;
        },
        comparator: function(a, b) {
            var currentContext = this;
            return utils.simpleComparator(a.get(currentContext.sortAttribute), b.get(currentContext.sortAttribute), currentContext.sortDirection);

        },
        onAdd: function(model, collection, options) {
            this.setCounts(collection);
        },
        onRemove: function(model, collection, options) {
            this.setCounts(collection);
        },
        onReset: function(collection, response, options) {
            this.setCounts(collection);
        },
        setCounts: function(collection) {
            this.overdueCount = collection.where({checkOutOverdue: true}).length;
            this.expiredCount = collection.where({checkOutExpired: true}).length;
            this.openCount = collection.length - this.expiredCount - this.overdueCount;
        }
    });

    return StationEntryLogCollection;
});