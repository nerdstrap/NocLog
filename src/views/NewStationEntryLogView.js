define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/NewStationEntryLog');

    var NewStationEntryLog = CompositeView.extend({
        resources: function(culture) {
            return {
                hazardIconSrc: appResources.getResource('hazardIconSrc').value,
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc').value,
                hazardIconAlt: appResources.getResource('hazardIconAlt').value,
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc').value,
                checkedInIconAlt: appResources.getResource('checkedInIconAlt').value,
                checkOutButtonText: appResources.getResource('checkOutButtonText').value,
                stationNameHeaderText: appResources.getResource('StationEntryLogView.stationNameHeaderText').value,
                personnelNameHeaderText: appResources.getResource('StationEntryLogView.personnelNameHeaderText').value,
                contactHeaderText: appResources.getResource('StationEntryLogView.contactHeaderText').value,
                inTimeHeaderText: appResources.getResource('StationEntryLogView.inTimeHeaderText').value,
                outTimeHeaderText: appResources.getResource('StationEntryLogView.outTimeHeaderText').value,
                durationHeaderText: appResources.getResource('StationEntryLogView.durationHeaderText').value,
                purposeHeaderText: appResources.getResource('StationEntryLogView.purposeHeaderText').value,
                additionalInfoHeaderText: appResources.getResource('StationEntryLogView.additionalInfoHeaderText').value,
                regionHeaderText: appResources.getResource('StationEntryLogView.regionHeaderText').value,
                areaHeaderText: appResources.getResource('StationEntryLogView.areaHeaderText').value
            };
        },
        initialize: function(options) {
            console.trace('NewStationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'sync', this.render);
        },
        render: function() {
            console.trace('NewStationEntryLog.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        }
    });

    return NewStationEntryLog;

});