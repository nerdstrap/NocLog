define(function(require) {

    'use strict';
    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            helpers = require('handlebars.helpers'),
            BaseSingletonView = require('views/BaseSingletonView'),
            StationWarningListView = require('views/StationWarningListView'),
            PersonnelCollection = require('collections/PersonnelCollection'),
            StationWarningCollection = require('collections/StationWarningCollection'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            CheckInTypeEnum = require('enums/CheckInTypeEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/NewStationEntryLog');

    var NewStationEntryLog = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('NewStationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.personnelCollection = new PersonnelCollection();
            this.overridePersonnelCollection = new PersonnelCollection();
            this.stationIdentifierCollection = options.stationIdentifierCollection;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;
            this.areaCollection = options.areaCollection;
            this.stationWarningCollection = new StationWarningCollection();

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationFilter);
            this.listenTo(this.purposeCollection, 'reset', this.addPurposeFilter);
            this.listenTo(this.durationCollection, 'reset', this.addDurationFilter);
            this.listenTo(this.areaCollection, 'reset', this.addAreaFilter);
            this.listenTo(this.stationWarningCollection, 'reset', this.onStationWarningsReset);
            this.listenTo(this.stationWarningCollection, 'error', this.onStationWarningsError);

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(appEvents, AppEventNamesEnum.checkInError, this.onCheckInError);
            this.listenTo(appEvents, AppEventNamesEnum.checkInFailedWithHazard, this.onCheckInFailedWithHazard);
            this.listenTo(appEvents, AppEventNamesEnum.getToaStationSuccess, this.onGetLinkedStationSuccess);
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
            this.addStationFilter();
            this.addAreaFilter();
            this.addStationWarningsView();

            this.updateLoading();

            return this;
        },
        addStationFilter: function() {
            this.addFilter(this.$('#check-in-station-filter'), this.stationIdentifierCollection.models, 'stationId', 'stationName', 'linked-station-id', 'linkedStationId', 'linked-station-name', 'linkedStationName');
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
        addAreaFilter: function() {
            this.addFilter(this.$('#adhoc-area-filter'), this.areaCollection.models, 'regionName', 'areaName');
            this.areaFilterLoaded = true;
            this.updateLoading();
        },
        events: {
            'click .directions-link': 'goToDirectionsWithLatLng',
            'keypress #third-party-indicator-container': 'invokeUpdateViewType',
            'change #third-party-indicator': 'dispatchUpdateViewType',
            'keypress #ad-hoc-indicator-container': 'invokeUpdateViewLocationType',
            'change #ad-hoc-indicator': 'dispatchUpdateViewLocationType',
            'keypress #user-id-input': 'invokeRefreshPersonnelList',
            'click #lookup-user-id-button': 'dispatchRefreshPersonnelList',
            'keypress #override-id-input': 'invokeRefreshOverridePersonnelList',
            'click #lookup-override-id-button': 'dispatchRefreshOverridePersonnelList',
            'change #purpose-filter': 'purposeChanged',
            'change #duration-filter': 'durationChanged',
            'keypress #has-crew-indicator-container': 'invokeUpdateHasCrew',
            'change #has-crew-indicator': 'dispatchUpdateHasCrew',
            'click #save-new-station-entry-log-button': 'validateAndSubmitCheckIn',
            'click #cancel-save-new-station-entry-log-button': 'cancelCheckIn',
            'change #check-in-station-filter': 'stationChanged'
        },
        setInitialFieldFocus: function() {
            this.$('#user-id-input').focus();
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
                this.$('.first-party-input').val('');
                this.$('.third-party-input').val('');
                this.$('#contact-number-input').val('');
            } else {
                this.$('.third-party-container').addClass('hidden');
                this.$('.first-party-container').removeClass('hidden');
                this.$('.third-party-input').prop('disabled', true);
                this.$('.first-party-input').prop('disabled', false);
                this.$('.third-party-input').val('');
                this.$('#contact-number-input').val('');
            }
        },
        dispatchUpdateViewLocationType: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateViewLocationType();
        },
        invokeUpdateViewLocationType: function(event) {
            if (event) {
                if (event.keyCode === 32) {
                    /* spacebar key pressed */
                    this.$('#ad-hoc-indicator').click();
                    this.updateViewLocationType();
                }
                event.preventDefault();
            }
        },
        updateViewLocationType: function() {
            this.updateIndicatorLabel(this.$('#ad-hoc-indicator'));
            var adHoc = this.$('#ad-hoc-indicator').is(':checked');
            if (adHoc) {
                this.$('.station-checkin-container').addClass('hidden');
                this.$('.adhoc-checkin-container').removeClass('hidden');
                this.$('#check-in-station-filter').val('');
                this.$('#linked-station-name').html('');
                this.$('.linked-station-info-row').addClass('hidden');
            } else {
                this.$('.adhoc-checkin-container').addClass('hidden');
                this.$('.station-checkin-container').removeClass('hidden');
                this.$('#adhoc-area-filter').val('');
                this.$('#adhoc-description-input').val('');
                this.$('#adhoc-latitude-input').val('');
                this.$('#adhoc-longitude-input').val('');
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
            this.$('#third-party-indicator').prop('disabled', true);
            var userId = this.$('#user-id-input').val();
            this.listenToOnce(this.personnelCollection, 'reset', this.userLookupComplete);
            this.listenToOnce(this.personnelCollection, 'error', this.userLookupComplete);
            this.showLoading(false);
            this.dispatcher.trigger(AppEventNamesEnum.refreshPersonnelList, this.personnelCollection, {userId: userId, addContact: true});
        },
        userLookupComplete: function() {
            this.hideLoading();
            if (this.personnelCollection.length > 0) {
                this.updateUserFromModel(this.personnelCollection.pop({silent: true}));
            } else {
                this.updateUserFromModel();
                this.showError('user id not found!');
            }
            this.$('#third-party-indicator').prop('disabled', false);
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
                this.$('#contact-number-input').val('');
            }
        },
        invokeRefreshOverridePersonnelList: function(event) {
            var validPattern = /^[A-Za-z0-9\s]*$/;
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    this.refreshOverridePersonnelList();
                }
                var charCode = event.charCode || event.keyCode || event.which;
                var inputChar = String.fromCharCode(charCode);
                if (!validPattern.test(inputChar) && event.charCode !== 0) {
                    event.preventDefault();
                    return false;
                }
            }
        },
        dispatchRefreshOverridePersonnelList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.refreshOverridePersonnelList();
        },
        refreshOverridePersonnelList: function() {
            this.$('#third-party-indicator').prop('disabled', true);
            var overrideUserId = this.$('#override-id-input').val();
            this.listenToOnce(this.overridePersonnelCollection, 'reset', this.overrideUserLookupComplete);
            this.listenToOnce(this.overridePersonnelCollection, 'error', this.overrideUserLookupComplete);
            this.showLoading(false);
            this.dispatcher.trigger(AppEventNamesEnum.refreshOverridePersonnelList, this.overridePersonnelCollection, {userId: overrideUserId});
        },
        overrideUserLookupComplete: function() {
            this.hideLoading();
            if (this.overridePersonnelCollection.length > 0) {
                var overridePersonnelModel = this.overridePersonnelCollection.pop({silent: true});
                this.model.set({overridePersonnel: overridePersonnelModel.attributes}, {silent: true});
                this.updateOverrideFromModel();
                this.$('#save-new-station-entry-log-button').removeClass('hidden');
            } else {
                this.$('#override-name').html('');
                this.showError('override user id not found');
                this.$('#save-new-station-entry-log-button').addClass('hidden');
            }
            this.$('#third-party-indicator').prop('disabled', false);
        },
        updateOverrideFromModel: function() {
            var overridePersonnel = this.model.attributes.overridePersonnel;
            if (overridePersonnel) {
                var firstName = overridePersonnel.firstName ? overridePersonnel.firstName : '';
                var middleInitial = overridePersonnel.middleInitial ? overridePersonnel.middleInitial : '';
                var lastName = overridePersonnel.lastName ? overridePersonnel.lastName : '';
                var overrideName = firstName + ' ' + middleInitial + ' ' + lastName;
                this.$('#override-name').html(overrideName.replace(/\s+/g, ' ')); /* remove excess inner whitespace */
            } else {
                this.$('#override-name').html('');
            }
        },
        showHazardInfo: function(toaStation) {
            if (toaStation) {
                var toaHazardComment = toaStation.hazardComments ? toaStation.hazardComments : 'There are no Hazard comments in DOL system.';
                this.$('#linked-hazard-comments').html(toaHazardComment);
                this.$('#linked-tdc-center').html(toaStation.transDispatchCenter);
                this.$('#linked-tdc-phone').html(helpers.formatPhoneWithDefault(toaStation.transDispatchPhone, '', ''));
                this.$('#linked-ddc-center').html(toaStation.distDispatchCenter);
                this.$('#linked-ddc-phone').html(helpers.formatPhoneWithDefault(toaStation.distDispatchPhone, '', ''));
                this.$('#linked-station-info-container').css('border', '2px solid red');
                this.$('#linked-station-info-container').css('border-radius', '3px');
                this.$('#linked-station-info-container').css('padding', '1em');
                this.$('#linked-hazard-section').removeClass('hidden');
            }
        },
        clearHazardInfo: function() {
            this.$('#linked-hazard-comments').html('');
            this.$('#linked-tdc-center').html('');
            this.$('#linked-tdc-phone').html('');
            this.$('#linked-ddc-center').html('');
            this.$('#linked-ddc-phone').html('');
            this.$('#override-id-input').val('');
            this.$('#override-name').html('');
            this.$('#linked-station-info-container').css('border', '0');
            this.$('#linked-station-info-container').css('border-radius', '0');
            this.$('#linked-station-info-container').css('padding', '0');
            this.$('#linked-hazard-section').addClass('hidden');
            this.$('#save-new-station-entry-log-button').removeClass('hidden');
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
        stationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }

            var selectedStation = this.$('#check-in-station-filter').find('option:selected');
            var linkedStationId = selectedStation.attr('data-linked-station-id');
            var linkedStationName = selectedStation.attr('data-linked-station-name');
            this.clearHazardInfo();

            if (typeof (linkedStationId) === "undefined" || linkedStationName.length === 0) {
                this.$('.linked-station-info-row').addClass('hidden');
                this.$('#linked-station-name').html('');
            } else {
                this.$('#linked-station-name').html(linkedStationName);
                this.$('.linked-station-info-row').removeClass('hidden');
                this.getHazardForLinkedStation(linkedStationId);
            }

            var adhoc = this.$('#ad-hoc-indicator').is(':checked');
            if (adhoc === false) {
                var stationId = this.$('#check-in-station-filter').val();
                this.dispatcher.trigger(AppEventNamesEnum.refreshStationWarningList, this.stationWarningCollection, {stationId: stationId});
            }
        },
        getHazardForLinkedStation: function(linkedStationId) {
            if (linkedStationId) {
                this.showLoading(false);
                this.$('#save-new-station-entry-log-button').addClass('hidden');
                var options = {
                    stationId: linkedStationId,
                    stationType: 'TD'
                };
                this.dispatcher.trigger(AppEventNamesEnum.getToaStation, options);
            }
        },
        onGetLinkedStationSuccess: function(toaStation) {
            var currentContext = this;
            var selectedStation = this.$('#check-in-station-filter').find('option:selected');
            var linkedStationId = selectedStation.data('linked-station-id');
            if (typeof toaStation === 'undefined') {
                this.showError('Bad linked station id, ' + linkedStationId + '. Please correct before check-in. ');
            } else {
                if (linkedStationId.toString() === toaStation.stationId && toaStation.hasHazard) {
                    currentContext.showHazardInfo(toaStation);
                } else {
                    this.$('#save-new-station-entry-log-button').removeClass('hidden');
                }
            }
            this.hideLoading();
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
        updateStationWarnings: function() {
            var stationId = this.$('#check-in-station-filter').val();
            this.dispatcher.trigger(AppEventNamesEnum.refreshStationWarningList, this.stationWarningCollection, stationId);
        },
        addStationWarningsView: function() {
            var currentContext = this;
            var options = {
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationWarningCollection,
                parentModel: currentContext.model
            };
            currentContext.stationWarningsView = new StationWarningListView(options);
            currentContext.renderChildInto(currentContext.stationWarningsView, currentContext.$('#station-warning-list-view'));
        },
        onStationWarningsReset: function() {
            if (this.stationWarningCollection && this.stationWarningCollection.length > 0) {
                this.$('#station-warnings-container').removeClass('hidden');
            } else {
                this.$('#station-warnings-container').addClass('hidden');
            }
        },
        onStationWarningsError: function() {
            this.$('#station-warnings-container').addClass('hidden');
            this.showError('warnings could not be determined!');
        },
        validateAndSubmitCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            var overrideUserid;
            if (typeof this.model.attributes.overridePersonnel === "undefined") {
                overrideUserid = '';
            } else {
                overrideUserid = this.model.attributes.overridePersonnel.userId;
            }
            if ($('#override-id-input').val() !== overrideUserid) {
                this.showError('override required');
            } else {
                this.updateModelFromView();
                this.model.validate();
            }
        },
        updateModelFromView: function() {
            var thirdParty = this.$('#third-party-indicator').is(':checked');

            var userId;
            var companyName;
            if (thirdParty) {
                companyName = this.$('#company-name-input').val();
            } else {
                userId = this.$('#user-id-input').val();
            }
            var firstName = this.$('#first-name-input').val();
            var middleInitial = this.$('#middle-initial-input').val();
            var lastName = this.$('#last-name-input').val();
            var contactNumber = this.$('#contact-number-input').val();
            var cleanedContactNumber = helpers.cleanPhone(contactNumber);
            var email = this.$('#email-input').val();

            var adhoc = this.$('#ad-hoc-indicator').is(':checked');
            var checkInType;
            var adhocDescription;
            var adhocLatitude;
            var adhocLongitude;
            var selectedArea;
            var adhocArea;
            var adhocRegion;
            if (adhoc) {
                adhocDescription = $('#adhoc-description-input').val();
                if ($('#adhoc-latitude-input').val().length > 0) {
                    adhocLatitude = $('#adhoc-latitude-input').val();
                }
                if ($('#adhoc-longitude-input').val().length > 0) {
                    adhocLongitude = $('#adhoc-longitude-input').val();
                }
                selectedArea = this.$('#adhoc-area-filter').find('option:selected');
                adhocArea = selectedArea.text();
                adhocRegion = selectedArea.val();
                checkInType = CheckInTypeEnum.adHoc;
            } else {
                var stationId = this.$('#check-in-station-filter').val();
                var selectedStation = this.$('#check-in-station-filter').find('option:selected');
                var linkedStationId = selectedStation.data('linked-station-id');
                var linkedStationName = selectedStation.data('linked-station-name');

                var overrideId;
                var overrideName;
                if (!this.model.attributes.overridePersonnel) {
                    overrideId = null;
                    overrideName = null;
                } else {
                    overrideId = this.model.attributes.overridePersonnel.userId;
                    overrideName = this.model.attributes.overridePersonnel.userName;
                }
                checkInType = CheckInTypeEnum.station;
            }

            var purpose = this.$('#purpose-filter option:selected').text();
            if (this.$('#purpose-filter').prop('selectedIndex') === 0) {
                purpose = '';
            }
            if (purpose === 'Other') {
                purpose = this.$('#purpose-other-input').val();
            }

            var duration = $('#duration-filter').val();
            var additionalInfo = $('#additional-info-input').val();
            if (typeof (additionalInfo) !== "undefined") {
                additionalInfo = additionalInfo.trim();
            }
            var hasCrew = this.$('#has-crew-indicator').is(':checked');
            var dispatchCenterId = '777';
            var stationType = 'TC';
            this.model.set({
                thirdParty: thirdParty,
                checkInType: checkInType,
                userId: userId,
                companyName: companyName,
                firstName: firstName,
                lastName: lastName,
                middleInitial: middleInitial,
                purpose: purpose,
                contactNumber: cleanedContactNumber,
                email: email,
                stationId: stationId,
                linkedStationId: linkedStationId,
                linkedStationName: linkedStationName,
                overrideId: overrideId,
                overrideName: overrideName,
                hasCrew: hasCrew,
                duration: duration,
                dispatchCenterId: dispatchCenterId,
                stationType: stationType,
                additionalInfo: additionalInfo,
                description: adhocDescription,
                latitude: adhocLatitude,
                longitude: adhocLongitude,
                regionName: adhocRegion,
                areaName: adhocArea
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
            this.listenToWindowResize();
        },
        onCheckInSuccess: function() {
            this.hideLoading();
            this.leave();
        },
        onCheckInError: function(message) {
            this.hideLoading();
            this.showError(message);
        },
        onCheckInFailedWithHazard: function(dolStation) {
            this.hideLoading();
            var errorMessage = utils.getResource('hazardWarning');
            this.showError(errorMessage);
        },
        updateLoading: function() {
            if (this.stationFilterLoaded && this.purposeFilterLoaded && this.durationFilterLoaded && this.areaFilterLoaded) {
                this.hideLoading();
                this.setInitialFieldFocus();
            }
        },
        onLeave: function() {
        }
    });
    return NewStationEntryLog;
});