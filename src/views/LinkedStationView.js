define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseSingletonView = require('views/BaseSingletonView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        appEvents = require('events'),
        helpers = require('handlebars.helpers'),
        template = require('hbs!templates/LinkedStation');

    var LinkedStationView = BaseSingletonView.extend({
        initialize: function (options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('LinkedStationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click #go-to-linked-station-directions-button': 'goToDirectionsWithLatLng'
        },
        updateViewFromModel: function () {
            var currentContext = this;
            currentContext.$('#linked-station-station-name-label').text(currentContext.model.get('stationName'));

            if (currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
                currentContext.$('#go-to-linked-station-directions-button').attr('data-latitude', currentContext.model.get('latitude')).attr('data-longitude', currentContext.model.get('longitude'));
                currentContext.$('#go-to-linked-station-directions-button-container').removeClass('hidden');
            } else {
                currentContext.$('#go-to-linked-station-directions-button-container').addClass('hidden');
            }

            currentContext.$('#linked-station-telephone-label').text(helpers.formatPhone(currentContext.model.get('telephone')));
            currentContext.$('#linked-station-radio-label').text(currentContext.model.get('radio'));
            currentContext.$('#linked-station-contacts-label').text(currentContext.model.get('contacts'));
            currentContext.$('#linked-station-city-label').text(currentContext.model.get('city'));
            currentContext.$('#linked-station-state-label').text(currentContext.model.get('state'));
            currentContext.$('#linked-station-county-label').text(currentContext.model.get('county'));
            currentContext.$('#linked-station-latitude-label').text(currentContext.model.get('latitude'));
            currentContext.$('#linked-station-longitude-label').text(currentContext.model.get('longitude'));
            currentContext.$('#linked-station-directions-label').text(currentContext.model.get('directions'));
            currentContext.$('#linked-station-station-data-label').text(currentContext.model.get('stationData'));
            return this;
        },
        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        onLoaded: function () {
            this.updateViewFromModel();
            this.hideLoading();
        },
        onLeave: function () {
        }

    });

    return LinkedStationView;

});