define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        HeaderView = require('views/HeaderView'),
        FooterView = require('views/FooterView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        appEvents = require('events'),
        template = require('hbs!templates/Shell');

    var ShellView = CompositeView.extend({
        initialize: function (options) {
            console.trace('ShellView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function () {
            console.trace('ShellView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            var headerViewInstance = new HeaderView({
                model: currentContext.model,
                el: $('#header-view', currentContext.$el),
                dispatcher: currentContext.dispatcher
            });
            this.renderChild(headerViewInstance);

            var footerViewInstance = new FooterView({
                model: currentContext.model,
                el: $('#footer-view', currentContext.$el),
                dispatcher: currentContext.dispatcher
            });
            this.renderChild(footerViewInstance);

            return this;
        },
        contentViewEl: function () {
            return $('#content-view', this.el);
        }
    });

    return ShellView;
});