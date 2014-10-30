define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var LookupDataItemModel = Backbone.Model.extend({
        idAttribute: 'lookupDataItemId'
    });

    return LookupDataItemModel;
});