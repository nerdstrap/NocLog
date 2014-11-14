define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/PersonnelStationEntryLogListItem');

    var PersonnelStationEntryLogListItemView = CompositeView.extend({
        tagName: 'li',
        resources: function(culture) {
            return {};
        },
        initialize: function(options) {
            console.trace('PersonnelStationEntryLogListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function() {
            console.trace('PersonnelStationEntryLogListItemView.render()');
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

    return PersonnelStationEntryLogListItemView;

});