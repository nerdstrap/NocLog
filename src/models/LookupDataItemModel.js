define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var LookupDataItemModel = Backbone.Model.extend({
        idAttribute: 'lookupDataItemId',
        urlRoot: function () {
            return env.getApiUrl() + '/lookupDataItem';
        },
        getById: function(lookupDataItemId) {
            var currentContext = this;
            return $.ajax({
                contentType: 'application/json',
                data: $.param({
                    id: lookupDataItemId
                }),
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        }
    });

    return LookupDataItemModel;
});