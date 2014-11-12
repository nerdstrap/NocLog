define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            CompositeView = require('views/CompositeView'),
            globals = require('globals'),
            env = require('env'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/EditPurposeListItem'),
            alertTemplate = require('hbs!templates/Alert');

    var EditPurposeListItemView = CompositeView.extend({
        tagName: 'li',
        resources: function(culture) {
            return {
//                parmText: appResources.getResource('parmLookupString')
            };
        },
        initialize: function(options) {
            console.trace('EditPurposeListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

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

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            validation.bind(this, {
                selector: 'name'
            });

            return this;
        },
        events: {
            'click .purpose-item-save-link': 'validateAndSubmitItem',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        validateAndSubmitItem: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.getPurposeModelFromView();
            this.model.validate();
        },
        getPurposeModelFromView: function() {
            var currentContext = this;
            if (currentContext.$('.purpose-item-description').val() !== currentContext.model.get('itemDescription')) {
                currentContext.model.set({
                    itemDescription: currentContext.$('.purpose-item-description').val(),
                    itemText: currentContext.$('.purpose-item-description').val(),
                    itemValue: currentContext.$('.purpose-item-description').val()
                });
            }
            if (currentContext.$('.purpose-item-duration').val() !== currentContext.model.get('itemAdditionalData')) {
                currentContext.model.set({itemAdditionalData: currentContext.$('.purpose-item-duration').val()});
            }
            if (currentContext.$('.purpose-item-enabled').val() !== currentContext.model.get('itemEnabled')) {
                currentContext.model.set({itemEnabled: currentContext.$('.purpose-item-enabled').val()});
            }
            if (currentContext.$('.purpose-item-order-number').val() !== currentContext.model.get('itemOrder')) {
                currentContext.model.set({itemOrder: currentContext.$('.purpose-item-order-number').val()});
            }
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                if (this.model.has('lookupDataItemId') && this.model.get('lookupDataItemId')) {
                    this.goToUpdateItem();
                } else {
                    this.goToAddItem();
                }
            } else {
                var message = "One or more fields are invalid, please try again.";
                this.showAlert(message, "alert");
            }
        },
        onLeave: function() {
            //this.dispatcher.trigger(AppEventNamesEnum.leaveNewStationEntryLogView);
        },
        goToAddItem: function() {
            this.dispatcher.trigger(AppEventNamesEnum.goToAddItem, this.model);
        },
//        cancelAddItem: function(event) {
//            if (event) {
//                event.preventDefault();
//            }
//            //this.dispatcher.trigger(AppEventNamesEnum.closeNewCheckIn);
//            //this.leave();
//        },
        onAddItemSuccess: function(lookupDataItem) {
            this.model.set({lookupDataItemId: lookupDataItem.lookupDataItemId});
            this.showSuccess('save success');
        },
        onAddItemError: function(message) {
            this.showError(message);
        },
        goToUpdateItem: function() {
            this.dispatcher.trigger(AppEventNamesEnum.goToUpdateItem, this.model);
        },
//        cancelUpdateItem: function(event) {
//            if (event) {
//                event.preventDefault();
//            }
//        },
        onUpdateItemSuccess: function() {
            this.showSuccess('save success');
        },
        onUpdateItemError: function(message) {
            this.showError(message);
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
            this.$('.view-alert .columns').prepend(alertTemplate(renderModel));
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