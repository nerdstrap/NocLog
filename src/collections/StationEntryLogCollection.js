define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationEntryLogModel = require('models/StationEntryLogModel');

    var simpleComparator = function(a, b, sortDirection) {
        if (sortDirection === 1) {
            return (a === b) ? 0 : (a > b) ? 1 : -1;
        } else {
            return (a === b) ? 0 : (a < b) ? 1 : -1;
        }
    };

    var StationEntryLogCollection = Backbone.Collection.extend({
        model: StationEntryLogModel,
        sortAttributes: [
            {
                sortAttribute: 'expectedOutTime',
                sortDirection: 1
            }
        ],
        sortableFields: [
            {
                sortAttribute: 'stationName',
                comparator: simpleComparator
            },
            {
                sortAttribute: 'userName',
                comparator: simpleComparator
            },
            {
                sortAttribute: 'outTime',
                comparator: simpleComparator
            },
            {
                sortAttribute: 'expectedOutTime',
                comparator: simpleComparator
            },
            {
                sortAttribute: 'regionName',
                comparator: simpleComparator
            },
            {
                sortAttribute: 'areaName',
                comparator: simpleComparator
            }
        ],
        comparator: function(a, b) {
            var currentContext = this;
            var i, result = 0;
            for (i in currentContext.sortAttributes) {
                var sortAttribute = currentContext.sortAttributes[i].sortAttribute;
                var sortDirection = currentContext.sortAttributes[i].sortDirection;
                var sortableField = _.find(currentContext.sortableFields, function(s) {
                    return s.sortAttribute === sortAttribute;
                });
                if (sortableField) {
                    result = sortableField.comparator(a.get(sortAttribute), b.get(sortAttribute), sortDirection);
                }
                if (result !== 0) {
                    return result; // on inequality we return right away
                }
                // else continue, delegating comparison to next field/comparator
            }

            // When the loop is done, or if fields was defined empty, we return the last equality
            return result;
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
        }
    });

    return StationEntryLogCollection;
});