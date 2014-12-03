define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            helpers = require('handlebars.helpers'),
            BaseSingletonView = require('views/BaseSingletonView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/StationEntryLog');

    var StationEntryLog = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('StationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.durationCollection = options.durationCollection;
            this.referringAppEvent = options.referringAppEvent || AppEventNamesEnum.goToStationEntryLogList;
            this.personnelViewOptions = options.personnelViewOptions;
            this.readOnly = true;

            this.listenTo(this.model, 'change', this.updateViewFromModel);
            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.durationCollection, 'reset', this.addDurationFilter);

            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInSuccess, this.onUpdateCheckInSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.updateCheckInError, this.onUpdateCheckInError);
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
            'click #save-station-entry-log-button': 'validateAndSubmitUpdatedCheckIn',
            'click #cancel-save-station-entry-log-button': 'cancelEditCheckIn',
            'change #duration-filter': 'durationChanged',
            'click .close-alert-box-button': 'closeAlertBox'
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
            var hasCrew = currentContext.model.get('hasCrew');
            currentContext.$('#has-crew-input').html(helpers.formatYesNoWithDefault(hasCrew.toString(), 'No'));
            currentContext.$('#additional-info-input').val(currentContext.model.get('additionalInfo'));
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
                this.$('.view-legend').html(utils.getResource('stationEntryLog.viewTitleText'));
            }
            else {
                if (!this.readOnly) {
                    this.$('#additional-duration-container').removeClass('hidden');
                    this.$('#additional-info-input').prop('disabled', false);
                    this.$('#save-station-entry-log-button').removeClass('hidden');
                    this.$('.view-legend').html(utils.getResource('editStationEntryLog.viewTitleText'));

                    var enableThirdPartyInputs = this.model.get('thirdParty');
                    this.$('.third-party-input').prop('disabled', enableThirdPartyInputs);
                }
            }
        },
        validateAndSubmitUpdatedCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateModelFromView();
            this.model.validate();
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
                this.updateCheckIn();
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
        }
    });

    return StationEntryLog;

});