define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var MockLookupDataItemCollection = Backbone.Collection.extend({
        initialize: function() {
            this.reset = jasmine.createSpy();
        }
    });

    return MockLookupDataItemCollection;
});