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
            this.stationIdentifierCollection = options.stationIdentifierCollection || new Backbone.Collection();
            this.purposeCollection = options.purposeCollection || new Backbone.Collection();
            this.durationCollection = options.durationCollection || new Backbone.Collection();

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationFilter);
            this.listenTo(this.purposeCollection, 'reset', this.addPurposeFilter);
            this.listenTo(this.durationCollection, 'reset', this.addDurationFilter);

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(appEvents, AppEventNamesEnum.userRoleUpdated, this.userRoleUpdated);
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

            this.updateLoading();

            return this;
        },
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        addStationFilter: function() {
            this.addFilter(this.$('#station-filter'), this.stationIdentifierCollection.models, 'stationId', 'stationName');
            this.stationFilterLoaded = true;
            this.updateLoading();
        },
        addPurposeFilter: function() {
            this.addFilter(this.$('#purpose-filter'), this.purposeCollection.models, 'itemAdditionalData', 'itemText');
            this.purposeFilterLoaded = true;
            this.updateLoading();
        },
        addDurationFilter: function() {
            this.addFilter(this.$('#duration-filter'), this.durationCollection.models, 'itemValue', 'itemText');
            this.durationFilterLoaded = true;
            this.updateLoading();
        },
        events: {
            'keypress #third-party-indicator-container': 'invokeUpdateViewType',
            'change #third-party-indicator': 'dispatchUpdateViewType',
            'keypress #user-id-input': 'invokeRefreshPersonnelList',
            'click #lookup-user-id-button': 'dispatchRefreshPersonnelList',
            'change #purpose-filter': 'purposeChanged',
            'change #duration-filter': 'durationChanged',
            'keypress #has-crew-indicator-container': 'invokeUpdateHasCrew',
            'change #has-crew-indicator': 'dispatchUpdateHasCrew',
            'click #save-new-station-entry-log-button': 'validateAndSubmitCheckIn',
            'click #cancel-save-new-station-entry-log-button': 'cancelCheckIn'
        },
        dispatchUpdateViewType: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateViewType();
        },
        invokeUpdateViewType: function(event) {
            if (event) {
                if (event.keyCode === 32) {
                    /* spacebar key pressed */
                    this.$('#third-party-indicator').click();
                    this.updateViewType();
                }
                event.preventDefault();
            }
        },
        updateViewType: function() {
            this.updateIndicatorLabel(this.$('#third-party-indicator'));
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
            this.refreshPersonnelList();
        },
        refreshPersonnelList: function() {
            var userId = this.$('#user-id-input').val();
            this.listenToOnce(this.personnelCollection, 'reset', this.userLookupComplete);
            this.listenToOnce(this.personnelCollection, 'error', this.userLookupComplete);
            this.showLoading(false);
            this.dispatcher.trigger(AppEventNamesEnum.refreshPersonnelList, this.personnelCollection, {userId: userId});
        },
        userLookupComplete: function() {
            this.hideLoading();
            if (this.personnelCollection.length > 0) {
                this.updateUserFromModel(this.personnelCollection.pop({silent: true}));
            } else {
                this.updateUserFromModel();
                this.showError('user id not found!');
            }
        },
        updateUserFromModel: function(personnelModel) {
            if (personnelModel) {
                this.$('#first-name-input').val(personnelModel.get('firstName'));
                this.$('#middle-initial-input').val(personnelModel.get('middleInitial'));
                this.$('#last-name-input').val(personnelModel.get('lastName'));
                this.$('#email-input').val(personnelModel.get('email'));
                this.$('#contact-number-input').val(helpers.formatPhoneWithDefault(personnelModel.get('contactNumber'), '', ''));
            } else {
                this.$('.third-party-input').val('');
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
                this.updateExpectedOutTime(defaultDuration);
            }
        },
        durationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }

            var duration = this.$('#duration-filter').val();
            this.updateExpectedOutTime(duration);
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
        dispatchUpdateHasCrew: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateHasCrew();
        },
        invokeUpdateHasCrew: function(event) {
            if (event) {
                if (event.keyCode === 32) {
                    /* spacebar key pressed */
                    this.$('#has-crew-indicator').click();
                    this.updateHasCrew();
                }
                event.preventDefault();
            }
        },
        updateHasCrew: function() {
            this.updateIndicatorLabel(this.$('#has-crew-indicator'));
        },
        validateAndSubmitCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateModelFromView();
            this.model.validate();
        },
        updateModelFromView: function() {
            var thirdParty = this.$('#third-party-indicator').is(':checked');

            var userId;
            var companyName;
            if (thirdParty) {
                var companyName = this.$('#company-name-input').val();
            } else {
                var userId = this.$('#user-id-input').val();
            }
            var firstName = this.$('#first-name-input').val();
            var middleInitial = this.$('#middle-initial-input').val();
            var lastName = this.$('#last-name-input').val();
            var contactNumber = this.$('#contact-number-input').val();
            var cleanedContactNumber = helpers.cleanPhone(contactNumber);
            var email = this.$('#email-input').val();
            var stationId = this.$('#station-filter').val();
            var purpose = this.$('#purpose-filter option:selected').text();
            if (this.$('#purpose-filter').prop('selectedIndex') === 0) {
                purpose = '';
            }
            if (purpose === 'Other') {
                purpose = this.$('#purpose-other-input').val();
            }

            var duration = $('#duration-filter').val();
            var additionalInfo = $('#additional-info-input').val();
            var hasCrew = this.$('#has-crew-indicator').is(':checked');
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
                this.checkIn();
            } else {
                var message = utils.getResource('validationErrorMessage');
                this.showError(message);
            }
        },
        checkIn: function() {
            this.showLoading(false);
            this.dispatcher.trigger(AppEventNamesEnum.checkIn, this.model);
        },
        cancelCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.cancelCheckIn);
            this.leave();
        },
        onCheckInSuccess: function() {
            this.hideLoading();
            this.leave();
        },
        onCheckInError: function(message) {
            this.hideLoading();
            this.showError(message);
        },
        updateLoading: function() {
            if (this.stationFilterLoaded && this.purposeFilterLoaded && this.durationFilterLoaded) {
                this.hideLoading();
            }
        },
        onLeave: function() {
        }
    });
    return NewStationEntryLog;
});