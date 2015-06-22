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
            'click .view-station-entry-log-button': 'goToStationEntryLogWithIdViewOnly',
            'click .edit-station-entry-log-button': 'goToStationEntryLogWithId',
            'click .check-out-button': 'checkOut'
        },
        updateViewFromModel: function() {
            this.$('.span-station-link').html(helpers.withDefault(this.model.get('stationName'), '')).attr('data-station-id', this.model.get('stationId'));
            this.$('.station-link').html(helpers.withDefault(this.model.get('stationName'), '')).attr('data-station-id', this.model.get('stationId'));
            if (this.model.has('linkedStationName')) {
                this.$('.linked-station-icon').html('<i class="fa fa-link" title="' + utils.getResource('linkedStationIconAlt') + this.model.get('linkedStationName') + '"></i>');
            } else {
                this.$('.linked-station-icon').html('&nbsp;');
            }
            if (this.model.has('overrideId')) {
                this.$('.station-hazard-icon-small').html('<i class="fa fa-exclamation-triangle" title="' + utils.getResource('linkedStationHazardIconAlt') + '"></i>');
            } else {
                this.$('.station-hazard-icon-small').html('&nbsp;');
            }
            if (this.model.has('hasWarnings')) {
                this.$('.station-warning-icon').html('<i class="fa fa-bullhorn" title="' + utils.getResource('tcomStationWarningsIconAlt') + '"></i>');
            } else {
                this.$('.station-warning-icon').html('&nbsp;');
            }
            if (this.model.get('stationType') === 'TD') {
                this.$('.td-station-icon').html('<img id="td-station-icon" class="text-icon" title="T&D Station Entry" alt="T&D Station Entry" src="images/tower_180x180.png"/>');
                var dispatchCenterId = this.model.get('dispatchCenterId');
                var transDispatchCenterId = this.model.get('transDispatchCenterId');
                var transDispatchCenter = this.model.get('transDispatchCenter');
                var transDispatchPhone = helpers.formatPhoneWithDefault(this.model.get('transDispatchPhone'));
                var distDispatchCenterId = this.model.get('distDispatchCenterId');
                var distDispatchCenter = this.model.get('distDispatchCenter');
                var distDispatchPhone = helpers.formatPhoneWithDefault(this.model.get('distDispatchPhone'));
                if (dispatchCenterId === transDispatchCenterId) {
                    this.$('.trans-dispatch-info').html(transDispatchCenter + ' ' + transDispatchPhone);
                    this.$('.trans-dispatch-info-container ').removeClass('hidden');
                }
                if (dispatchCenterId === distDispatchCenterId) {
                    this.$('.dist-dispatch-info').html(distDispatchCenter + ' ' + distDispatchPhone);
                    this.$('.dist-dispatch-info-container ').removeClass('hidden');
                }
                this.$('.span-station-link').removeClass('hidden');
            } else {
                this.$('.td-station-icon').html('&nbsp;');

                if (this.model.get('stationId')) {
                    this.$('.station-link').removeClass('hidden');    
                } else {
                    this.$('.span-station-link').removeClass('hidden');
                }
            }
            this.$('.in-time-input').html(helpers.formatDateWithDefault(this.model.get('inTime'), '%D %I:%M %p', ''));
            this.$('.expected-out-time-input').html(helpers.formatDateWithDefault(this.model.get('expectedOutTime'), '%D %I:%M %p', ''));
            this.$('.purpose-input').html(helpers.withDefault(this.model.get('purpose'), ''));
            this.$('.additional-info-input').html(helpers.withDefault(this.model.get('additionalInfo'), ''));
            
            this.updateUserPrivileges();
            //this.updateCheckOutStatus();
            this.showItemIcons();
            this.hideLoading();
        },
        updateUserPrivileges: function() {
            if (this.userRole === UserRolesEnum.NocAdmin || this.userRole === UserRolesEnum.NocUser) {
                if (this.model.get('stationType') !== 'TD') {
                    this.$('.check-out-button').removeClass('hidden');
                    this.$('.edit-station-entry-log-button').removeClass('hidden');
                    this.$('.view-station-entry-log-button').addClass('hidden');
                }
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
            var stationType = this.model.get('stationType');
            if (stationType === 'TC' && this.model.get('stationId')) {
                var stationId = this.model.get('stationId');
                this.dispatcher.trigger(AppEventNamesEnum.goToStationWithId, stationId);
            }
        },
        goToStationEntryLogWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationEntryLogId = this.model.get('stationEntryLogId');
            var userId = this.model.get('userId');
            if (userId) {
                this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId, stationEntryLogId, AppEventNamesEnum.goToPersonnel, {userId: userId}, this.model.attributes);
            } else {
                var userName = this.model.get('userName');
                if (userName) {
                    this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId, stationEntryLogId, AppEventNamesEnum.goToPersonnel, {userName: userName}, this.model.attributes);
                }
            }
        },
        goToStationEntryLogWithIdViewOnly: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.model.set({isViewOnlyAction: true}, {silent: true});
            this.goToStationEntryLogWithId();
        },
        checkOut: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.showLoading(false);
            this.model.set({isCheckOutAction: true}, {silent: true});
            this.goToStationEntryLogWithId();
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
        },
        showItemIcons: function() {
            var currentContext = this;
            var stationIs = currentContext.model.get('stationType');
            var stationIsTD = false;
            if (stationIs === "TD") {
                stationIsTD = true;
            }
            if (currentContext.model.has('linkedStationName')
                ||currentContext.model.has('hasWarnings')
                ||currentContext.model.get('thirdParty')
                ||currentContext.model.get('hasCrew')
                || stationIsTD
                ) {
                currentContext.$('.open-item-icons').removeClass('hidden');
            }
        }
    });

    return PersonnelOpenStationEntryLogView;

});