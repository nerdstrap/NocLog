define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseSingletonView = require('views/BaseSingletonView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/ClearWarningListItem');

    var ClearWarningListItemView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('ClearWarningListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.model, AppEventNamesEnum.clearWarningSuccess, this.onClearWarningSuccess);
            this.listenTo(this.model, AppEventNamesEnum.clearWarningError, this.onClearWarningError);
        },
        render: function() {
            console.trace('ClearWarningListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .clear-warning-button': 'clearWarning',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        updateModelFromView: function(){
            this.model.set({'lastModifiedBy': this.parentModel.get('userName')});
        },
        updateViewFromModel: function(){
            if (this.model.has('lastConfirmedBy') && this.model.get('lastConfirmedBy')) {
                this.$('#last-confirmed-by-container').removeClass('hidden');
            } else {
                this.$('#last-confirmed-by-container').addClass('hidden');
            }
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

    return ClearWarningListItemView;

});