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
        getPersonnel: function () {
            var currentContext = this;

            return $.ajax({
                contentType: 'application/json',
                dataType: 'json',
                type: "GET",
                url: currentContext.url()
            });
        }
    });

    return PersonnelCollection;
});