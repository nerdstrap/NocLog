define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseSingletonView = require('views/BaseSingletonView'),
        EditWarningListView = require('views/EditWarningListView'),
        StationWarningListView = require('views/StationWarningListView'),
        LinkedStationView = require('views/LinkedStationView'),
        StationWarningCollection = require('collections/StationWarningCollection'),
        StationModel = require('models/StationModel'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        UserRolesEnum = require('enums/UserRolesEnum'),
        appEvents = require('events'),
        helpers = require('handlebars.helpers'),
        template = require('hbs!templates/Station');

    var StationView = BaseSingletonView.extend({
        initialize: function (options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationWarningCollection = new StationWarningCollection();

            this.listenTo(appEvents, AppEventNamesEnum.addLinkedStationSuccess, this.onAddLinkedStationSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.addLinkedStationError, this.onAddLinkedStationError);
            this.listenTo(appEvents, AppEventNamesEnum.clearLinkedStationSuccess, this.onClearLinkedStationSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.clearLinkedStationError, this.onClearLinkedStationError);
            this.listenTo(appEvents, AppEventNamesEnum.addWarningSuccess, this.onAddWarningSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.addWarningSuccess, this.onAddWarningSuccess);

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        renderWarningListView: function () {
            var currentContext = this;

            var stationId = currentContext.model.get('stationId');
            var options = {
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationWarningCollection,
                parentModel: currentContext.model
            };
            if (currentContext.userRole === UserRolesEnum.NocAdmin) {
                currentContext.stationWarningsView = new EditWarningListView(options);
                if (currentContext.userName) {
                    currentContext.stationWarningsView.setUserName(currentContext.userName);
                }
            } else {
                currentContext.stationWarningsView = new StationWarningListView(options);
            }
            currentContext.renderChildInto(currentContext.stationWarningsView, currentContext.$('#warning-list-view-container'));
            currentContext.dispatcher.trigger(AppEventNamesEnum.refreshStationWarningList, currentContext.stationWarningCollection, {stationId: stationId});
        },
        renderLinkedStationView: function () {
            var currentContext = this;
            if (currentContext.model.has('linkedStationId') && currentContext.model.has('linkedStationId')) {
                currentContext.$('#linked-station-icon').removeClass('hidden');
                currentContext.$('#no-linked-station-read-only-view').addClass('hidden');
                currentContext.$('#add-linked-station-view').addClass('hidden');
                currentContext.$('#clear-linked-station-view').removeClass('hidden');
                currentContext.$('#linked-station-id-label').text(currentContext.model.get('linkedStationId'));
                currentContext.$('#linked-station-name-label').text(currentContext.model.get('linkedStationName'));
                if (currentContext.userRole === UserRolesEnum.NocAdmin) {
                    currentContext.$('#clear-linked-station-button').removeClass('hidden');
                } else {
                    currentContext.$('#clear-linked-station-button').addClass('hidden');
                }
            } else {
                currentContext.$('#linked-station-icon').addClass('hidden');
                currentContext.$('#no-linked-station-read-only-view').removeClass('hidden');
                if (currentContext.userRole === UserRolesEnum.NocAdmin) {
                    currentContext.$('#add-linked-station-view').removeClass('hidden');
                }
                currentContext.$('#clear-linked-station-view').addClass('hidden');
            }
        },
        renderLinkedStationDetailsView: function (linkedStationId) {
            var currentContext = this;
            currentContext.linkedStationModel = new StationModel({
                stationId: linkedStationId
            });
            var options = {
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: currentContext.linkedStationModel
            };
            currentContext.linkedStationView = new LinkedStationView(options);
            currentContext.renderChildInto(currentContext.linkedStationView, currentContext.$('#linked-station-view-container'));

            currentContext.dispatcher.trigger(AppEventNamesEnum.goToLinkedStationWithId, {'linkedStationId': linkedStationId}, currentContext.linkedStationView);
        },
        events: {
            'click .directions-link': 'goToDirectionsWithLatLng',
            'click .section-header': 'toggleSectionDetails',
            'keypress #linked-station-id-input': 'invokeInputLinkedStationId',
            'click #add-linked-station-button': 'validateAndSubmitLinkedStation',
            'click #cancel-add-linked-station-button': 'resetLinkedStationInput',
            'click #clear-linked-station-button': 'clearLinkedStation',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        updateViewFromModel: function () {
            var currentContext = this;
            currentContext.$('#station-name-label').text(currentContext.model.get('stationName'));

            if (currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
                currentContext.$('#go-to-directions-button-container').attr('data-latitude', currentContext.model.get('latitude')).attr('data-longitude', currentContext.model.get('longitude'));
                currentContext.$('#go-to-directions-button-container').removeClass('hidden');
            } else {
                currentContext.$('#go-to-directions-button').addClass('hidden');
            }

            currentContext.$('#contact-audinet-label').text(currentContext.model.get('contactAudinet'));
            currentContext.$('#telephone-label').text(helpers.formatPhone(currentContext.model.get('telephone')));
            currentContext.$('#address1-label').text(currentContext.model.get('address1'));
            currentContext.$('#city-label').text(currentContext.model.get('city'));
            currentContext.$('#state-label').text(currentContext.model.get('state'));
            currentContext.$('#postal-code-label').text(currentContext.model.get('postalCode'));
            currentContext.$('#county-label').text(currentContext.model.get('county'));
            currentContext.$('#latitude-label').text(currentContext.model.get('latitude'));
            currentContext.$('#longitude-label').text(currentContext.model.get('longitude'));
            currentContext.$('#directions-label').text(currentContext.model.get('directions'));

            currentContext.$('#contact-id-label').text(currentContext.model.get('contactId'));
            currentContext.$('#contact-phone-label').text(currentContext.model.get('contactPhone'));
            currentContext.$('#contact-security-phone-label').text(currentContext.model.get('contactSecurityPhone'));
            currentContext.$('#contact-address1-label').text(currentContext.model.get('contactAddress1'));
            currentContext.$('#contact-city-label').text(currentContext.model.get('contactCity'));
            currentContext.$('#contact-state-label').text(currentContext.model.get('contactState'));
            currentContext.$('#contact-postal-code-label').text(currentContext.model.get('contactPostalCode'));

            currentContext.$('#medical-emergency-department-label').text(currentContext.model.get('medicalEmergencyDepartment'));
            currentContext.$('#medical-emergency-department-phone-label').text(currentContext.model.get('medicalEmergencyDepartmentPhone'));
            currentContext.$('#fire-department-label').text(currentContext.model.get('fireDepartment'));
            currentContext.$('#fire-department-phone-label').text(currentContext.model.get('fireDepartmentPhone'));
            currentContext.$('#police-department-label').text(currentContext.model.get('policeDepartment'));
            currentContext.$('#police-department-phone-label').text(currentContext.model.get('policeDepartmentPhone'));

            currentContext.$('#complex-name-label').text(currentContext.model.get('complexName'));
            currentContext.$('#owning-organization-label').text(currentContext.model.get('owningOrganization'));
            currentContext.$('#leased-circuits-label').text(currentContext.model.get('leasedCircuits'));

            currentContext.$('#faa-reportable-label').text(currentContext.model.get('faaReportable'));
            currentContext.$('#faa-region-label').text(currentContext.model.get('faaRegion'));
            currentContext.$('#tower-number-label').text(currentContext.model.get('towerNumber'));
            currentContext.$('#nearest-airport-label').text(currentContext.model.get('nearestAirport'));

            currentContext.$('#area-label').text(currentContext.model.get('area'));
            currentContext.$('#region-label').text(currentContext.model.get('region'));
            currentContext.$('#benefiting-organization-label').text(currentContext.model.get('benefitingOrganization'));
            currentContext.$('#serving-electric-utility-label').text(currentContext.model.get('servingElectricUtility'));
            currentContext.$('#serving-utility-telephone-label').text(currentContext.model.get('servingUtilityTelephone'));
            currentContext.$('#ac-circuit-feeder-label').text(currentContext.model.get('acCircuitFeeder'));
            currentContext.$('#transformer-pole-label').text(currentContext.model.get('transformerPole'));
            currentContext.$('#serving-telephone-company-label').text(currentContext.model.get('servingTelephoneCompany'));
            currentContext.$('#demarcation-location-label').text(currentContext.model.get('demarcationLocation'));
            currentContext.$('#telecom-npa-label').text(currentContext.model.get('telecomNpa'));
            currentContext.$('#telecom-nxx-label').text(currentContext.model.get('telecomNxx'));
            currentContext.$('#fuel-provider-label').text(currentContext.model.get('fuelProvider'));
            currentContext.$('#site-type-label').text(currentContext.model.get('siteType'));
            currentContext.$('#site-access-method-label').text(currentContext.model.get('siteAccessMethod'));
            currentContext.$('#equipment-label').text(currentContext.model.get('equipment'));
            currentContext.$('#land-owner-label').text(currentContext.model.get('landOwner'));
            currentContext.$('#notes-label').text(currentContext.model.get('notes'));
            return this;
        },
        toggleStationWarningIcon: function (hasWarnings) {
            if (hasWarnings) {
                $("#station-warning-icon").removeClass('hidden');
            } else {
                $("#station-warning-icon").addClass('hidden');
            }
        },
        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        invokeInputLinkedStationId: function (event) {
            var validPattern = /^[0-9\s]*$/;
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    this.validateAndSubmitLinkedStation();
                }
                var charCode = event.charCode || event.keyCode || event.which;
                var inputChar = String.fromCharCode(charCode);
                if (!validPattern.test(inputChar) && event.charCode !== 0) {
                    event.preventDefault();
                    return false;
                }
            }
        },
        validateAndSubmitLinkedStation: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('.add-linked-station-view-status').removeClass('hidden');
            var stationId = this.model.get('stationId');
            var linkedStationId = this.$('#linked-station-id-input').val();
            var linkedStation = {
                'stationId': stationId,
                'linkedStationId': linkedStationId
            };
            this.dispatcher.trigger(AppEventNamesEnum.addLinkedStation, linkedStation);
        },
        resetLinkedStationInput: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#linked-station-id-input').val('');
        },
        clearLinkedStation: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('.clear-linked-station-view-status').removeClass('hidden');
            var stationId = this.model.get('stationId');
            this.dispatcher.trigger(AppEventNamesEnum.clearLinkedStation, {'stationId': stationId});
        },
        onAddWarningSuccess: function (stationWarning) {
        },
        onAddWarningError: function (error) {
        },
        onAddLinkedStationSuccess: function (linkedStation) {
            var currentContext = this;
            currentContext.$('#linked-station-id-input').val('');
            var attributes = {
                linkedStationId: linkedStation.linkedStationId,
                linkedStationName: linkedStation.linkedStationName
            };
            currentContext.model.set(attributes);
            this.$('.add-linked-station-view-status').addClass('hidden');
            currentContext.renderLinkedStationView();
        },
        onAddLinkedStationError: function (error) {
            this.showError('clear linked station error!');
        },
        onClearLinkedStationSuccess: function (linkedStation) {
            var currentContext = this;
            currentContext.model.unset('linkedStationId');
            currentContext.model.unset('linkedStationName');
            currentContext.$('.clear-linked-station-view-status').addClass('hidden');
            currentContext.linkedStationView.leave();
            currentContext.renderLinkedStationView();
        },
        onClearLinkedStationError: function (error) {
            this.showError('clear linked station error!');
        },
        onLoaded: function () {
            this.renderWarningListView();
            this.renderLinkedStationView();
            this.hideLoading();
        },
        onLeave: function () {
        }
    });

    return StationView;

});