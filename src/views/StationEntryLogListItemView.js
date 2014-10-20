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
                hazardIconSrc: appResources.getResource('hazardIconSrc').value,
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc').value,
                hazardIconAlt: appResources.getResource('hazardIconAlt').value,
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc').value,
                checkedInIconAlt: appResources.getResource('checkedInIconAlt').value,
                checkOutButtonText: appResources.getResource('checkOutButtonText').value
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
            this.checkUserRole();
            return this;
        },
        events: {
            'click .station-name-link': 'goToStationWithId',
            'click .personnel-name-link': 'goToStationEntryLogWithId',
            'click .check-out-link': 'goToCheckOut',
            'click #station-entry-log-collapse-button': 'toggleStationEntryLogRow',
            /*'click .station-entry-log-link': 'goToStationEntryLogWithId'*/
        },
        toggleStationEntryLogRow: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-entry-log-hide-row-icon').toggle('hidden');
            this.$('#station-entry-log-show-row-icon').toggle('hidden');
            this.$('#station-entry-log-check-out-row').toggle('hidden');
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
        },
        checkUserRole: function() {
            if (this.userRole === UserRoleEnum.NocAdmin || this.userRole === UserRoleEnum.NocUser) {
                this.showCheckOutToggleButton();
            }
        },
        showCheckOutToggleButton: function() {
            this.$('#station-entry-log-collapse-button').removeClass('hidden');
        }
    });
    return StationEntryLogListItemView;
});