define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            CompositeView = require('views/CompositeView'),
            globals = require('globals'),
            env = require('env'),
            utils = require('utils'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/EditPurposeListItem'),
            alertTemplate = require('hbs!templates/Alert'),
            filterTemplate = require('hbs!templates/Filter');

    var EditPurposeListItemView = CompositeView.extend({
        initialize: function(options) {
            console.trace('EditPurposeListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.durationCollection = options.durationCollection;
            this.userRole = options.userRole;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.model, AppEventNamesEnum.addItemSuccess, this.onAddItemSuccess);
            this.listenTo(this.model, AppEventNamesEnum.addItemError, this.onAddItemError);
            this.listenTo(this.model, AppEventNamesEnum.updateItemSuccess, this.onUpdateItemSuccess);
            this.listenTo(this.model, AppEventNamesEnum.updateItemError, this.onUpdateItemError);
        },
        render: function() {
            console.trace('EditPurposeListItemView.render()');
            var currentContext = this;

            validation.unbind(currentContext);

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            currentContext.addDurationFilter();

            currentContext.updateViewFromModel();

            validation.bind(this, {
                selector: 'name'
            });

            return this;
        },
        events: {
            'click .save-lookup-data-item-button': 'validateAndSubmitItem',
            'click .cancel-save-lookup-data-item-button': 'revertChanges',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        addDurationFilter: function() {
            this.addFilter(this.$('.item-additional-data-filter'), this.durationCollection.models, 'itemValue', 'itemText');
        },
        addFilter: function(filterSelector, options, valuePropertyName, textPropertyName) {
            var filterRenderModel = {
                defaultOption: utils.getResource('filterDefaultOption'),
                options: utils.getFilterOptions(options, valuePropertyName, textPropertyName)
            };
            this.$(filterSelector).html(filterTemplate(filterRenderModel));
        },
        validateAndSubmitItem: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.getPurposeModelFromView();
            this.model.validate();
        },
        updateViewFromModel: function() {
            var currentContext = this;
            if (currentContext.model.has('itemAdditionalData')) {
                currentContext.$('.item-additional-data-filter').val(currentContext.model.get('itemAdditionalData'));
            }
            if (currentContext.model.has('itemEnabled')) {
                currentContext.$('.item-enabled-filter').val(currentContext.model.get('itemEnabled').toString());
            }
            this.hideLoading();
        },
        getPurposeModelFromView: function() {
            var currentContext = this;
            if (currentContext.$('.item-text-input').val() !== currentContext.model.get('itemText')) {
                var itemText = currentContext.$('.item-text-input').val();
                currentContext.model.set({
                    itemDescription: itemText,
                    itemText: itemText,
                    itemValue: itemText
                });
            }
            if (currentContext.$('.item-additional-data-filter').val() !== currentContext.model.get('itemAdditionalData')) {
                currentContext.model.set({itemAdditionalData: currentContext.$('.item-additional-data-input').val()});
            }
            if (currentContext.$('.item-enabled-filter').val() !== currentContext.model.get('itemEnabled')) {
                currentContext.model.set({itemEnabled: currentContext.$('.item-enabled-filter').val()});
            }
            if (currentContext.$('.item-order-input').val() !== currentContext.model.get('itemOrder')) {
                currentContext.model.set({itemOrder: currentContext.$('.item-order-input').val()});
            }
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                if (this.model.has('lookupDataItemId') && this.model.get('lookupDataItemId')) {
                    this.updateItem();
                } else {
                    this.addItem();
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
            this.updateViewFromModel();
        },
        addItem: function() {
            this.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.addItem, this.model);
        },
        onAddItemSuccess: function(lookupDataItem) {
            this.hideLoading();
            this.model.set({lookupDataItemId: lookupDataItem.lookupDataItemId});
            this.showSuccess('save success');
        },
        onAddItemError: function(message) {
            this.hideLoading();
            this.showError(message);
        },
        updateItem: function() {
            this.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.updateItem, this.model);
        },
        onUpdateItemSuccess: function() {
            this.hideLoading();
            this.showSuccess('save success');
        },
        onUpdateItemError: function(message) {
            this.hideLoading();
            this.showError(message);
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        },
        showInfo: function(message) {
            var level;
            this.addAutoCloseAlertBox(level, message);
        },
        showSuccess: function(message) {
            this.addAutoCloseAlertBox('success', message);
        },
        showError: function(message) {
            this.addAutoCloseAlertBox('alert', message);
        },
        addAlertBox: function(guid, level, message) {
            var renderModel = {
                guid: guid,
                level: level,
                message: message
            };
            this.$('.view-alerts .columns').prepend(alertTemplate(renderModel));
        },
        addAutoCloseAlertBox: function(level, message) {
            var currentContext = this;
            var guid = env.getNewGuid();
            this.addAlertBox(guid, level, message);
            globals.window.setTimeout(function() {
                currentContext.autoCloseAlertBox(guid);
            }, env.getNotificationTimeout());
        },
        closeAlertBox: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var closeAlertButton = $(event.target);
                if (closeAlertButton) {
                    var alert = closeAlertButton.closest('[data-alert]');
                    if (alert) {
                        alert.trigger('close').trigger('close.fndtn.alert').remove();
                    }
                }
            }
        },
        autoCloseAlertBox: function(guid) {
            if (guid) {
                var closeAlertButton = $('#' + guid);
                if (closeAlertButton) {
                    var alert = closeAlertButton.closest('[data-alert]');
                    if (alert) {
                        alert.trigger('close').trigger('close.fndtn.alert').remove();
                    }
                }
            }
        }
    });

    return EditPurposeListItemView;

});