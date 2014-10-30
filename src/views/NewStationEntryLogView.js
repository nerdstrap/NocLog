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
                viewTitleText: appResources.getResource('NewStationEntryLogView.viewTitleText'),
                thirdPartyHeaderText: appResources.getResource('NewStationEntryLogView.thirdPartyHeaderText'),
                stationIdDefaultOption: appResources.getResource('NewStationEntryLogView.stationIdDefaultOption'),
                purposeDefaultOption: appResources.getResource('NewStationEntryLogView.purposeDefaultOption'),
                durationDefaultOption: appResources.getResource('NewStationEntryLogView.durationDefaultOption'),
                hasCrewYesOption: appResources.getResource('NewStationEntryLogView.hasCrewYesOption'),
                hasCrewNoOption: appResources.getResource('NewStationEntryLogView.hasCrewNoOption'),
                stationIdHeaderText: appResources.getResource('NewStationEntryLogView.stationIdHeaderText'),
                userIdHeaderText: appResources.getResource('NewStationEntryLogView.userIdHeaderText'),
                companyNameHeaderText: appResources.getResource('NewStationEntryLogView.companyNameHeaderText'),
                firstNameHeaderText: appResources.getResource('NewStationEntryLogView.firstNameHeaderText'),
                middleInitialHeaderText: appResources.getResource('NewStationEntryLogView.middleInitialHeaderText'),
                lastNameHeaderText: appResources.getResource('NewStationEntryLogView.lastNameHeaderText'),
                contactNumberHeaderText: appResources.getResource('NewStationEntryLogView.contactNumberHeaderText'),
                emailHeaderText: appResources.getResource('NewStationEntryLogView.emailHeaderText'),
                purposeHeaderText: appResources.getResource('NewStationEntryLogView.purposeHeaderText'),
                durationHeaderText: appResources.getResource('NewStationEntryLogView.durationHeaderText'),
                expectedOutTimeHeaderText: appResources.getResource('NewStationEntryLogView.expectedOutTimeHeaderText'),
                purposeOtherHeaderText: appResources.getResource('NewStationEntryLogView.purposeOtherHeaderText'),
                additionalInfoHeaderText: appResources.getResource('NewStationEntryLogView.additionalInfoHeaderText'),
                hasCrewHeaderText: appResources.getResource('NewStationEntryLogView.hasCrewHeaderText'),
                saveButtonText: appResources.getResource('NewStationEntryLogView.saveButtonText'),
                cancelButtonText: appResources.getResource('NewStationEntryLogView.cancelButtonText')
            };
        },
        initialize: function(options) {
            console.trace('NewStationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCollection = options.stationIdentifierCollection;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addAllStationIdentifiers);
            this.listenTo(this.purposeCollection, 'reset', this.addAllPurposes);
            this.listenTo(this.durationCollection, 'reset', this.addAllDurations);

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(appEvents, AppEventNamesEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkInError, this.onCheckInError);
            this.listenTo(appEvents, AppEventNamesEnum.userIdFound, this.userIdFound);
            this.listenTo(appEvents, AppEventNamesEnum.userIdLookupError, this.onUserIdLookupError);
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
            'change #new-station-entry-log-third-party-indicator': 'changeCheckInType',
            'click #new-station-entry-log-user-id-search-button': 'goToLookupUserId',
            'click #new-station-entry-log-save-button': 'validateAndSubmitCheckIn',
            'click #new-station-entry-log-cancel-button': 'cancelCheckIn',
            'change #new-station-entry-log-purpose': 'purposeChanged',
            'change #new-station-entry-log-duration': 'durationChanged'
        },
        changeCheckInType: function(event) {
            if (event) {
                event.preventDefault();
            }
            var thirdPartyCheckIn = this.$('#new-station-entry-log-third-party-indicator').is(':checked');
            if (thirdPartyCheckIn) {
                this.$('#user-label-container').addClass('hidden');
                this.$('#user-container').addClass('hidden');
                this.$('#third-party-user-container').removeClass('hidden');
                this.$('#third-party-user-label-container').removeClass('hidden');
                
                this.$('#new-station-entry-log-user-id').val('').prop('disabled', true);
                this.$('#new-station-entry-log-company-name').val('').prop('disabled', false);
                
                this.$('#new-station-entry-log-first-name').val('').prop('disabled', false);
                this.$('#new-station-entry-log-middle-initial').val('').prop('disabled', false);
                this.$('#new-station-entry-log-last-name').val('').prop('disabled', false);
                this.$('#new-station-entry-log-email').val('').prop('disabled', false);
                this.$('#new-station-entry-log-contact-number').val('').prop('disabled', false);
            } else {
                this.$('#user-container').removeClass('hidden');
                this.$('#user-label-container').removeClass('hidden');
                this.$('#third-party-user-container').addClass('hidden');
                this.$('#third-party-user-label-container').addClass('hidden');
                
                this.$('#new-station-entry-log-user-id').val('').prop('disabled', false);
                this.$('#new-station-entry-log-company-name').val('').prop('disabled', true);
                
                this.$('#new-station-entry-log-first-name').val('').prop('disabled', true);
                this.$('#new-station-entry-log-middle-initial').val('').prop('disabled', true);
                this.$('#new-station-entry-log-last-name').val('').prop('disabled', true);
                this.$('#new-station-entry-log-email').val('').prop('disabled', true);
                this.$('#new-station-entry-log-contact-number').val('').prop('disabled', true);
            }
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
            var thirdParty = this.$('#new-station-entry-log-third-party-indicator').is(':checked');
            var userId = this.$('#new-station-entry-log-user-id').val();
            var companyName = this.$('#new-station-entry-log-company-name').val();
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
            if (purpose === 'Other') {
                purpose = this.$('#new-station-entry-log-purpose-other').val();
            }

            var duration = $('#new-station-entry-log-duration').val();
            var additionalInfo = $('#new-station-entry-log-additional-info').val();
            var hasCrew = this.$('#new-station-entry-log-has-crew').val();
            var dispatchCenterId = '777';
            var stationType = 'TC';
            this.model.set({
                thirdParty: thirdParty,
                userId: userId,
                companyName: companyName,
                firstName: firstName,
                lastName: lastName,
                middleInitial: middleInitial,
                purpose: purpose,
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
            } else {
                var message = "One or more fields are invalid, please try again.";
                this.showError(message);
            }
        },
        onLeave: function() {
            this.dispatcher.trigger(AppEventNamesEnum.leaveNewStationEntryLogView);
        },
        goToCheckIn: function() {
            var stationEntryLogModelInstance = new StationEntryLogModel(this.model.attributes);
            stationEntryLogModelInstance.unset('thirdParty');
            this.dispatcher.trigger(AppEventNamesEnum.goToCheckIn, stationEntryLogModelInstance);
        },
        cancelCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.closeNewCheckIn);
            this.leave();
        },
        onCheckInSuccess: function() {
            this.dispatcher.trigger(AppEventNamesEnum.closeNewCheckIn);
            this.leave();
        },
        onCheckInError: function(message) {
            this.showError(message);
        },
        onUserIdLookupError: function(message) {
            this.showError(message);
        },
        showError: function(message) {
            this.$('.view-error .text-detail').html(message);
            this.$('.view-error').removeClass('hidden');
        },
        hideError: function() {
            this.$('.view-error').addClass('hidden');
        }
    });
    return NewStationEntryLog;
});