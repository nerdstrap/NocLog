define(function(require) {

    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRoleEnum = require('enums/UserRoleEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationEntryLogListItem');

    var StationEntryLogListItemView = CompositeView.extend({
        tagName: 'li',
        resources: function(culture) {
            return {
                editCheckInButtonText: appResources.getResource('editCheckInButtonText'),
                checkOutButtonText: appResources.getResource('checkOutButtonText')
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
            this.checkUserRole();

            return this;
        },
        events: {
            'click .station-name-link': 'goToStationWithId',
            'click .personnel-name-link': 'goToPersonnelWithId',
            'click .elevated-functions-toggle': 'toggleElevatedFunctions',
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
        setUserRole: function(userRole) {
            var currentContext = this;
            currentContext.userRole = userRole;
            currentContext.checkUserRole();
        },
        checkUserRole: function() {
            var currentContext = this;
            if (currentContext.userRole === UserRoleEnum.NocAdmin || currentContext.userRole === UserRoleEnum.NocUser) {
                currentContext.showElevatedFunctionToggle();
            } else {
                currentContext.hideElevatedFunctionToggle();
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
            var personnelId = this.model.get('personnelId');
            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnelWithId, personnelId);
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