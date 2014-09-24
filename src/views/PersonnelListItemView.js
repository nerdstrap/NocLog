define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/PersonnelListItem');

    var PersonnelListItemView = CompositeView.extend({
        tagName: 'li',
        resources: function(culture) {
            return {
                hazardIconSrc: appResources.getResource('hazardIconSrc').value,
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc').value,
                hazardIconAlt: appResources.getResource('hazardIconAlt').value,
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc').value,
                checkedInIconAlt: appResources.getResource('checkedInIconAlt').value,
                checkOutButtonText: appResources.getResource('checkOutButtonText').value
            };
        },
        initialize: function(options) {
            console.trace('PersonnelListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function() {
            console.trace('PersonnelListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .personnel-name-link': 'goToPersonnelWithId',
            'click .station-name-link': 'goToStationWithId',
            'click .station-entry-log-link': 'goToStationEntryLogWithId'
        },
        goToPersonnelWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var personnelId = this.model.get('personnelId');
            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnelWithId, personnelId);
        },
        goToStationWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            //var personnelId = this.model.get('personnelId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationWithId);
        },
        goToStationEntryLogWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            //var personnelId = this.model.get('personnelId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogWithId);
        }
    });

    return PersonnelListItemView;

});