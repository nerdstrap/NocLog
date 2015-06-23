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
            template = require('hbs!templates/AddLinkedStation');

    var AddLinkedStationView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('AddLinkedStationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.model, AppEventNamesEnum.addLinkedStationSuccess, this.onAddLinkedStationSuccess);
            this.listenTo(this.model, AppEventNamesEnum.addLinkedStationError, this.onAddLinkedStationError);
        },
        render: function() {
            console.trace('AddLinkedStationView.render()');
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
            'click .add-linked-station-button': 'validateAndSubmitLinkedStation',
            'click .reset-add-linked-station-button': 'revertChanges',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        validateAndSubmitLinkedStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateModelFromView();
            this.model.validate();
        },
        updateViewFromModel: function() {
            var currentContext = this;
            if (currentContext.model.has('linkedStationId')) {
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
                if (currentContext.parentModel && currentContext.parentModel.get('userName')) {
                    firstReportedBy = currentContext.parentModel.get('userName');
                } else if (currentContext.userName) {
                    firstReportedBy = currentContext.userName;
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
                    this.addLinkedStation();
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
        addLinkedStation: function() {
            this.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.addLinkedStation, this.model);
        },
        onAddLinkedStationSuccess: function(stationLinkedStationModel) {
            this.hideLoading();
            appEvents.trigger(AppEventNamesEnum.addLinkedStationSuccess, stationLinkedStationModel);
            this.leave();
        },
        onAddLinkedStationError: function(message) {
            this.hideLoading();
            this.showError(message);
        }
    });

    return AddLinkedStationView;

});