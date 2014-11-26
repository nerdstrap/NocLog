define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/PersonnelListItem');

    var PersonnelListItemView = CompositeView.extend({
        tagName: 'li',
        initialize: function(options) {
            console.trace('PersonnelListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function() {
            console.trace('PersonnelListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .personnel-name-link': 'goToPersonnelWithId'
        },
        goToPersonnelWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var userId = this.model.get('userId');
            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnelWithId, userId);
        }
    });

    return PersonnelListItemView;

});