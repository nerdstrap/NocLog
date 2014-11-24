define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        appEvents = require('events'),
        template = require('hbs!templates/Footer');

    var FooterView = CompositeView.extend({
        initialize: function (options) {
            console.trace('FooterView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function () {
            console.trace('FooterView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        }
    });

    return FooterView;

});