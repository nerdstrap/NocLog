define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        LookupDataItemModel = require('models/LookupDataItemModel'),
        env = require('env');

    var LookupDataItemCollection = Backbone.Collection.extend({
        model: LookupDataItemModel,
        url: function () {
            return env.getApiUrl() + '/lookupDataItem';
        },
        sync: function(method, model, options) {
            console.trace('Backbone.sync methods have been disabled.');
        },
        getLookupDataItems: function (options) {
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
        },
        getNewStationEntryLogOptions: function (options) {
            var currentContext = this;

            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url() + '/find/newStationEntryLogOptions'
            });
        }
    });

    return LookupDataItemCollection;
});