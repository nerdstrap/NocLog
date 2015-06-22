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

            this.showItemIcons();

            return this;
        },
        events: {
            'click .station-link': 'goToStationWithId',
            'click .personnel-link': 'goToPersonnel',
            'click .elevated-functions-toggle': 'toggleElevatedFunctions',
            'click .view-station-entry-log-button': 'goToStationEntryLogWithIdViewOnly'
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
        goToStationEntryLogWithIdViewOnly: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.model.set({isViewOnlyAction: true}, {silent: true});
            var stationEntryLogId = this.model.get('stationEntryLogId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId, stationEntryLogId, AppEventNamesEnum.goToStationEntryLogHistoryList, null, this.model.attributes);
        },
        toggleElevatedFunctions: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var stationIs = currentContext.model.get('stationType');
            if (stationIs === "TD") {
                this.$('.view-station-entry-log-button').addClass('hidden');
                var dispatchCenterId = currentContext.model.get('dispatchCenterId');
                var transDispatchCenterId = currentContext.model.get('transDispatchCenterId');
                var distDispatchCenterId = currentContext.model.get('distDispatchCenterId');
                if (dispatchCenterId === transDispatchCenterId) {
                    this.$('.trans-dispatch-info-container ').removeClass('hidden');
                }
                if (dispatchCenterId === distDispatchCenterId) {
                    this.$('.dist-dispatch-info-container ').removeClass('hidden');
                }
            }
            currentContext.$('.hide-container-icon').toggle('hidden');
            currentContext.$('.show-container-icon').toggle('hidden');
            currentContext.$('.elevated-functions-container').toggle('hidden');
        },
        showItemIcons: function() {
            var currentContext = this;
            var stationIs = currentContext.model.get('stationType');
            var stationIsTD = false;
            if (stationIs === "TD") {
                stationIsTD = true;
            }
            if (currentContext.model.has('linkedStationName')
                    || currentContext.model.get('thirdParty')
                    || currentContext.model.get('hasCrew')
                    || stationIsTD
                    ) {
                currentContext.$('.item-icons').removeClass('hidden');
            }
        }
    });

    return StationEntryLogHistoryListItemView;

});