define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            BaseSingletonView = require('views/BaseSingletonView'),
            globals = require('globals'),
            env = require('env'),
            utils = require('utils'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/AddExclusionListItem'),
            alertTemplate = require('hbs!templates/Alert');

    var AddExclusionListView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('AddExclusionListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.model, AppEventNamesEnum.addExclusionSuccess, this.onAddExclusionSuccess);
            this.listenTo(this.model, AppEventNamesEnum.addExclusionError, this.onAddExclusionError);
        },
        render: function() {
            console.trace('AddExclusionListView.render()');
            var currentContext = this;

            validation.unbind(currentContext);

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            currentContext.updateViewFromModel();

            validation.bind(this, {
                selector: 'name'
            });

            return this;
        },
        events: {
            'click .add-entry-log-exclusion-button': 'validateAndSubmitExclusion',
            'click .reset-add-entry-log-exclusion-button': 'revertChanges',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        validateAndSubmitExclusion: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.getExclusionModelFromView();
            this.model.validate();
        },
        updateViewFromModel: function() {
            var currentContext = this;
            if (currentContext.model.has('userId')) {
                currentContext.$('.exclusion-user-id-input').val(currentContext.model.get('userId').toString());
            } else {
                currentContext.$('.exclusion-user-id-input').val('');
            }
            this.hideLoading();
        },
        getExclusionModelFromView: function() {
            var currentContext = this;
            if (currentContext.$('.exclusion-user-id-input').val() !== currentContext.model.get('userId')) {
                var userId = currentContext.$('.exclusion-user-id-input').val();
                currentContext.model.set({
                    userId: userId
                });
            }
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                if (this.model.has('userId') && this.model.get('userId')) {
                    this.addExclusion();
                }
            } else {
                var message = utils.getResource('validationErrorMessage');
                this.showError(message);
            }
        },
        revertChanges: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.$('.exclusion-user-id-input').val('').removeClass('invalid');
            currentContext.model.unset('userId');
        },
        addExclusion: function() {
            this.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.addExclusion, this.model);
        },
        onAddExclusionSuccess: function(entryLogExclusionModel) {
            this.hideLoading();
            appEvents.trigger(AppEventNamesEnum.addExclusionSuccess, entryLogExclusionModel);
            this.leave();
        },
        onAddExclusionError: function(message) {
            this.hideLoading();
            this.showError(message);
        }
    });

    return AddExclusionListView;

});