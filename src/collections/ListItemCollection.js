define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        ListItemModel = require('models/ListItemModel');

    var ListItemCollection = Backbone.Collection.extend({
        model: ListItemModel
    });

    return ListItemCollection;
});