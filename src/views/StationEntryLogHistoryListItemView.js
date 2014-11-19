define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationEntryLogHistoryListItem');

    var StationEntryLogHistoryListItemView = CompositeView.extend({
        tagName: 'li',
        resources: function(culture) {
            return {
                hazardIconSrc: appResources.getResource('hazardIconSrc'),
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc'),
                hazardIconAlt: appResources.getResource('hazardIconAlt'),
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc'),
                checkedInIconAlt: appResources.getResource('checkedInIconAlt'),
                checkOutButtonText: appResources.getResource('checkOutButtonText'),
                viewCheckInButtonText: appResources.getResource('viewCheckInButtonText')
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLogHistoryListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function() {
            console.trace('StationEntryLogHistoryListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            this.updateThirdPartyStatus()
            return this;
        },
        events: {
            'click .station-name-link': 'goToStationWithId',
            'click .personnel-name-link': 'goToPersonnelWithId',
            'click .elevated-functions-toggle': 'toggleElevatedFunctions',
            'click .view-station-entry-log-link': 'goToStationEntryLogWithId'
                    /*'click .station-entry-log-link': 'goToStationEntryLogWithId'*/
        },
        updateThirdPartyStatus: function() {
            if (this.model.get('thirdParty')) {
                this.$('#third-party-icon').removeClass('hidden');
            }
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