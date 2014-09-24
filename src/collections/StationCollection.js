define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationModel = require('models/StationModel'),
            env = require('env');

    var StationCollection = Backbone.Collection.extend({
        model: StationModel,
        sortAttributes: [
            'stationName'
        ],
        sortDirection: 1,
        sortableFields: [
            {
                sortAttribute: 'stationName',
                comparator: function(a, b) {
                    return (a === b) ? 0 : (a > b) ? 1 : -1;
                }
            },
            {
                sortAttribute: 'region',
                comparator: function(a, b, sortDirection) {
                    if (sortDirection === 1) {
                        return (a === b) ? 0 : (a > b) ? 1 : -1;
                    } else {
                        return (a === b) ? 0 : (a < b) ? 1 : -1;
                    }
                }
            },
            {
                sortAttribute: 'area',
                comparator: function(a, b, sortDirection) {
                    if (sortDirection === 1) {
                        return (a === b) ? 0 : (a > b) ? 1 : -1;
                    } else {
                        return (a === b) ? 0 : (a < b) ? 1 : -1;
                    }
                }
            }
        ],
        url: function() {
            return env.getApiUrl() + '/station';
        },
        comparator: function(a, b) {
            var currentContext = this;
            var i, result = 0;
            for (i in currentContext.sortAttributes) {
                var sortAttribute = currentContext.sortAttributes[i];
                var sortableField = _.find(currentContext.sortableFields, function(s){ return s.sortAttribute === sortAttribute; });
                if (sortableField) {
                    result = sortableField.comparator(a.get(sortAttribute), b.get(sortAttribute), currentContext.sortDirection);
                }
                if (result !== 0) {
                    return result; // on inequality we return right away
                }
                // else continue, delegating comparison to next field/comparator
            }

            // When the loop is done, or if fields was defined empty, we return the last equality
            return result;
        },
        getStations: function(options) {
            var currentContext = this;

            var data;
            if (options) {
                data = $.param({
                    regionname: options.region,
                    areaname: options.area
                });
            }

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        }
    });
    return StationCollection;
});
