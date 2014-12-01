define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationEntryLogModel = require('models/StationEntryLogModel');

    var simpleComparator = function(a, b, sortDirection) {
        if (sortDirection !== 1) {
            return (a === b) ? 0 : (a < b) ? 1 : -1;
        } else {
            return (a === b) ? 0 : (a > b) ? 1 : -1;
        }
    };

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
            return simpleComparator(a.get(currentContext.sortAttribute), b.get(currentContext.sortAttribute), currentContext.sortDirection);

        },
        toCsv: function() {
            var currentContext = this;
            var line = '';
            if (currentContext.length > 0) {
                var csvHeaders = currentContext.at(0).csvHeaders();
                for (var i in csvHeaders) {
                    var csvHeader = csvHeaders[i];
                    line = line + csvHeader + ',';
                }
                line = line.slice(0, -1);
                line = line + '\r\n';

                _.each(currentContext.models, function(model, index, list) {
                    line = line + model.toCsv();
                    line = line + '\r\n';
                });
            }

            return line;
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