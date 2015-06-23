define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            helpers = require('handlebars.helpers'),
            utils = require('utils'),
            BaseSingletonView = require('views/BaseSingletonView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/LinkedStation');

    var LinkedStationView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            
            this.listenTo(this.model, 'change', this.render);
            
        },
        render: function() {
            console.trace('LinkedStationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            
            this.hideLoading();

            return this;
        },
        events: {
            'click .linked-station-directions': 'goToDirectionsWithLatLng'
        },
        goToDirectionsWithLatLng: function(event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = this.parent.model.get('latitude');
            var longitude = this.parent.model.get('longitude');
            var linkedLatitude = this.model.get('latitude');
            var linkedLongitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude, linkedLatitude, linkedLongitude);
        }
        
    });

    return LinkedStationView;

});