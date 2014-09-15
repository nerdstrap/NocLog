define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/Station');

    var StationView = CompositeView.extend({
        resources: function(culture) {
            return {
                hazardIconSrc: appResources.getResource('hazardIconSrc').value,
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc').value,
                hazardIconAlt: appResources.getResource('hazardIconAlt').value,
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc').value,
                checkedInIconAlt: appResources.getResource('checkedInIconAlt').value,
                checkOutButtonText: appResources.getResource('checkOutButtonText').value,
                stationNameHeaderText: appResources.getResource('StationView.stationNameHeaderText').value,
                contactHeaderText: appResources.getResource('StationView.contactHeaderText').value,
                regionHeaderText: appResources.getResource('StationView.regionHeaderText').value,
                areaHeaderText: appResources.getResource('StationView.areaHeaderText').value,
                directionsHeaderText: appResources.getResource('StationView.directionsHeaderText').value
            };
        },
        initialize: function(options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'sync', this.render);
        },
        render: function() {
            console.trace('StationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .directions-link': 'goToDirectionsWithLatLng'
        },
        
        goToDirectionsWithLatLng: function(event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        }
    });

    return StationView;

});