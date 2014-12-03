define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/PersonnelStationEntryLogListItem');

    var PersonnelStationEntryLogListItemView = CompositeView.extend({
        initialize: function(options) {
            console.trace('PersonnelStationEntryLogListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
        },
        render: function() {
            console.trace('PersonnelStationEntryLogListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .station-link': 'goToStationWithId',
            'click .elevated-functions-toggle': 'toggleElevatedFunctions',
            'click .view-station-entry-log-button': 'goToStationEntryLogWithId'
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
        toggleElevatedFunctions: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('.hide-container-icon').toggle('hidden');
            this.$('.show-container-icon').toggle('hidden');
            this.$('.elevated-functions-container').toggle('hidden');
        }
    });

    return PersonnelStationEntryLogListItemView;

});