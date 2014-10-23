define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/StationEntryLog');

    var StationEntryLog = CompositeView.extend({
        resources: function(culture) {
            return {
                hazardIconSrc: appResources.getResource('hazardIconSrc'),
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc'),
                hazardIconAlt: appResources.getResource('hazardIconAlt'),
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc'),
                checkedInIconAlt: appResources.getResource('checkedInIconAlt'),
                checkOutButtonText: appResources.getResource('checkOutButtonText'),
                stationNameHeaderText: appResources.getResource('StationEntryLogView.stationNameHeaderText'),
                personnelNameHeaderText: appResources.getResource('StationEntryLogView.personnelNameHeaderText'),
                contactHeaderText: appResources.getResource('StationEntryLogView.contactHeaderText'),
                inTimeHeaderText: appResources.getResource('StationEntryLogView.inTimeHeaderText'),
                outTimeHeaderText: appResources.getResource('StationEntryLogView.outTimeHeaderText'),
                durationHeaderText: appResources.getResource('StationEntryLogView.durationHeaderText'),
                purposeHeaderText: appResources.getResource('StationEntryLogView.purposeHeaderText'),
                additionalInfoHeaderText: appResources.getResource('StationEntryLogView.additionalInfoHeaderText'),
                regionHeaderText: appResources.getResource('StationEntryLogView.regionHeaderText'),
                areaHeaderText: appResources.getResource('StationEntryLogView.areaHeaderText')
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'sync', this.render);
        },
        render: function() {
            console.trace('StationEntryLog.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        }
    });

    return StationEntryLog;

});