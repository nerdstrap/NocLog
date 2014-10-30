define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        PersonnelModel = require('models/PersonnelModel');

    var PersonnelCollection = Backbone.Collection.extend({
        model: PersonnelModel
    });

    return PersonnelCollection;
});