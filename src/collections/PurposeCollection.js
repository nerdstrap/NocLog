define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        PurposeModel = require('models/PurposeModel');

    var PurposeCollection = Backbone.Collection.extend({
        model: PurposeModel
    });

    return PurposeCollection;
});