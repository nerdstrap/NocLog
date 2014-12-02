define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            globals = require('globals'),
            env = require('env'),
            template = require('hbs!templates/Alert');

    var AlertView = CompositeView.extend({
        initialize: function(options) {
            console.trace('AlertView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.dismissAlertDelay = env.getNotificationTimeout();

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('AlertView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            
            currentContext.timeoutId = globals.window.setTimeout(function() {
                currentContext.dismissAlert();
            }, currentContext.dismissAlertDelay);

            return this;
        },
        events: {
            'click .close-alert-button': 'closeAlert'
        },
        closeAlert: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.leave();
        },
        dismissAlert: function() {
            this.leave();
        },
        onLeave: function() {
            if (this.timeoutId) {
                globals.window.clearTimeout(this.timeoutId);
            }
        }
    });

    return AlertView;

});