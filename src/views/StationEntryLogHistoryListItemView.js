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
                checkOutButtonText: appResources.getResource('checkOutButtonText')
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

            return this;
        },
        events: {
            'click .station-name-link': 'goToStationWithId',
            'click .personnel-name-link': 'goToStationEntryLogWithId'
            /*'click .station-entry-log-link': 'goToStationEntryLogWithId'*/
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
        }
    });

    return StationEntryLogHistoryListItemView;

});