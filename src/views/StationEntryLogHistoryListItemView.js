define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/StationEntryLogHistoryListItem');

    var StationEntryLogHistoryListItemView = CompositeView.extend({
        initialize: function(options) {
            console.trace('StationEntryLogHistoryListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
        },
        render: function() {
            console.trace('StationEntryLogHistoryListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            
            return this;
        },
        events: {
            'click .station-link': 'goToStationWithId',
            'click .personnel-link': 'goToPersonnel',
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
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId, stationEntryLogId, AppEventNamesEnum.goToStationEntryLogHistoryList);
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

    return StationEntryLogHistoryListItemView;

});