define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        EntryLogExclusionModel = require('models/EntryLogExclusionModel');

    var EntryLogExclusionCollection = Backbone.Collection.extend({
        model: EntryLogExclusionModel
    });

    return EntryLogExclusionCollection;
});