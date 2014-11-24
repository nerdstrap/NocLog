define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            globals = require('globals'),
            CompositeView = require('views/CompositeView'),
            PurposeListItemView = require('views/EditPurposeListItemView'),
            env = require('env'),
        utils = require('utils'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/EditPurposeList'),
            PurposeModel = require('models/PurposeModel'),
            alertTemplate = require('hbs!templates/Alert');

    var EditPurposeListView = CompositeView.extend({
        initialize: function(options) {
            console.trace('EditPurposeListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.purposeCollection = options.collection || new Backbone.Collection();
            this.durationCollection = options.durationCollection || new Backbone.Collection();

            this.listenTo(this.purposeCollection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('EditPurposeListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click #purpose-list-refresh-list-button': 'refreshPurposeList',
            'click .new-purpose-item-save-link': 'getNewPurposeModelFromView',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        setUserRole: function(userRole) {
            var currentContext = this;
            currentContext.userRole = userRole;
            currentContext.checkUserRole();
        },
        checkUserRole: function() {
            var currentContext = this;
            if (currentContext.userRole === UserRolesEnum.NocAdmin) {
                _.each(this.collection.models, this.addOne, this);
            } else {
                this.addAlertBox(1, 'alert', 'Sorry, you are not authorized to perform maintenance.');
                this.$('#purpose-list').addClass('hidden');
            }
        },
        addAll: function() {
            this._leaveChildren();
            this.collection.add(new PurposeModel({itemType: 'STATION_ENTRY_PURPOSE'}));
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function(purpose) {
            var currentContext = this;
            var purposeListItemView = new PurposeListItemView({
                model: purpose,
                dispatcher: currentContext.dispatcher,
                durationCollection: currentContext.durationCollection
            });
            this.appendChildTo(purposeListItemView, '#purpose-list');
        },
        refreshPurposeList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToMaintainPurposes);
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        },
        showInfo: function(message) {
            var level;
            this.addAutoCloseAlert(level, message);
        },
        showSuccess: function(message) {
            this.addAutoCloseAlert('success', message);
        },
        showError: function(message) {
            this.addAutoCloseAlert('alert', message);
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
            this.addAlert(guid, level, message);
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
        },
        onLeave: function() {
        },
        getNewPurposeModelFromView: function() {
            var currentContext = this;
            var itemDescription = currentContext.$('#new-purpose-item-description').val();
            var itemText = currentContext.$('#new-purpose-item-description').val();
            var itemValue = currentContext.$('#new-purpose-item-description').val();
            var itemAdditionalData = currentContext.$('#new-purpose-item-duration').val();
            var itemEnabled = currentContext.$('#new-purpose-item-enabled').val();
            var itemOrder = currentContext.$('#new-purpose-item-order-number').val();
            var purposeModel = new PurposeModel({
                itemDescription: itemDescription,
                itemText: itemText,
                itemValue: itemValue,
                itemAdditionalData: itemAdditionalData,
                itemEnabled: itemEnabled,
                itemOrder: itemOrder
            });
        }
    });

    return EditPurposeListView;
});
