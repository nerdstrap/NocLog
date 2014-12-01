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
        initialize: function(options) {
            console.trace('PersonnelListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
        },
        render: function() {
            console.trace('PersonnelListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .personnel-link': 'goToPersonnel'
        },
        goToPersonnel: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var linkButton = $(event.target);
                if (linkButton) {
                    var userId = linkButton.data('user-id');
                    if (userId) {
                        this.dispatcher.trigger(AppEventNamesEnum.goToPersonnel, {userId: userId});
                    } else {
                        var userName = linkButton.data('user-name');
                        if (userName) {
                            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnel, {userName: userName});
                        }
                    }
                }
            }
        }
    });

    return PersonnelListItemView;

});