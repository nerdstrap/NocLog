define(function(require) {

    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationEntryLogListItem');

    var StationEntryLogListItemView = CompositeView.extend({
        tagName: 'li',
        resources: function(culture) {
            return {
                checkOutButtonText: appResources.getResource('checkOutButtonText'),
                editCheckInButtonText: appResources.getResource('editCheckInButtonText'),
                viewCheckInButtonText: appResources.getResource('viewCheckInButtonText')
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLogListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
            this.listenTo(this.model, "destroy", this.onCheckOutSuccess);
        },
        render: function() {
            console.trace('StationEntryLogListItemView.render()');
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.updateCheckOutStatus();
            this.updateThirdPartyStatus();
            this.checkUserRole();
//            this.setUserRole();

            return this;
        },
        events: {
            'click .station-name-link': 'goToStationWithId',
            'click .personnel-name-link': 'goToPersonnelWithId',
            'click .elevated-functions-toggle': 'toggleElevatedFunctions',
            'click .view-station-entry-log-link': 'goToStationEntryLogWithId',
            'click .station-entry-log-link': 'goToStationEntryLogWithId',
            'click .check-out-link': 'goToCheckOut'
        },
        updateCheckOutStatus: function() {
            if (this.model.get("checkOutOverdue")) {
                this.$('.station-entry-log-list-item-view').addClass('checkOutOverdue');
            } else if (this.model.get("checkOutExpired")) {
                this.$('.station-entry-log-list-item-view').addClass('checkOutExpired');
            }
        },
        updateThirdPartyStatus: function() {
            if (this.model.get('thirdParty')) {
                this.$('#third-party-icon').removeClass('hidden');
            }
        },
//        setUserRole: function(userRole) {
//            var currentContext = this;
//            currentContext.userRole = userRole;
//            currentContext.checkUserRole();
//        },
        checkUserRole: function() {
            var currentContext = this;
//            currentContext.userRole = 'NOC_Read';
            if (currentContext.userRole === UserRolesEnum.NocAdmin || currentContext.userRole === UserRolesEnum.NocUser) {
                currentContext.showElevatedFunctionToggle();
                currentContext.$('.view-station-entry-log-link').addClass('hidden');
                currentContext.$('.station-entry-log-link').removeClass('hidden');
                currentContext.$('.check-out-link').removeClass('hidden');
            } else {
                currentContext.showElevatedFunctionToggle();
                currentContext.$('.view-station-entry-log-link').removeClass('hidden');
                currentContext.$('.station-entry-log-link').addClass('hidden');
                currentContext.$('.check-out-link').addClass('hidden');
            }
        },
        showElevatedFunctionToggle: function() {
            this.$('.elevated-functions-toggle').removeClass('hidden');
        },
        hideElevatedFunctionToggle: function() {
            this.$('.elevated-functions-toggle').addClass('hidden');
        },
        toggleElevatedFunctions: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('.hide-container-icon').toggle('hidden');
            this.$('.show-container-icon').toggle('hidden');
            this.$('.elevated-functions-container').toggle('hidden');
        },
        goToStationWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = this.model.get('stationId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationWithId, stationId);
        },
        goToPersonnelWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var userId = this.model.get('userId');
            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnelWithId, userId);
        },
        goToStationEntryLogWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationEntryLogId = this.model.get('stationEntryLogId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId, stationEntryLogId);
        },
        goToCheckOut: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToCheckOut, this.model);
        },
        onCheckOutSuccess: function() {
            this.$el.remove();
        }
    });
    return StationEntryLogListItemView;
});