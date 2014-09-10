define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        appEvents = require('events'),
        appResources = require('resources'),
        template = require('hbs!templates/Header');

    var HeaderView = CompositeView.extend({
        resources: function (culture) {
            return {
                'appTitleButtonText': appResources.getResource('appTitleButtonText').value
            };
        },
        initialize: function (options) {
            console.trace('HeaderView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        events: {
            'click #app-title-button': 'titleButtonClick'
        },
        render: function () {
            console.trace('HeaderView.render');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        titleButtonClick: function (event) {
            if (event) {
                event.preventDefault();
            }
        }
    });

    return HeaderView;
});