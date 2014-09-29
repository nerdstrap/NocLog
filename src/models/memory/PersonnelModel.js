define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var StationEntryModel = Backbone.Model.extend({
        idAttribute: 'personnelId',
        urlRoot: function () {
            return env.getApiUrl() + '/personnel';
        },
        getPersonnelById: function(personnelId) {
            var currentContext = this;
            return $.ajax({
                contentType: 'application/json',
                data: $.param({
                    id: personnelId
                }),
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        }
    });

    return StationEntryModel;
});