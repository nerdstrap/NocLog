define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/Station');

    var StationView = CompositeView.extend({
        initialize: function(options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            console.trace('StationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            
            this.hideLoading();

            return this;
        },
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        events: {
            'click .directions-link': 'goToDirectionsWithLatLng',
            'click #station-show-contact-details-button': 'toggleContactDetailsPanel',
            'click #station-show-location-details-button': 'toggleLocationDetailsPanel',
            'click #station-show-emergency-details-button': 'toggleEmergencyDetailsPanel',
            'click #station-show-other-details-button': 'toggleOtherDetailsPanel',
            'click #station-show-faa-details-button': 'toggleFAADetailsPanel',
            'click #station-show-complex-details-button': 'toggleComplexDetailsPanel',
            'click #station-show-it-fo-details-button': 'toggleITFODetailsPanel'
        },
        toggleContactDetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-contact-details-icon').toggle('hidden');
            this.$('#station-hide-contact-details-icon').toggle('hidden');
            this.$('#station-contact-details-view').toggle('hidden');
        },
        toggleLocationDetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-location-details-icon').toggle('hidden');
            this.$('#station-hide-location-details-icon').toggle('hidden');
            this.$('#station-location-details-view').toggle('hidden');
        },
        toggleEmergencyDetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-emergency-details-icon').toggle('hidden');
            this.$('#station-hide-emergency-details-icon').toggle('hidden');
            this.$('#station-emergency-details-view').toggle('hidden');
        },
        toggleOtherDetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-other-details-icon').toggle('hidden');
            this.$('#station-hide-other-details-icon').toggle('hidden');
            this.$('#station-other-details-view').toggle('hidden');
        },
        toggleFAADetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-faa-details-icon').toggle('hidden');
            this.$('#station-hide-faa-details-icon').toggle('hidden');
            this.$('#station-faa-details-view').toggle('hidden');
        },
        toggleITFODetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-it-fo-details-icon').toggle('hidden');
            this.$('#station-hide-it-fo-details-icon').toggle('hidden');
            this.$('#station-it-fo-details-view').toggle('hidden');
        },
        goToDirectionsWithLatLng: function(event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        }
    });

    return StationView;

});