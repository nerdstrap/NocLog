define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        PersonnelModel = require('models/PersonnelModel'),
        env = require('env');

    var PersonnelCollection = Backbone.Collection.extend({
        model: PersonnelModel,
        url: function () {
            return env.getApiUrl() + '/personnel';
        },
        sync: function(method, model, options) {
            console.trace('Backbone.sync methods have been disabled.');
        },
        getPersonnel: function () {
            var currentContext = this;

            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url() + '/find'
            });
        }
    });

    return PersonnelCollection;
});