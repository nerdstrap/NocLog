define(function(require) {
    'use strict';

     var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var MockDispatcher = function(options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(MockDispatcher.prototype, Backbone.Events, {
        initialize: function(options) {
            options || (options = {});
            this.trigger = jasmine.createSpy();
        }
    });
    
    return MockDispatcher;
});