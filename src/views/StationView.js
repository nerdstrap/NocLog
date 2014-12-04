define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseSingletonView = require('views/BaseSingletonView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/Station');

    var StationView = BaseSingletonView.extend({
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
            'click .section-header': 'toggleSectionDetails'
        },
        toggleSectionDetails: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var sectionHeaderButton = $(event.target).closest('.section-header');
                if (sectionHeaderButton) {
                    sectionHeaderButton.next().toggle('hidden');
                    var sectionHeaderIcon = sectionHeaderButton.find('i');
                    if (sectionHeaderIcon.hasClass('fa-minus')) {
                        sectionHeaderIcon.removeClass('fa-minus').addClass('fa-plus');
                    } else {
                        sectionHeaderIcon.removeClass('fa-plus').addClass('fa-minus');
                    }
                }
            }
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