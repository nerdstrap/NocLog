define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            template = require('hbs!templates/NewStationEntryLog'),
            stationIdentifierListTemplate = require('hbs!templates/StationIdentifierList'),
            purposeListTemplate = require('hbs!templates/PurposeList'),
            durationListTemplate = require('hbs!templates/DurationList');

    var NewStationEntryLog = CompositeView.extend({
        resources: function(culture) {
            return {
                viewTitleText: appResources.getResource('NewStationEntryLogView.viewTitleText').value,
                stationIdDefaultOption: appResources.getResource('NewStationEntryLogView.stationIdDefaultOption').value,
                purposeDefaultOption: appResources.getResource('NewStationEntryLogView.purposeDefaultOption').value,
                durationDefaultOption: appResources.getResource('NewStationEntryLogView.durationDefaultOption').value,
                hasCrewYesOption: appResources.getResource('NewStationEntryLogView.hasCrewYesOption').value,
                hasCrewNoOption: appResources.getResource('NewStationEntryLogView.hasCrewNoOption').value,
                stationIdHeaderText: appResources.getResource('NewStationEntryLogView.stationIdHeaderText').value,
                userIdHeaderText: appResources.getResource('NewStationEntryLogView.userIdHeaderText').value,
                firstNameHeaderText: appResources.getResource('NewStationEntryLogView.firstNameHeaderText').value,
                middleInitialHeaderText: appResources.getResource('NewStationEntryLogView.middleInitialHeaderText').value,
                lastNameHeaderText: appResources.getResource('NewStationEntryLogView.lastNameHeaderText').value,
                contactNumberHeaderText: appResources.getResource('NewStationEntryLogView.contactNumberHeaderText').value,
                emailHeaderText: appResources.getResource('NewStationEntryLogView.emailHeaderText').value,
                purposeHeaderText: appResources.getResource('NewStationEntryLogView.purposeHeaderText').value,
                durationHeaderText: appResources.getResource('NewStationEntryLogView.durationHeaderText').value,
                expectedOutTimeHeaderText: appResources.getResource('NewStationEntryLogView.expectedOutTimeHeaderText').value,
                purposeOtherHeaderText: appResources.getResource('NewStationEntryLogView.purposeOtherHeaderText').value,
                additionalInfoHeaderText: appResources.getResource('NewStationEntryLogView.additionalInfoHeaderText').value,
                hasCrewHeaderText: appResources.getResource('NewStationEntryLogView.hasCrewHeaderText').value,
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
                defaultOption: currentContext.resources().stationIdDefaultOption,
                stationIdentifiers: currentContext.stationIdentifierCollection.models
            };
            this.$('#new-station-entry-log-station-id').html(stationIdentifierListTemplate(stationIdentifierListRenderModel));
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
        getStationEntryModelFromView: function() {
            var userId = this.$('#new-station-entry-log-user-id').val();
            var firstName = this.$('#new-station-entry-log-first-name').val();
            var middleInitial = this.$('#new-station-entry-log-middle-initial').val();
            var lastName = this.$('#new-station-entry-log-last-name').val();
            
            var contactNumber = this.$('#new-station-entry-log-contact-number').val();
            
            var email = this.$('#new-station-entry-log-email').val();
            
            var stationId = this.$('#new-station-entry-log-station-identifier').val();
            
            var purpose = this.$('#new-station-entry-log-purpose option:selected').text();
            if (purpose === 'Other') {
                purpose = this.$('#new-station-entry-log-purpose-other').val();
            }
            
            var duration = $('#new-station-entry-log-duration').val();
            
            var additionalInfo = $('#new-station-entry-log-additional-info').val();
            
            var hasCrew = this.$('#new-station-entry-log-has-crew').val();
            
            var dispatchCenterId = '777';
            
            var stationType = 'TC';
            
            return {
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                middleInitial: middleInitial,
                purpose: purpose,
                contactNumber: contactNumber,
                email: email,
                stationId: stationId,
                hasCrew: hasCrew,
                duration: duration,
                dispatchCenterId: dispatchCenterId,
                stationType: stationType,
                additionalInfo: additionalInfo
            };
        },
        goToCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationEntryLogModelInstance = new StationEntryLogModel(this.getStationEntryModelFromView());
//            var stationEntryLogModelInstance = new StationEntryLogModel({
//                userId: 's251201',
//                firstName: 'Michael',
//                lastName: 'Baltic',
//                middleInitial: 'E',
//                purpose: 'jquery post test',
//                contactNumber: '6145551212',
//                stationId: 'BORDN',
//                hasCrew: "true",
//                duration: "60",
//                dispatchCenterId: '777',
//                stationType: 'TC',
//                additionalInfo: 'jquery post test'
//            });
            this.dispatcher.trigger(AppEventNamesEnum.goToCheckIn, stationEntryLogModelInstance);
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