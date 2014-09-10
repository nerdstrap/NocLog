define(function(require) {
    'use strict';

    var _ = require('underscore'),
        Backbone = require('backbone');

    var Events = function(options) {
        console.trace('new Events()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(Events.prototype, Backbone.Events, {
        initialize: function(options) {
            console.trace('Events.initialize');
            options || (options = {});
        }
    });

    var events = new Events();

    return events;
});