define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/NewStationEntryLog'),
            stationIdentifierListTemplate = require('hbs!templates/StationIdentifierList'),
            purposeListTemplate = require('hbs!templates/PurposeList'),
            durationListTemplate = require('hbs!templates/DurationList');

    var NewStationEntryLog = CompositeView.extend({
        resources: function(culture) {
            return {
                viewTitleText: appResources.getResource('NewStationEntryLogView.viewTitleText').value,
                stationIdentifierDefaultOption: appResources.getResource('NewStationEntryLogView.stationIdentifierDefaultOption').value,
                purposeDefaultOption: appResources.getResource('NewStationEntryLogView.purposeDefaultOption').value,
                durationDefaultOption: appResources.getResource('NewStationEntryLogView.durationDefaultOption').value,
                withCrewYesOption: appResources.getResource('NewStationEntryLogView.withCrewYesOption').value,
                withCrewNoOption: appResources.getResource('NewStationEntryLogView.withCrewNoOption').value,
                stationNameHeaderText: appResources.getResource('NewStationEntryLogView.stationNameHeaderText').value,
                personnelNameHeaderText: appResources.getResource('NewStationEntryLogView.personnelNameHeaderText').value,
                firstNameHeaderText: appResources.getResource('NewStationEntryLogView.firstNameHeaderText').value,
                middleNameHeaderText: appResources.getResource('NewStationEntryLogView.middleNameHeaderText').value,
                lastNameHeaderText: appResources.getResource('NewStationEntryLogView.lastNameHeaderText').value,
                contactHeaderText: appResources.getResource('NewStationEntryLogView.contactHeaderText').value,
                emailHeaderText: appResources.getResource('NewStationEntryLogView.emailHeaderText').value,
                purposeHeaderText: appResources.getResource('NewStationEntryLogView.purposeHeaderText').value,
                durationHeaderText: appResources.getResource('NewStationEntryLogView.durationHeaderText').value,
                expectedOutTimeHeaderText: appResources.getResource('NewStationEntryLogView.expectedOutTimeHeaderText').value,
                purposeOtherHeaderText: appResources.getResource('NewStationEntryLogView.purposeOtherHeaderText').value,
                additionalInfoHeaderText: appResources.getResource('NewStationEntryLogView.additionalInfoHeaderText').value,
                withCrewHeaderText: appResources.getResource('NewStationEntryLogView.withCrewHeaderText').value,
                saveButtonText: appResources.getResource('NewStationEntryLogView.saveButtonText').value,
                cancelButtonText: appResources.getResource('NewStationEntryLogView.cancelButtonText').value
            };
        },
        initialize: function(options) {
            console.trace('NewStationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCollection = options.stationIdentifierCollection;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;
            
            this.listenTo(appEvents, AppEventNamesEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkInError, this.onCheckInError);
            
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addAllStationIdentifiers);
            this.listenTo(this.purposeCollection, 'reset', this.addAllPurposes);
            this.listenTo(this.durationCollection, 'reset', this.addAllDurations);
        },
        render: function() {
            console.trace('NewStationEntryLog.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            currentContext.addAllStationIdentifiers();
            currentContext.addAllPurposes();
            currentContext.addAllDurations();

            return this;
        },
        addAllStationIdentifiers: function() {
            var currentContext = this;
            var stationIdentifierListRenderModel = {
                defaultOption: currentContext.resources().stationIdentifierDefaultOption,
                stationIdentifiers: currentContext.stationIdentifierCollection.models
            };
            this.$('#new-station-entry-log-station-identifier').html(stationIdentifierListTemplate(stationIdentifierListRenderModel));
        },
        addAllPurposes: function() {
            var currentContext = this;
            var purposeListRenderModel = {
                defaultOption: currentContext.resources().purposeDefaultOption,
                purposes: currentContext.purposeCollection.models
            };
            this.$('#new-station-entry-log-purpose').html(purposeListTemplate(purposeListRenderModel));
        },
        addAllDurations: function() {
            var currentContext = this;
            var durationListRenderModel = {
                defaultOption: currentContext.resources().durationDefaultOption,
                durations: currentContext.durationCollection.models
            };
            this.$('#new-station-entry-log-duration').html(durationListTemplate(durationListRenderModel));
        },
        events: {
            'click #new-station-entry-log-save-button': 'goToCheckIn',
            'click #new-station-entry-log-cancel-button': 'cancelCheckIn'
        },
        goToCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToCheckIn);
        },
        cancelCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.cancelCheckIn);
            this.leave();
        },
        onCheckInSuccess: function() {
            this.leave();
        },
        onCheckInError: function() {
            alert('error');
        }
    });

    return NewStationEntryLog;

});