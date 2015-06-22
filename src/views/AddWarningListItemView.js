define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            BaseSingletonView = require('views/BaseSingletonView'),
            utils = require('utils'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/AddWarningListItem');

    var AddWarningListView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('AddWarningListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
            this.parentModel = options.parentModel;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.model, AppEventNamesEnum.addWarningSuccess, this.onAddWarningSuccess);
            this.listenTo(this.model, AppEventNamesEnum.addWarningError, this.onAddWarningError);
        },
        render: function() {
            console.trace('AddWarningListView.render()');
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
            'click .add-station-warning-button': 'validateAndSubmitWarning',
            'click .reset-add-station-warning-button': 'revertChanges',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        validateAndSubmitWarning: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateModelFromView();
            this.model.validate();
        },
        updateViewFromModel: function() {
            var currentContext = this;
            if (currentContext.model.has('warning')) {
                currentContext.$('.warning-input').val(currentContext.model.get('warning').toString());
            } else {
                currentContext.$('.warning-input').val('');
            }
            this.hideLoading();
        },
        updateModelFromView: function() {
            var currentContext = this;
            if (currentContext.$('.warning-input').val() !== currentContext.model.get('warning')) {
                var stationId = currentContext.parentModel.get('stationId');
                var warning = currentContext.$('.warning-input').val();
                var firstReportedBy;
                if(currentContext.parentModel && currentContext.parentModel.get('userName')){
                    firstReportedBy = currentContext.parentModel.get('userName');
                }
                currentContext.model.set({
                    firstReportedBy: firstReportedBy,
                    stationId: stationId,
                    warning: warning
                });
            }
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                if (this.model.has('warning') && this.model.get('warning')) {
                    this.addWarning();
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
            currentContext.$('.warning-input').val('').removeClass('invalid');
            currentContext.model.unset('warning');
        },
        addWarning: function() {
            this.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.addWarning, this.model);
        },
        onAddWarningSuccess: function(stationWarningModel) {
            this.hideLoading();
            appEvents.trigger(AppEventNamesEnum.addWarningSuccess, stationWarningModel);
            this.leave();
        },
        onAddWarningError: function(message) {
            this.hideLoading();
            this.showError(message);
        }
    });

    return AddWarningListView;

});