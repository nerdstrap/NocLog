define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            helpers = require('handlebars.helpers'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            utils = require('utils'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            template = require('hbs!templates/StationEntryLog'),
            durationListTemplate = require('hbs!templates/DurationList');

    var StationEntryLog = CompositeView.extend({
        resources: function(culture) {
            return {
                actualDurationHeaderText: appResources.getResource('EditStationEntryLogView.actualDurationHeaderText'),
                actualOutTimeHeaderText: appResources.getResource('EditStationEntryLogView.viewTitleText'),
                additionalInfoHeaderText: appResources.getResource('EditStationEntryLogView.additionalInfoHeaderText'),
                cancelButtonText: appResources.getResource('EditStationEntryLogView.cancelButtonText'),
                checkOutButtonText: appResources.getResource('checkOutButtonText'),
                companyNameHeaderText: appResources.getResource('EditStationEntryLogView.companyNameHeaderText'),
                contactNumberHeaderText: appResources.getResource('EditStationEntryLogView.contactNumberHeaderText'),
                durationDefaultOption: appResources.getResource('EditStationEntryLogView.durationDefaultOption'),
                durationHeaderText: appResources.getResource('EditStationEntryLogView.durationHeaderText'),
                durationHeaderTextNew: appResources.getResource('EditStationEntryLogView.durationHeaderTextNew'),
                emailHeaderText: appResources.getResource('EditStationEntryLogView.emailHeaderText'),
                expectedOutTimeHeaderText: appResources.getResource('EditStationEntryLogView.expectedOutTimeHeaderText'),
                expectedOutTimeHeaderTextNew: appResources.getResource('EditStationEntryLogView.expectedOutTimeHeaderTextNew'),
                firstNameHeaderText: appResources.getResource('EditStationEntryLogView.firstNameHeaderText'),
                hasCrewHeaderText: appResources.getResource('EditStationEntryLogView.hasCrewHeaderText'),
                hasCrewNoOption: appResources.getResource('EditStationEntryLogView.hasCrewNoOption'),
                hasCrewYesOption: appResources.getResource('EditStationEntryLogView.hasCrewYesOption'),
                lastNameHeaderText: appResources.getResource('EditStationEntryLogView.lastNameHeaderText'),
                loadingIconSrc: appResources.getResource('loadingIconSrc'),
                loadingMessage: appResources.getResource('EditStationEntryLogView.loadingMessage'),
                middleInitialHeaderText: appResources.getResource('EditStationEntryLogView.middleInitialHeaderText'),
                purposeDefaultOption: appResources.getResource('EditStationEntryLogView.purposeDefaultOption'),
                purposeHeaderText: appResources.getResource('EditStationEntryLogView.purposeHeaderText'),
                purposeOtherHeaderText: appResources.getResource('EditStationEntryLogView.purposeOtherHeaderText'),
                saveButtonText: appResources.getResource('EditStationEntryLogView.saveButtonText'),
                stationIdDefaultOption: appResources.getResource('EditStationEntryLogView.stationIdDefaultOption'),
                stationIdHeaderText: appResources.getResource('EditStationEntryLogView.stationIdHeaderText'),
                userIdHeaderText: appResources.getResource('EditStationEntryLogView.userIdHeaderText')
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.durationCollection = options.durationCollection;

            this.listenTo(this.model, 'sync', this.updateViewFromModel);
            //this.listenTo(this.model, 'sync', this.setUserRole);
            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.durationCollection, 'reset', this.addAllDurations);

            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInSuccess, this.onUpdateCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInError, this.onUpdateCheckInError);
        },
        render: function() {
            console.trace('StationEntryLog.render()');
            var currentContext = this;

            validation.unbind(currentContext);

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            currentContext.addAllDurations();

            validation.bind(this, {
                selector: 'name'
            });

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
            'click #edit-station-entry-log-save-button': 'validateAndSubmitUpdatedCheckIn',
            'click #edit-station-entry-log-cancel-button': 'cancelEditCheckIn',
            'change #edit-station-entry-log-duration': 'durationChanged'
        },
        setUserRole: function(userRole) {
            var currentContext = this;
            currentContext.userRole = userRole;
//            currentContext.userRole = 'NOC_Admin';
//            currentContext.userRole = 'NOC_Read';
            currentContext.checkUserRole();
        },
        checkUserRole: function() {
            var currentContext = this;
            if (currentContext.userRole === UserRolesEnum.NocAdmin || currentContext.userRole === UserRolesEnum.NocUser) {
                currentContext.allowEdit = 'Yes';
                currentContext.updateViewFromModel();
                currentContext.$('.viewTitleText').html('Edit Check-in');
            } else {
                currentContext.allowEdit = 'No';
                currentContext.updateViewFromModel();
                currentContext.$('.viewTitleText').html('View Check-in');
            }
        },
        updateViewFromModel: function() {
            var currentContext = this;
            currentContext.$('#edit-station-entry-log-company-name').val(currentContext.model.get('companyName'));
            currentContext.$('#edit-station-entry-log-user-id').val(currentContext.model.get('userId'));
            currentContext.$('#edit-station-entry-log-first-name').val(currentContext.model.get('firstName'));
            currentContext.$('#edit-station-entry-log-middle-initial').val(currentContext.model.get('middleName'));
            currentContext.$('#edit-station-entry-log-last-name').val(currentContext.model.get('lastName'));
            currentContext.$('#edit-station-entry-log-contact-number').val(helpers.formatPhoneWithDefault(currentContext.model.get('contactNumber'), '', '&nbsp;'));
            currentContext.$('#edit-station-entry-log-email').val(currentContext.model.get('email'));
            currentContext.$('#edit-station-entry-log-station-id').html(currentContext.model.get('stationName'));
            currentContext.$('#edit-station-entry-log-purpose').html(currentContext.model.get('purpose'));
            currentContext.$('#edit-station-entry-log-duration-old').html((currentContext.model.get('duration') / 60) + " hours");
            currentContext.oldExpectedOutTime();
            currentContext.$('#view-station-entry-log-actual-out-time').html((currentContext.model.get('outTime')));
            currentContext.$('#edit-station-entry-log-has-crew').html(currentContext.decodeHasCrew());
            currentContext.$('#edit-station-entry-log-additional-info').val(currentContext.model.get('additionalInfo'));
            currentContext.changeCheckInType();
            this.hideLoading();
        },
        decodeHasCrew: function() {
            var currentContext = this;
            if (currentContext.model.get('hasCrew')) {
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
        changeCheckInType: function() {
            var currentContext = this;
            if (currentContext.model.has('companyName')) {
                //Third Party
                currentContext.$('#user-container').addClass('hidden');
                currentContext.$('#user-label-container').addClass('hidden');
                currentContext.$('#third-party-user-label-container').removeClass('hidden');
                currentContext.$('#third-party-user-container').removeClass('hidden');
            } else {
                //Not Third Party
                currentContext.$('#user-container').removeClass('hidden');
                currentContext.$('#user-label-container').removeClass('hidden');
                currentContext.$('#third-party-user-container').addClass('hidden');
                currentContext.$('#third-party-user-label-container').addClass('hidden');
            }

            if (currentContext.model.has('outTime')) {
                //Checked Out
                currentContext.$('#view-station-entry-log-new-duration').addClass('hidden');
                currentContext.$('#view-station-entry-log-actual-duration').removeClass('hidden');

                currentContext.$('#edit-station-entry-log-user-id').prop('disabled', true);
                currentContext.$('#edit-station-entry-log-company-name').prop('disabled', true);
                currentContext.$('#edit-station-entry-log-first-name').prop('disabled', true);
                currentContext.$('#edit-station-entry-log-middle-initial').prop('disabled', true);
                currentContext.$('#edit-station-entry-log-last-name').prop('disabled', true);
                currentContext.$('#edit-station-entry-log-email').prop('disabled', true);
                currentContext.$('#edit-station-entry-log-contact-number').prop('disabled', true);
                currentContext.$('#edit-station-entry-log-additional-info').prop('disabled', true);
                currentContext.$('#edit-station-entry-log-save-button').addClass('hidden');
                
                currentContext.$('.viewTitleText').html('View Check-in');
            } else {
                //Not Checked Out
                if (currentContext.allowEdit === 'Yes') {
                    currentContext.$('#edit-station-entry-log-additional-info').prop('disabled', false);
                    currentContext.$('#view-station-entry-log-new-duration').removeClass('hidden');
                    currentContext.$('#edit-station-entry-log-save-button').removeClass('hidden');
                    if (currentContext.model.has('company')) {
                        //Third Party
                        currentContext.$('#edit-station-entry-log-user-id').prop('disabled', true);
                        currentContext.$('#edit-station-entry-log-company-name').prop('disabled', false);

                        currentContext.$('#edit-station-entry-log-first-name').prop('disabled', false);
                        currentContext.$('#edit-station-entry-log-middle-initial').prop('disabled', false);
                        currentContext.$('#edit-station-entry-log-last-name').prop('disabled', false);
                        currentContext.$('#edit-station-entry-log-email').prop('disabled', false);
                        currentContext.$('#edit-station-entry-log-contact-number').prop('disabled', false);
                    } else {
                        //Not Third Party
                        currentContext.$('#edit-station-entry-log-user-id').prop('disabled', true);
                        currentContext.$('#edit-station-entry-log-company-name').prop('disabled', true);

                        currentContext.$('#edit-station-entry-log-first-name').prop('disabled', true);
                        currentContext.$('#edit-station-entry-log-middle-initial').prop('disabled', true);
                        currentContext.$('#edit-station-entry-log-last-name').prop('disabled', true);
                        currentContext.$('#edit-station-entry-log-email').prop('disabled', true);
                        currentContext.$('#edit-station-entry-log-contact-number').prop('disabled', true);
                    }
                }

            }


        },
        validateAndSubmitUpdatedCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.getStationEntryModelFromView();
            this.model.validate();
        },
        getStationEntryModelFromView: function() {
            var currentContext = this;
            //if values have changed, set new values in modle
            if (currentContext.model.get('thirdParty')) {
                if ($('#edit-station-entry-log-company-name').val() !== currentContext.model.get('companyName')) {
                    currentContext.model.set({companyName: $('#edit-station-entry-log-company-name').val()});
                }
                if ($('#edit-station-entry-log-first-name').val() !== currentContext.model.get('firstName')) {
                    currentContext.model.set({firstName: $('#edit-station-entry-log-first-name').val()});
                }
                if ($('#edit-station-entry-log-middle-initial').val() !== currentContext.model.get('middleName')) {
                    currentContext.model.set({middleInitial: $('#edit-station-entry-log-middle-initial').val()});
                }
                if ($('#edit-station-entry-log-last-name').val() !== currentContext.model.get('lastName')) {
                    currentContext.model.set({lastName: $('#edit-station-entry-log-last-name').val()});
                }
                var cleanedPhone = helpers.cleanPhone($('#edit-station-entry-log-contact-number').val());
                if (cleanedPhone !== currentContext.model.get('contactNumber')) {
                    currentContext.model.set({contactNumber: cleanedPhone});
                }
                if ($('#edit-station-entry-log-email').val() !== currentContext.model.get('email')) {
                    currentContext.model.set({email: $('#edit-station-entry-log-email').val()});
                }
            }
            if (currentContext.model.calculatedNewDuration > "0") {
                currentContext.model.set({duration: currentContext.model.calculatedNewDuration});
            }
            if ($('#edit-station-entry-log-additional-info').val() !== currentContext.model.get('additionalInfo')) {
                currentContext.model.set({additionalInfo: $('#edit-station-entry-log-additional-info').val()});
            }
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                this.goToUpdateCheckIn();
            } else {
                var message = "One or more fields are invalid, please try again.";
                this.showError(message);
            }
        },
        goToUpdateCheckIn: function() {
            var stationEntryLogModelInstance = new StationEntryLogModel(this.model.attributes);
            this.dispatcher.trigger(AppEventNamesEnum.goToUpdateCheckIn, stationEntryLogModelInstance);
        },
        onUpdateCheckInSuccess: function() {
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList, {stationEntryLog: this.model.attributes});
            this.leave();
        },
        onUpdateCheckInError: function(message) {
            //ERROR
        },
        cancelEditCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
//            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList);
//            this.leave();
            window.history.back();
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        },
        showError: function(message) {
            this.$('.view-error .text-detail').html(message);
            this.$('.view-error').removeClass('hidden');
        },
        hideError: function() {
            this.$('.view-error').addClass('hidden');
        }
    });

    return StationEntryLog;

});