define(function(require) {

    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            helpers = require('handlebars.helpers'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            utils = require('utils'),
            PersonnelModel = require('models/PersonnelModel'),
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
            this.listenTo(appEvents, AppEventNamesEnum.userIdFound, this.userIdFound);
            this.listenTo(appEvents, AppEventNamesEnum.userIdLookupError, this.onUserIdLookupError);
            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addAllStationIdentifiers);
            this.listenTo(this.purposeCollection, 'reset', this.addAllPurposes);
            this.listenTo(this.durationCollection, 'reset', this.addAllDurations);
        },
        render: function() {
            console.trace('NewStationEntryLog.render()');
            var currentContext = this;
            validation.unbind(currentContext);
            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            currentContext.addAllStationIdentifiers();
            currentContext.addAllPurposes();
            currentContext.addAllDurations();
            validation.bind(this, {
                selector: 'name'
            });
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
            'click #new-station-entry-log-user-id-search-button': 'goToLookupUserId',
            'click #new-station-entry-log-save-button': 'validateAndSubmitCheckIn',
            'click #new-station-entry-log-cancel-button': 'cancelCheckIn',
            'change #new-station-entry-log-purpose': 'purposeChanged',
            'change #new-station-entry-log-duration': 'durationChanged'
        },
        goToLookupUserId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var userId = this.$('#new-station-entry-log-user-id').val();
            var personnelModelInstance = new PersonnelModel({userId: userId});
            this.dispatcher.trigger(AppEventNamesEnum.goToLookupUserId, personnelModelInstance);
        },
        userIdFound: function(personnelModel) {
            if (personnelModel) {
                this.$('#new-station-entry-log-first-name').val(personnelModel.firstName);
                this.$('#new-station-entry-log-middle-initial').val(personnelModel.middleName);
                this.$('#new-station-entry-log-last-name').val(personnelModel.lastName);
                this.$('#new-station-entry-log-email').val(personnelModel.email);
                this.$('#new-station-entry-log-contact-number').val(helpers.formatPhoneWithDefault(personnelModel.telephoneNumber, '', '&nbsp;'));
            }
            this.hideError();
        },
        purposeChanged: function(event) {
            if (event) {
                event.preventDefault();
            }
            var purpose = this.$('#new-station-entry-log-purpose option:selected').text();
            this.togglePurposeOther(purpose === 'Other');
            var defaultDuration = this.$('#new-station-entry-log-purpose').val();
            if (!this.manualDurationEntry) {
                this.$('#new-station-entry-log-duration').val(defaultDuration);
                this.changeExpectedOutTime();
            }
        },
        durationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.changeExpectedOutTime();            
            this.manualDurationEntry = true;
        },
        changeExpectedOutTime: function() {
            var duration = this.$('#new-station-entry-log-duration').val();
            if (duration && !isNaN(duration)) {
                duration = Number(duration);
                var expectedOutTime = utils.addMinutes(new Date(), duration);
                this.$('#new-station-entry-log-expected-out-time').html(helpers.formatDateWithDefault(expectedOutTime, "%r", "&nbsp;"));
            }
        },
        togglePurposeOther: function(show) {
            if (show) {
                this.$('#new-station-entry-log-purpose-other-container').removeClass('hidden');
            } else {
                this.$('#new-station-entry-log-purpose-other-container').addClass('hidden');
            }
        },
        validateAndSubmitCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.getStationEntryModelFromView();
            this.model.validate();
        },
        getStationEntryModelFromView: function() {
            var userId = this.$('#new-station-entry-log-user-id').val();
            var firstName = this.$('#new-station-entry-log-first-name').val();
            var middleInitial = this.$('#new-station-entry-log-middle-initial').val();
            var lastName = this.$('#new-station-entry-log-last-name').val();
            var contactNumber = this.$('#new-station-entry-log-contact-number').val();
            var cleanedContactNumber = helpers.cleanPhone(contactNumber);
            var email = this.$('#new-station-entry-log-email').val();
            var stationId = this.$('#new-station-entry-log-station-id').val();
            var purpose = this.$('#new-station-entry-log-purpose option:selected').text();
            if (this.$('#new-station-entry-log-purpose').prop('selectedIndex') === 0) {
                purpose = '';
            }
            var purposeOther;
            if (purpose === 'Other') {
                purposeOther = this.$('#new-station-entry-log-purpose-other').val();
            }

            var duration = $('#new-station-entry-log-duration').val();
            var additionalInfo = $('#new-station-entry-log-additional-info').val();
            var hasCrew = this.$('#new-station-entry-log-has-crew').val();
            var dispatchCenterId = '777';
            var stationType = 'TC';
            this.model.set({
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                middleInitial: middleInitial,
                purpose: purpose,
                purposeOther: purposeOther,
                contactNumber: cleanedContactNumber,
                email: email,
                stationId: stationId,
                hasCrew: hasCrew,
                duration: duration,
                dispatchCenterId: dispatchCenterId,
                stationType: stationType,
                additionalInfo: additionalInfo
            });
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                this.goToCheckIn();
            }else{
                 var message = "One or more fields are invalid, please try again."; 
                 this.showError(message);
            }
        },
        goToCheckIn: function() {
            var stationEntryLogModelInstance = new StationEntryLogModel(this.model.attributes);
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
        onCheckInError: function(message) {
            this.showError(message);
        },
        onUserIdLookupError: function(message) {
            this.showError(message);
        },
        showError: function(message) {
            if (message) {
                this.$('.view-error .text-detail').html(message);
            }
            this.$('.view-error').removeClass('hidden');
        },
        hideError: function() {
            this.$('.view-error').addClass('hidden');
        }
    });
    return NewStationEntryLog;
});