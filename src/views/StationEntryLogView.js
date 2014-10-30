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
            template = require('hbs!templates/StationEntryLog'),
            stationIdentifierListTemplate = require('hbs!templates/StationIdentifierList'),
            purposeListTemplate = require('hbs!templates/PurposeList'),
            durationListTemplate = require('hbs!templates/DurationList');

    var StationEntryLog = CompositeView.extend({
        resources: function(culture) {
            return {
                additionalInfoHeaderText: appResources.getResource('StationEntryLogView.additionalInfoHeaderText'),
                areaHeaderText: appResources.getResource('StationEntryLogView.areaHeaderText'),
                cancelButtonText: appResources.getResource('EditStationEntryLogView.cancelButtonText'),
                checkOutButtonText: appResources.getResource('checkOutButtonText'),
                checkedInIconAlt: appResources.getResource('checkedInIconAlt'),
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc'),
                companyNameHeaderText: appResources.getResource('NewStationEntryLogView.companyNameHeaderText'),
                contactHeaderText: appResources.getResource('StationEntryLogView.contactHeaderText'),
                contactNumberHeaderText: appResources.getResource('EditStationEntryLogView.contactNumberHeaderText'),
                durationDefaultOption: appResources.getResource('EditStationEntryLogView.durationDefaultOption'),
                durationHeaderText: appResources.getResource('StationEntryLogView.durationHeaderText'),
                durationHeaderTextNew: appResources.getResource('EditStationEntryLogView.durationHeaderTextNew'),
                emailHeaderText: appResources.getResource('EditStationEntryLogView.emailHeaderText'),
                expectedOutTimeHeaderText: appResources.getResource('EditStationEntryLogView.expectedOutTimeHeaderText'),
                expectedOutTimeHeaderTextNew: appResources.getResource('EditStationEntryLogView.expectedOutTimeHeaderTextNew'),
                firstNameHeaderText: appResources.getResource('EditStationEntryLogView.firstNameHeaderText'),
                hasCrewHeaderText: appResources.getResource('EditStationEntryLogView.hasCrewHeaderText'),
                hasCrewNoOption: appResources.getResource('EditStationEntryLogView.hasCrewNoOption'),
                hasCrewYesOption: appResources.getResource('EditStationEntryLogView.hasCrewYesOption'),
                hazardIconAlt: appResources.getResource('hazardIconAlt'),
                hazardIconSrc: appResources.getResource('hazardIconSrc'),
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc'),
                inTimeHeaderText: appResources.getResource('StationEntryLogView.inTimeHeaderText'),
                lastNameHeaderText: appResources.getResource('EditStationEntryLogView.lastNameHeaderText'),
                middleInitialHeaderText: appResources.getResource('EditStationEntryLogView.middleInitialHeaderText'),
                outTimeHeaderText: appResources.getResource('StationEntryLogView.outTimeHeaderText'),
                personnelNameHeaderText: appResources.getResource('StationEntryLogView.personnelNameHeaderText'),
                purposeDefaultOption: appResources.getResource('EditStationEntryLogView.purposeDefaultOption'),
                purposeHeaderText: appResources.getResource('StationEntryLogView.purposeHeaderText'),
                purposeOtherHeaderText: appResources.getResource('EditStationEntryLogView.purposeOtherHeaderText'),
                regionHeaderText: appResources.getResource('StationEntryLogView.regionHeaderText'),
                saveButtonText: appResources.getResource('EditStationEntryLogView.saveButtonText'),
                stationIdDefaultOption: appResources.getResource('EditStationEntryLogView.stationIdDefaultOption'),
                stationIdHeaderText: appResources.getResource('EditStationEntryLogView.stationIdHeaderText'),
                stationNameHeaderText: appResources.getResource('StationEntryLogView.stationNameHeaderText'),
                thirdPartyHeaderText: appResources.getResource('NewStationEntryLogView.thirdPartyHeaderText'),
                userIdHeaderText: appResources.getResource('EditStationEntryLogView.userIdHeaderText')
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.durationCollection = options.durationCollection;

            this.listenTo(this.model, 'change', this.updateViewFromModel);

            this.listenTo(this.durationCollection, 'reset', this.addAllDurations);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInSuccess, this.onUpdateCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInError, this.onUpdateCheckInError);

        },
        render: function() {
            console.trace('StationEntryLog.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            
            currentContext.addAllDurations();

            return this;
        },
        addAllDurations: function() {
            var currentContext = this;
            var durationListRenderModel = {
                defaultOption: currentContext.resources().durationDefaultOption,
                durations: currentContext.durationCollection.models
            };
            this.$('#edit-station-entry-log-duration').html(durationListTemplate(durationListRenderModel));
        },
        events: {
            'click #edit-station-entry-log-save-button': 'saveUpdatedCheckIn',
            'click #edit-station-entry-log-cancel-button': 'cancelEditCheckIn',
            'change #edit-station-entry-log-duration': 'durationChanged'
        },
        updateViewFromModel: function() {
            var currentContext = this;
            currentContext.$('#edit-station-entry-log-company-name').val(currentContext.model.get('company'));
            currentContext.$('#edit-station-entry-log-user-id').val(currentContext.model.get('outsideId'));
            currentContext.$('#edit-station-entry-log-first-name').val(currentContext.model.get('firstName'));
            currentContext.$('#edit-station-entry-log-middle-initial').val(currentContext.model.get('middleName'));
            currentContext.$('#edit-station-entry-log-last-name').val(currentContext.model.get('lastName'));
            currentContext.$('#edit-station-entry-log-contact-number').val(currentContext.model.get('contact'));
            currentContext.$('#edit-station-entry-log-email').val(currentContext.model.get('email'));
            currentContext.$('#edit-station-entry-log-station-id').html(currentContext.model.get('stationId'));
            currentContext.$('#edit-station-entry-log-purpose').html(currentContext.model.get('purpose'));
            currentContext.$('#edit-station-entry-log-duration-old').html((currentContext.model.get('duration')/60)+" hours");
            currentContext.oldExpectedOutTime();
            currentContext.$('#edit-station-entry-log-has-crew').html(currentContext.decodeHasCrew());
            currentContext.$('#edit-station-entry-log-additional-info').text(currentContext.model.get('additionalInfo'));
            currentContext.changeCheckInType();
        },
        decodeHasCrew: function(){
            var currentContext = this;
            if(currentContext.model.get('hasCrew')) {
                return 'Yes';
            } else {
                return 'No';
            }
        },
        oldExpectedOutTime: function() {
            var inTime = this.model.get('inTime');
            var duration = this.model.get('duration');
            if (duration && !isNaN(duration)) {
                duration = Number(duration);
                var expectedOutTime = utils.addMinutes(new Date(inTime.getTime()), duration);
                this.$('#edit-station-entry-log-expected-out-time-old').html(helpers.formatDateWithDefault(expectedOutTime, "%r", "&nbsp;"));
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
            var inTime = this.model.get('inTime');
            var durationOld = this.model.get('duration');
            var durationNew = this.$('#edit-station-entry-log-duration').val();
            this.model.calculatedNewDuration = parseInt(durationOld) + parseInt(durationNew);
            if (durationNew && !isNaN(durationNew)) {
                durationNew = Number(durationNew);
                var expectedOutTime = utils.addMinutes(new Date(inTime.getTime()), (this.model.calculatedNewDuration));
                this.$('#edit-station-entry-log-expected-out-time').html(helpers.formatDateWithDefault(expectedOutTime, "%r", "&nbsp;"));
            } else {
                delete this.model.calculatedNewDuration;
                this.$('#edit-station-entry-log-expected-out-time').html('');
            }
        },
        changeCheckInType: function(event) {
            var currentContext = this;
            if (currentContext.model.has('company')) {
                //Third Party
                this.$('#user-container').addClass('hidden');
                this.$('#user-label-container').addClass('hidden');
                this.$('#third-party-user-label-container').removeClass('hidden');
                this.$('#third-party-user-container').removeClass('hidden');
                
                this.$('#edit-station-entry-log-user-id').prop('disabled', true);
                this.$('#edit-station-entry-log-company-name').prop('disabled', false);
                
                this.$('#edit-station-entry-log-first-name').prop('disabled', false);
                this.$('#edit-station-entry-log-middle-initial').prop('disabled', false);
                this.$('#edit-station-entry-log-last-name').prop('disabled', false);
                this.$('#edit-station-entry-log-email').prop('disabled', false);
                this.$('#edit-station-entry-log-contact-number').prop('disabled', false);
            } else {
                //Not Third Party
                this.$('#user-container').removeClass('hidden');
                this.$('#user-label-container').removeClass('hidden');
                this.$('#third-party-user-container').addClass('hidden');
                this.$('#third-party-user-label-container').addClass('hidden');
                
                this.$('#edit-station-entry-log-user-id').prop('disabled', true);
                this.$('#edit-station-entry-log-company-name').prop('disabled', true);
                
                this.$('#edit-station-entry-log-first-name').prop('disabled', true);
                this.$('#edit-station-entry-log-middle-initial').prop('disabled', true);
                this.$('#edit-station-entry-log-last-name').prop('disabled', true);
                this.$('#edit-station-entry-log-email').prop('disabled', true);
                this.$('#edit-station-entry-log-contact-number').prop('disabled', true);
            }
        },
        saveUpdatedCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.getStationEntryModelFromView();
            this.goToUpdateCheckIn();
        },
        getStationEntryModelFromView: function() {
            var companyName = this.$('#edit-station-entry-log-company-name').val();
            var firstName = this.$('#edit-station-entry-log-first-name').val();
            var middleInitial = this.$('#edit-station-entry-log-middle-initial').val();
            var lastName = this.$('#edit-station-entry-log-last-name').val();
            var contactNumber = this.$('#edit-station-entry-log-contact-number').val();
            var email = this.$('#edit-station-entry-log-email').val();
            var duration = this.model.calculatedNewDuration;
            var additionalInfo = $('#edit-station-entry-log-additional-info').val();
            if (companyName){
                this.model.set({
                        companyName: companyName,
                        firstName: firstName,
                        lastName: lastName,
                        middleInitial: middleInitial,
                        email: email,
                        contact: contactNumber
                    });
            }
            if (duration) {
                this.model.set({
                    duration: duration,
                    additionalInfo: additionalInfo
                });
            } else {
                this.model.set({
                    additionalInfo: additionalInfo
                });
            }
           
        },
        goToUpdateCheckIn: function() {
            var stationEntryLogModelInstance = new StationEntryLogModel(this.model.attributes);
            this.dispatcher.trigger(AppEventNamesEnum.goToUpdateCheckIn, stationEntryLogModelInstance);
        },
        onUpdateCheckInSuccess: function() {
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList);
            this.leave();
        },
        onUpdateCheckInError: function(message) {
            //ERROR
        },
        cancelEditCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList);
            this.leave();
        }
    });

    return StationEntryLog;

});