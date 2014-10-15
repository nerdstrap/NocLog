define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var PersonnelModel = Backbone.Model.extend({
        idAttribute: 'outsideId',
        urlRoot: function () {
            return env.getApiUrl() + '/personnel';
        },
        getPersonnelById: function(outsideId) {
            var currentContext = this;
            
            return $.ajax({
                contentType: 'application/json',
                data: $.param({
                    outsideid: outsideId
                }),
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        }
    });

    return PersonnelModel;
});