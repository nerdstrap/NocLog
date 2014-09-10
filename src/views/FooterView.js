define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        appEvents = require('events'),
        appResources = require('resources'),
        template = require('hbs!templates/Footer');

    var FooterView = CompositeView.extend({
        resources: function (culture) {
            return {
                'logoImageSrc': appResources.getResource('logoImageSrc').value,
                'logoImageSvgSrc': appResources.getResource('logoImageSvgSrc').value,
                'logoImageAlt': appResources.getResource('logoImageAlt').value
            };
        },
        initialize: function (options) {
            console.trace('FooterView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function () {
            console.trace('FooterView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, this.resources(), this.model);
            this.$el.html(template(renderModel));

            return this;
        }
    });

    return FooterView;

});