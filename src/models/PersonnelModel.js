define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var PersonnelModel = Backbone.Model.extend({
        idAttribute: 'userId'
    });

    return PersonnelModel;
});