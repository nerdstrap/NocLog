define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            helpers = require('handlebars.helpers'),
            BaseSingletonView = require('views/BaseSingletonView'),
            ConfirmWarningListView = require('views/ConfirmWarningListView'),
            ClearWarningListView = require('views/ClearWarningListView'),
            PersonnelCollection = require('collections/PersonnelCollection'),
            StationWarningCollection = require('collections/StationWarningCollection'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            CheckInTypeEnum = require('enums/CheckInTypeEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/StationEntryLog');

    var StationEntryLog = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('StationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.durationCollection = options.durationCollection;
            this.overridePersonnelCollection = new PersonnelCollection();
            this.referringAppEvent = options.referringAppEvent || AppEventNamesEnum.goToStationEntryLogList;
            this.personnelViewOptions = options.personnelViewOptions;
            this.readOnly = true;

            this.listenTo(this.model, 'change', this.updateViewFromModel);
            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.durationCollection, 'reset', this.addDurationFilter);

            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInSuccess, this.onUpdateCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInError, this.onUpdateCheckInError);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutSuccess, this.onCheckOutSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutError, this.onCheckOutError);
            this.listenTo(appEvents, AppEventNamesEnum.getToaStationSuccess, this.onGetToaStationSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.checkOutFailedWithHazard, this.onCheckOutFailedWithHazard);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInFailedWithHazard, this.onUpdateCheckInFailedWithHazard);

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('StationEntryLog.render()');
            var currentContext = this;

            validation.unbind(currentContext);

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            validation.bind(currentContext, {
                selector: 'name'
            });

            return this;
        },
        setUserRole: function(userRole) {
            this.userRole = userRole;
            if (this.userRole === UserRolesEnum.NocAdmin || this.userRole === UserRolesEnum.NocUser) {
                this.readOnly = false;
            } else {
                this.readOnly = true;
            }
        },
        events: {
            'click .directions-link': 'goToDirectionsWithLatLng',
            'click #save-station-entry-log-button': 'validateAndSubmitUpdatedCheckIn',
            'click #check-out-station-entry-log-button': 'validateAndSubmitCheckOut',
            'click #cancel-save-station-entry-log-button': 'cancelEditCheckIn',
            'change #duration-filter': 'durationChanged',
            'click .close-alert-box-button': 'closeAlertBox',
            'keypress #override-id-input': 'invokeRefreshOverridePersonnelList',
            'click #lookup-override-id-button': 'dispatchRefreshOverridePersonnelList'
        },
        addDurationFilter: function() {
            this.addFilter(this.$('#duration-filter'), this.durationCollection.models, 'itemValue', 'itemText');
        },
        updateViewFromModel: function() {
            var currentContext = this;
            currentContext.$('#company-name-input').val(currentContext.model.get('companyName'));
            currentContext.$('#user-id-input').html(currentContext.model.get('userId'));
            currentContext.$('#first-name-input').val(currentContext.model.get('firstName'));
            currentContext.$('#middle-initial-input').val(currentContext.model.get('middleName'));
            currentContext.$('#last-name-input').val(currentContext.model.get('lastName'));
            currentContext.$('#contact-number-input').val(helpers.formatPhoneWithDefault(currentContext.model.get('contactNumber'), '', '&nbsp;'));
            currentContext.$('#email-input').val(currentContext.model.get('email'));
            currentContext.$('#station-id-input').html(currentContext.model.get('stationName'));
            currentContext.$('#in-time-input').html(helpers.formatDateWithDefault(currentContext.model.get('inTime'), '%D %I:%M %p', '&nbsp;'));
            currentContext.$('#purpose-input').html(currentContext.model.get('purpose'));
            currentContext.$('#old-duration-input').html((currentContext.model.get('duration') / 60) + ' hrs');
            currentContext.$('#actual-duration-input').html(helpers.formatTimespanWithDefault(currentContext.model.get('actualDuration'), '&nbsp;'));
            currentContext.$('#old-expected-out-time-input').html(helpers.formatDateWithDefault(currentContext.model.get('expectedOutTime'), '%D %I:%M %p', '&nbsp;'));
            currentContext.$('#actual-out-time-input').html(helpers.formatDateWithDefault(currentContext.model.get('outTime'), '%D %I:%M %p', '&nbsp;'));
            if (currentContext.model.has('hasCrew')) {
                var hasCrew = currentContext.model.get('hasCrew');
                currentContext.$('#has-crew-input').html(helpers.formatYesNoWithDefault(hasCrew.toString(), 'No'));
            }
            currentContext.$('#additional-info-input').val(currentContext.model.get('additionalInfo'));
            if (currentContext.model.has('linkedStationName')) {
                currentContext.$('#linked-station-name').html(currentContext.model.get('linkedStationName'));
                currentContext.getHazardForLinkedStation(currentContext.model.get('linkedStationId'));
                currentContext.$('.linked-station-info-row').removeClass('hidden');
            }
            if (currentContext.model.has('checkInType')) {
                var checkInType = currentContext.model.get('checkInType');
                if (checkInType === CheckInTypeEnum.adHoc) {
                    currentContext.$('.adhoc-checkin-container').removeClass('hidden');
                    currentContext.$('#adhoc-latitude-input').val(currentContext.model.get('latitude'));
                    currentContext.$('#adhoc-longitude-input').val(currentContext.model.get('longitude'));
                }
            }
            currentContext.updateViewType();
            this.hideLoading();
        },
        updateViewType: function() {
            if (this.model.get('thirdParty')) {
                this.$('.first-party-container').addClass('hidden');
                this.$('.third-party-container').removeClass('hidden');
            } else {
                this.$('.third-party-container').addClass('hidden');
                this.$('.first-party-container').removeClass('hidden');
            }

            if (this.model.get('checkedOut')) {
                this.$('#additional-duration-container').addClass('hidden');
                this.$('#actual-duration-container').removeClass('hidden');
                this.$('#company-name-input').prop('disabled', true);
                this.$('#first-name-input').prop('disabled', true);
                this.$('#middle-initial-input').prop('disabled', true);
                this.$('#last-name-input').prop('disabled', true);
                this.$('#email-input').prop('disabled', true);
                this.$('#contact-number-input').prop('disabled', true);
                this.$('#additional-info-input').prop('disabled', true);
                this.$('#save-station-entry-log-button').addClass('hidden');
                this.$('#check-out-station-entry-log-button').addClass('hidden');
                this.$('.view-legend').html(utils.getResource('stationEntryLog.viewTitleText'));
            }
            else {
                if (!this.readOnly) {
                    this.$('#additional-duration-container').removeClass('hidden');
                    this.$('#additional-info-input').prop('disabled', false);

                    var enableThirdPartyInputs = this.model.get('thirdParty');
                    this.$('.third-party-input').prop('disabled', !enableThirdPartyInputs);
//                    this.showSaveOrCheckoutButton();
                } else {
                    this.$('#adhoc-latitude-input').prop('disabled', true);
                    this.$('#adhoc-longitude-input').prop('disabled', true);
                }
            }
        },
        getStationWarnings: function() {
            var currentContext = this;
            if (this.model.get('checkInType') === CheckInTypeEnum.station) {
                currentContext.stationWarningCollection = new StationWarningCollection();
                currentContext.listenTo(currentContext.stationWarningCollection, 'reset', currentContext.addStationWarningsView);
                currentContext.listenTo(currentContext.stationWarningCollection, 'error', currentContext.onStationWarningsError);
                var stationId = currentContext.model.get('stationId');
                currentContext.dispatcher.trigger(AppEventNamesEnum.refreshStationWarningList, currentContext.stationWarningCollection, {stationId: stationId});
            } else {
                this.$('#station-warnings-container').addClass('hidden');
                this.showSaveOrCheckoutButton();
            }
        },
        addStationWarningsView: function() {
            var currentContext = this;
            var options = {
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationWarningCollection,
                parentModel: currentContext.model
            };
            if (this.model.get('isCheckOutAction') === true) {
                if (currentContext.stationWarningCollection && currentContext.stationWarningCollection.length > 0) {
                    currentContext.stationWarningsView = new ConfirmWarningListView(options);
                } else {
                    this.$('#station-warnings-container').addClass('hidden');
                }
            } else {
                currentContext.stationWarningsView = new ClearWarningListView(options);
            }
            if (currentContext.stationWarningsView) {
                currentContext.renderChildInto(currentContext.stationWarningsView, currentContext.$('#station-warning-list-view'));
                currentContext.stationWarningsView.addAll();
                if (this.model.get('isCheckOutAction') !== true) {
                    currentContext.stationWarningsView.renderNewAddWarningView();
                }
            }
            this.showSaveOrCheckoutButton();
        },
        onStationWarningsError: function() {
            this.$('#station-warnings-container').addClass('hidden');
            this.showError('warnings could not be determined!');
        },
        validateAndSubmitUpdatedCheckIn: function(event) {
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
            var attributes = {};
            if (this.model.get('thirdParty')) {
                if ($('#company-name-input').val() !== this.model.get('companyName')) {
                    attributes.companyName = $('#company-name-input').val();
                }
                if ($('#first-name-input').val() !== this.model.get('firstName')) {
                    attributes.firstName = $('#first-name-input').val();
                }
                if ($('#middle-initial-input').val() !== this.model.get('middleInitial')) {
                    attributes.middleInitial = $('#middle-initial-input').val();
                }
                if ($('#last-name-input').val() !== this.model.get('lastName')) {
                    attributes.lastName = $('#last-name-input').val();
                }
                if ($('#contact-number-input').val() !== this.model.get('contactNumber')) {
                    attributes.contactNumber = $('#contact-number-input').val();
                }
                if ($('#email-input').val() !== this.model.get('email')) {
                    attributes.email = $('#email-input').val();
                }
            }
            if (this.model.get('additionalDuration') > 0) {
                var duration = this.model.get('duration');
                var additionalDuration = this.model.get('additionalDuration');
                attributes.duration = duration + additionalDuration;
            }
            if ($('#additional-info-input').val() !== this.model.get('additionalInfo')) {
                attributes.additionalInfo = $('#additional-info-input').val();
            }
            if (!this.model.attributes.overridePersonnel) {
                attributes.overrideId = null;
                attributes.overrideName = null;
            } else {
                attributes.overrideId = this.model.attributes.overridePersonnel.userId;
                attributes.overrideName = this.model.attributes.overridePersonnel.userName;
            }

            if (this.model.get('checkInType') === CheckInTypeEnum.adHoc) {
                if ($('#adhoc-latitude-input').val().length > 0) {
                    attributes.latitude = $('#adhoc-latitude-input').val();
                }
                if ($('#adhoc-longitude-input').val().length > 0) {
                    attributes.longitude = $('#adhoc-longitude-input').val();
                }
            }

            this.model.set(attributes, {silent: true});
        },
        durationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }

            var inTime = this.model.get('inTime');
            var duration = this.model.get('duration');
            var additionalDuration = Number(this.$('#duration-filter').val());
            var expectedOutTime = utils.addMinutes(inTime, duration + additionalDuration);
            this.model.set({additionalDuration: additionalDuration}, {silent: true});
            this.$('#expected-out-time-input').text(helpers.formatDateWithDefault(expectedOutTime, '%D %I:%M %p', '&nbsp;'));
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {

                if (this.model.get('isCheckOutAction')) {
                    if (this.stationWarningCollection) {
                        if (this.allStationWarningsConfirmed()) {
                            this.model.set('stationWarningIds', this.stationWarningCollection.map(function(stationWarning) {
                                return stationWarning.get('stationWarningId');
                            }));
                            this.model.set('lastConfirmedBy', this.model.get('userName'));
                            this.checkOut();
                        } else {
                            var message = utils.getResource('confirmWarningErrorMessage');
                            this.showError(message);
                        }
                    } else {
                        this.checkOut();
                    }
                } else {
                    this.updateCheckIn();
                }
            } else {
                var message = utils.getResource('validationErrorMessage');
                this.showError(message);
            }
        },
        updateCheckIn: function() {
            this.dispatcher.trigger(AppEventNamesEnum.updateCheckIn, this.model);
        },
        onUpdateCheckInSuccess: function() {
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList, {stationEntryLog: this.model.attributes});
            this.leave();
        },
        onUpdateCheckInError: function(message) {
            throw new Error(message);
        },
        onCheckOutError: function(message) {
            var message = 'Error Checking Out.';
            this.showError(message);
        },
        onCheckOutFailedWithHazard: function(message) {
            var message = 'Error Checking Out with Hazard.';
            this.showError(message);
        },
        onUpdateCheckInFailedWithHazard: function(message) {
            var message = 'Error Updating Check-in with Hazard.';
            this.showError(message);
        },
        cancelEditCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (this.personnelViewOptions) {
                this.dispatcher.trigger(this.referringAppEvent, this.personnelViewOptions);
            } else {
                this.dispatcher.trigger(this.referringAppEvent);
            }
            this.leave();
        },
        setInitialFieldFocus: function() {
            if (this.readOnly === true || this.model.get('checkedOut')) {
                this.$('#cancel-save-station-entry-log-button').focus();
            } else {
                this.$('#duration-filter').focus();
            }
        },
        validateAndSubmitCheckOut: function(event) {
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
        checkOut: function() {
            this.dispatcher.trigger(AppEventNamesEnum.checkOut, this.model);
        },
        onCheckOutSuccess: function() {
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList, {stationEntryLog: this.model.attributes});
        },
        setCheckOutAction: function(isCheckOutAction) {
            this.model.set({isCheckOutAction: isCheckOutAction}, {silent: true});
            this.$('#company-name-input').prop('disabled', true);
            this.$('#first-name-input').prop('disabled', true);
            this.$('#middle-initial-input').prop('disabled', true);
            this.$('#last-name-input').prop('disabled', true);
            this.$('#email-input').prop('disabled', true);
            this.$('#contact-number-input').prop('disabled', true);
            this.$('#duration-filter').prop('disabled', true);
            this.$('#additional-duration-container').addClass('hidden');
            this.$('#adhoc-latitude-input').prop('disabled', true);
            this.$('#adhoc-longitude-input').prop('disabled', true);
            if (this.model.has('linkedStationName')) {
                this.$('#linked-station-name').html(this.model.get('linkedStationName'));
                this.getHazardForLinkedStation(this.model.get('linkedStationId'));
                this.$('.linked-station-info-row').removeClass('hidden');
            }
//            this.showSaveOrCheckoutButton();
        },
        setViewOnlyAction: function(isViewOnlyAction) {
            this.model.set({isViewOnlyAction: isViewOnlyAction}, {silent: true});
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
                this.showSaveOrCheckoutButton();
            } else {
                this.$('#override-name').html('');
                this.showError('override user id not found');
                this.$('#save-station-entry-log-button').addClass('hidden');
                this.$('#check-out-station-entry-log-button').addClass('hidden');
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
        showHazardInfo: function() {
            var toaStation = this.model.attributes.toaStation;
            if (this.readOnly || this.model.get('isViewOnlyAction')) {
                this.$('#linked-hazard-container').addClass('hidden');
            }
            else {
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
                    this.$('#save-station-entry-log-button').addClass('hidden');
                    this.$('#check-out-station-entry-log-button').addClass('hidden');
//                    if (this.readOnly) {
//                        this.$('#linked-hazard-override').addClass('hidden');
//                    }
                } else {
                    this.$('#linked-hazard-comments').html('Unable to determine if hazard exists at linked station. Please call T&D dispatch center to confirm.');
                    this.$('#linked-station-info-container').css('border', '2px solid red');
                    this.$('#linked-station-info-container').css('border-radius', '3px');
                    this.$('#linked-station-info-container').css('padding', '1em');
                    this.$('#linked-hazard-section').removeClass('hidden');
                }
            }
        },
        getHazardForLinkedStation: function(linkedStationId) {
            if (linkedStationId) {
                this.showLoading(false);
                this.$('#save-station-entry-log-button').addClass('hidden');
                var options = {
                    stationId: linkedStationId,
                    stationType: 'TD'
                };
                this.dispatcher.trigger(AppEventNamesEnum.getToaStation, options);
            }
        },
        onGetToaStationSuccess: function(toaStation) {
            var currentContext = this;
            if (typeof toaStation === 'undefined') {
                this.showError('Unable to retrieve hazard info, call Dispatch to override.');
                this.$('#save-station-entry-log-button').addClass('hidden');
                this.$('#check-out-station-entry-log-button').addClass('hidden');
            } else {
                currentContext.model.set({toaStation: toaStation}, {silent: true});
                if (currentContext.model.get('linkedStationId').toString() === toaStation.stationId && toaStation.hasHazard) {
                    currentContext.showHazardInfo(toaStation);
                }
            }
            this.hideLoading();
        },
        showSaveOrCheckoutButton: function() {
            if (this.model.has('isCheckOutAction')) {
                if (this.model.attributes.isCheckOutAction) {
                    this.$('#save-station-entry-log-button').addClass('hidden');
                    this.$('#check-out-station-entry-log-button').removeClass('hidden');
                } else {
                    if (!this.readOnly) {
                        this.$('#save-station-entry-log-button').removeClass('hidden');
                        this.$('#check-out-station-entry-log-button').addClass('hidden');
                    }
                }
                this.$('.view-legend').html(utils.getResource('checkOutStationEntryLog.viewTitleText'));
            } else {
                if (!this.readOnly) {
                    this.$('#save-station-entry-log-button').removeClass('hidden');
                    this.$('#check-out-station-entry-log-button').addClass('hidden');
                } else {
                    this.$('#save-station-entry-log-button').addClass('hidden');
                    this.$('#check-out-station-entry-log-button').addClass('hidden');
                }
                this.$('.view-legend').html(utils.getResource('editStationEntryLog.viewTitleText'));
            }
        },
        goToDirectionsWithLatLng: function(event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = $('#adhoc-latitude-input').val();
            var longitude = $('#adhoc-longitude-input').val();
            if (latitude && longitude) {
                this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
            }
        },
        allStationWarningsConfirmed: function() {
            var currentContext = this;
            if (currentContext.stationWarningCollection) {
                return _.every(currentContext.stationWarningCollection.models, function(stationWarningModel) {
                    return stationWarningModel.get('confirmed') === true;
                }, currentContext);
//                return currentContext.stationWarningCollection.every(function(stationWarningModel) {
//                    return stationWarningModel.get('confirmed') === true;
//                });
            }
            return true;
        },
        onLoaded: function() {
            this.hideLoading();
            this.getStationWarnings();
        },
        onLeave: function() {
        }

    });

    return StationEntryLog;

});