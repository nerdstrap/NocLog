define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationListItem');

    var StationListItemView = CompositeView.extend({
        tagName: 'li',
        resources: function(culture) {
            return {
                hazardIconSrc: appResources.getResource('hazardIconSrc'),
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc'),
                hazardIconAlt: appResources.getResource('hazardIconAlt'),
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc'),
                checkedInIconAlt: appResources.getResource('checkedInIconAlt')
            };
        },
        initialize: function(options) {
            console.trace('StationListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function() {
            console.trace('StationListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .station-name-link': 'goToStationWithId'
        },
        goToStationWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = this.model.get('stationId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationWithId, stationId);
        }
    });

    return StationListItemView;

});