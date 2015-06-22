define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseSingletonView = require('views/BaseSingletonView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/ConfirmWarningListItem');

    var ConfirmWarningListItemView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('ConfirmWarningListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('ConfirmWarningListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .confirm-warning-button': 'confirmWarning',
            'click .clear-warning-button': 'clearWarning',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        confirmWarning: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.model.set({'confirmed': true});
            this.$('.confirm-warning-button').addClass('success').children('i').removeClass('fa-question').addClass('fa-check');
        },
        clearWarning: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.clearWarning, this.model);
        },
        onClearWarningSuccess: function(stationWarningModel) {
            this.hideLoading();
            appEvents.trigger(AppEventNamesEnum.clearWarningSuccess, stationWarningModel);
            this.leave();
        },
        onClearWarningError: function(message) {
            this.hideLoading();
            this.showError(message);
        }
    });

    return ConfirmWarningListItemView;

});