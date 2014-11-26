define(function(require) {

    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            helpers = require('handlebars.helpers'),
            BaseSingletonView = require('views/BaseSingletonView'),
            PersonnelCollection = require('collections/PersonnelCollection'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/NewStationEntryLog');

    var NewStationEntryLog = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('NewStationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.personnelCollection = new PersonnelCollection();
            this.stationIdentifierCollection = options.stationIdentifierCollection;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationNameFilter);
            this.listenTo(this.purposeCollection, 'reset', this.addPurposeFilter);
            this.listenTo(this.durationCollection, 'reset', this.addDurationFilter);

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(appEvents, AppEventNamesEnum.userRoleUpdated, this.userRoleUpdated);
            this.listenTo(appEvents, AppEventNamesEnum.cancelCheckIn, this.cancelCheckIn);
            this.listenTo(appEvents, AppEventNamesEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkInError, this.onCheckInError);
        },
        render: function() {
            console.trace('NewStationEntryLog.render()');
            var currentContext = this;

            validation.unbind(currentContext);

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            validation.bind(this, {
                selector: 'name'
            });
            
            this.updateViewType();

            return this;
        },
        addStationNameFilter: function() {
            this.addFilter(this.$('#station-name-filter'), this.stationIdentifierCollection.models, 'stationId', 'stationName');
        },
        addPurposeFilter: function() {
            this.addFilter(this.$('#purpose-filter'), this.purposeCollection.models, 'itemAdditionalData', 'itemText');
        },
        addDurationFilter: function() {
            this.addFilter(this.$('#duration-filter'), this.durationCollection.models, 'itemValue', 'itemText');
        },
        events: {
            'change #third-party-indicator': 'updateViewType',
            'change #has-crew-indicator': 'updateHasCrew',
            'keypress #user-id-input': 'invokeRefreshPersonnelList',
            'click #lookup-user-id-button': 'dispatchRefreshPersonnelList',
            'change #purpose-filter': 'purposeChanged',
            'change #duration-filter': 'durationChanged',
            'click #save-new-station-entry-log-button': 'validateAndSubmitCheckIn',
            'click #cancel-save-new-station-entry-log-button': 'cancelCheckIn'
        },
        updateViewType: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateIndicatorLabel( this.$('#third-party-indicator'));
            var thirdParty = this.$('#third-party-indicator').is(':checked');
            if (thirdParty) {
                this.$('.first-party-container').addClass('hidden');
                this.$('.third-party-container').removeClass('hidden');
                this.$('.first-party-input').prop('disabled', true);
                this.$('.third-party-input').prop('disabled', false);
            } else {
                this.$('.third-party-container').addClass('hidden');
                this.$('.first-party-container').removeClass('hidden');
                this.$('.third-party-input').prop('disabled', true);
                this.$('.first-party-input').prop('disabled', false);
            }
        },
        updateHasCrew: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateIndicatorLabel(this.$('#has-crew-indicator'));
        },
        updateIndicatorLabel: function(indicator) {
            if (indicator.is(':checked')) {
                indicator.parent().next().addClass('bolder');
                indicator.parent().prev().removeClass('bolder');
            } else {
                indicator.parent().next().removeClass('bolder');
                indicator.parent().prev().addClass('bolder');
            }
        },
        invokeRefreshPersonnelList: function(event) {
            var validPattern = /^[A-Za-z0-9\s]*$/;
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    this.refreshPersonnelList();
                }
                var charCode = event.charCode || event.keyCode || event.which;
                var inputChar = String.fromCharCode(charCode);
                if (!validPattern.test(inputChar) && event.charCode !== 0) {
                    event.preventDefault();
                    return false;
                }
            }
        },
        dispatchRefreshPersonnelList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatchRefreshPersonnelList();
        },
        refreshPersonnelList: function() {
            var userId = this.$('#user-id-input').val();
            this.dispatcher.trigger(AppEventNamesEnum.refreshPersonnelList, {userId: userId});
        },
        userIdFound: function(personnelModel) {
            if (personnelModel) {
                this.$('#first-name-input').val(personnelModel.firstName);
                this.$('#middle-initial-input').val(personnelModel.middleInitial);
                this.$('#last-name-input').val(personnelModel.lastName);
                this.$('#email-input').val(personnelModel.email);
                this.$('#contact-number-input').val(helpers.formatPhoneWithDefault(personnelModel.contactNumber, '', '&nbsp;'));
            }
        },
        purposeChanged: function(event) {
            if (event) {
                event.preventDefault();
            }
            var purpose = this.$('#purpose-filter option:selected').text();
            this.togglePurposeOther(purpose === 'Other');
            if (!this.manualDurationEntry) {
                var defaultDuration = this.$('#purpose-filter').val();
                this.$('#duration-filter').val(defaultDuration);
                this.changeExpectedOutTime(defaultDuration);
            }
        },
        durationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.updateExpectedOutTime();
            this.manualDurationEntry = true;
        },
        updateExpectedOutTime: function(duration) {
            if (duration && !isNaN(duration)) {
                duration = Number(duration);
                var expectedOutTime = utils.addMinutes(new Date(), duration);
                this.$('#expected-out-time-input').html(helpers.formatDateWithDefault(expectedOutTime, "%r", "&nbsp;"));
            }
        },
        togglePurposeOther: function(show) {
            if (show) {
                this.$('#purpose-other-container').removeClass('hidden');
            } else {
                this.$('#purpose-other-container').addClass('hidden');
            }
        },
        validateAndSubmitCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateModelFromView();
            this.model.validate();
        },
        updateModelFromView: function() {
//            var thirdParty = this.$('#new-station-entry-log-third-party-indicator').is(':checked');
//            var userId = this.$('#new-station-entry-log-user-id').val();
//            var companyName = this.$('#new-station-entry-log-company-name').val();
//            var firstName = this.$('#new-station-entry-log-first-name').val();
//            var middleInitial = this.$('#new-station-entry-log-middle-initial').val();
//            var lastName = this.$('#new-station-entry-log-last-name').val();
//            var contactNumber = this.$('#new-station-entry-log-contact-number').val();
//            var cleanedContactNumber = helpers.cleanPhone(contactNumber);
//            var email = this.$('#new-station-entry-log-email').val();
//            var stationId = this.$('#new-station-entry-log-station-id').val();
//            var purpose = this.$('#new-station-entry-log-purpose option:selected').text();
//            if (this.$('#new-station-entry-log-purpose').prop('selectedIndex') === 0) {
//                purpose = '';
//            }
//            if (purpose === 'Other') {
//                purpose = this.$('#new-station-entry-log-purpose-other').val();
//            }
//
//            var duration = $('#new-station-entry-log-duration').val();
//            var additionalInfo = $('#new-station-entry-log-additional-info').val();
//            var hasCrew = '';
//            var hasCrewYesNo = this.$('#new-station-entry-log-has-crew').is(':checked');
//            if (hasCrewYesNo) {
//                hasCrew = true;
//            } else {
//                hasCrew = false;
//            }
//            //var hasCrew = this.$('#new-station-entry-log-has-crew').val();
//            var dispatchCenterId = '777';
//            var stationType = 'TC';
//            this.model.set({
//                thirdParty: thirdParty,
//                firstName: firstName,
//                lastName: lastName,
//                middleInitial: middleInitial,
//                purpose: purpose,
//                contactNumber: cleanedContactNumber,
//                email: email,
//                stationId: stationId,
//                hasCrew: hasCrew,
//                duration: duration,
//                dispatchCenterId: dispatchCenterId,
//                stationType: stationType,
//                additionalInfo: additionalInfo
//            });
//            if (userId) {
//                this.model.set({
//                    userId: userId
//                });
//            }
//            if (companyName) {
//                this.model.set({
//                    companyName: companyName
//                });
//            }
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                this.goToCheckIn();
            } else {
                var message = utils.getResource('validationErrorMessage');
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
        onLeave: function() {
        },
    });
    return NewStationEntryLog;
});