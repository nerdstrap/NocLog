define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseSingletonView = require('views/BaseSingletonView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            helpers = require('handlebars.helpers'),
            template = require('hbs!templates/PersonnelOpenStationEntryLog');

    var PersonnelOpenStationEntryLogView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('PersonnelOpenStationEntryLogView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
            
            this.listenTo(this.model, 'change', this.updateViewFromModel);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutSuccess, this.onCheckOutSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutError, this.onCheckOutError);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('PersonnelOpenStationEntryLogView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .station-link': 'goToStationWithId',
            'click .view-station-entry-log-button': 'goToStationEntryLogWithId',
            'click .edit-station-entry-log-button': 'goToStationEntryLogWithId',
            'click .check-out-button': 'checkOut'
        },
        updateViewFromModel: function() {
            this.$('.station-link').text(helpers.withDefault(this.model.get('stationName'), '')).attr('data-station-id', this.model.get('stationId'));
            this.$('.in-time-input').text(helpers.formatDateWithDefault(this.model.get('inTime'), '%D %I:%M %p', ''));
            this.$('.expected-out-time-input').text(helpers.formatDateWithDefault(this.model.get('expectedOutTime'), '%D %I:%M %p', ''));
            this.$('.purpose-input').text(helpers.withDefault(this.model.get('purpose'), ''));
            this.$('.additional-info-input').text(helpers.withDefault(this.model.get('additionalInfo'), ''));
            
            this.updateUserPrivileges();
            //this.updateCheckOutStatus();
            this.hideLoading();
        },
        updateUserPrivileges: function() {
            if (this.userRole === UserRolesEnum.NocAdmin || this.userRole === UserRolesEnum.NocUser) {
                this.$('.check-out-button').removeClass('hidden');
                this.$('.edit-station-entry-log-button').removeClass('hidden');
                this.$('.view-station-entry-log-button').addClass('hidden');
            } else {
                this.$('.check-out-button').addClass('hidden');
                this.$('.edit-station-entry-log-button').addClass('hidden');
                this.$('.view-station-entry-log-button').removeClass('hidden');
            }
        },
        updateCheckOutStatus: function() {
            if (this.model.get("checkOutOverdue")) {
                this.$el.addClass('checkOutOverdue');
            } else if (this.model.get("checkOutExpired")) {
                this.$el.addClass('checkOutExpired');
            }
        },
        goToStationWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = this.model.get('stationId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationWithId, stationId);
        },
        goToStationEntryLogWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationEntryLogId = this.model.get('stationEntryLogId');
            var userId = this.model.get('userId');
            if (userId) {
                this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId, stationEntryLogId, AppEventNamesEnum.goToPersonnel, {userId: userId});
            } else {
                var userName = this.model.get('userName');
                if (userName) {
                    this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId, stationEntryLogId, AppEventNamesEnum.goToPersonnel, {userName: userName});
                }
            }
        },
        checkOut: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.showLoading(false);
            this.dispatcher.trigger(AppEventNamesEnum.checkOut, this.model);
        },
        onCheckOutSuccess: function(stationEntryLog) {
            this.hideLoading();
            var checkOutSuccessMessage = utils.getResource('checkOutSuccessMessage');
            if (stationEntryLog) {
                var userName = stationEntryLog.userName;
                var stationName = stationEntryLog.stationName;
                checkOutSuccessMessage = 'Successful check-out for ' + userName + ' at ' + stationName;
            }
            this.parent.showSuccess(checkOutSuccessMessage);
            
            this.leave();
        },
        onCheckOutError: function(errorMessage, stationEntryLog) {
            this.hideLoading();
            this.showError(errorMessage);
        },
        onLeave: function() {
        }
    });

    return PersonnelOpenStationEntryLogView;

});