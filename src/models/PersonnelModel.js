define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var PersonnelModel = Backbone.Model.extend({
        idAttribute: 'userId',
        urlRoot: function() {
            return env.getApiUrl() + '/personnel';
        },
        sync: function(method, model, options) {
            console.trace('Backbone.sync methods have been disabled.');
        },
        getPersonnelByUserId: function(options) {
            var currentContext = this;

            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url() + '/find'
            });
        }
    });

    return PersonnelModel;
});