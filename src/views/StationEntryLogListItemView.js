define(function(require) {

    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/StationEntryLogListItem');

    var StationEntryLogListItemView = CompositeView.extend({
        initialize: function(options) {
            console.trace('StationEntryLogListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this.model, 'destroy', this.onCheckOutSuccess);
        },
        render: function() {
            console.trace('StationEntryLogListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.updateUserPrivileges();
            this.updateCheckOutStatus();

            return this;
        },
        events: {
            'click .station-link': 'goToStationWithId',
            'click .personnel-link': 'goToPersonnel',
            'click .elevated-functions-toggle': 'toggleElevatedFunctions',
            'click .view-station-entry-log-button': 'goToStationEntryLogWithId',
            'click .edit-station-entry-log-button': 'goToStationEntryLogWithId',
            'click .check-out-button': 'checkOut'
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
                this.$el.addClass('check-out-overdue');
            } else if (this.model.get("checkOutExpired")) {
                this.$el.addClass('check-out-expired');
            }
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
        goToPersonnel: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var linkButton = $(event.target);
                if (linkButton) {
                    var userId = linkButton.data('user-id');
                    if (userId) {
                        this.dispatcher.trigger(AppEventNamesEnum.goToPersonnel, {userId: userId});
                    } else {
                        var userName = linkButton.data('user-name');
                        if (userName) {
                            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnel, {userName: userName});
                        }
                    }
                }
            }
        },
        goToStationEntryLogWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationEntryLogId = this.model.get('stationEntryLogId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId, stationEntryLogId, AppEventNamesEnum.goToStationEntryLogList);
        },
        checkOut: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.checkOut, this.model);
        },
        onCheckOutSuccess: function() {
            this.$el.remove();
        }
    });
    return StationEntryLogListItemView;
});