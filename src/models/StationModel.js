define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        env = require('env');

    var StationModel = Backbone.Model.extend({
        idAttribute: 'stationId',
        urlRoot: function () {
            return env.getApiUrl() + '/station';
        },
        getStationById: function(stationId) {
            var currentContext = this;
            return $.ajax({
                contentType: 'application/json',
                data: $.param({
                    id: stationId
                }),
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        }
    });

    return StationModel;
});