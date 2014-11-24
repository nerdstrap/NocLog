define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/PersonnelStationEntryLogListItem');

    var PersonnelStationEntryLogListItemView = CompositeView.extend({
        tagName: 'li',
        initialize: function(options) {
            console.trace('PersonnelStationEntryLogListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        render: function() {
            console.trace('PersonnelStationEntryLogListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .station-name-link': 'goToStationWithId'
        }
    });

    return PersonnelStationEntryLogListItemView;

});