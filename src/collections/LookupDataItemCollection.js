define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        LookupDataItemModel = require('models/LookupDataItemModel');

    var LookupDataItemCollection = Backbone.Collection.extend({
        model: LookupDataItemModel
    });

    return LookupDataItemCollection;
});