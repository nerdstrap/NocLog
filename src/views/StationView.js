define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/Station');

    var StationView = CompositeView.extend({
        resources: function(culture) {
            return {
                goToMapButtonText: appResources.getResource('StationView.goToMapButtonText').value,
                locationSectionTitleText: appResources.getResource('StationView.locationSectionTitleText').value,
                contactSectionTitleText: appResources.getResource('StationView.contactSectionTitleText').value,
                emergencySectionTitleText: appResources.getResource('StationView.emergencySectionTitleText').value,
                otherSectionTitleText: appResources.getResource('StationView.otherSectionTitleText').value,
                faaSectionTitleText: appResources.getResource('StationView.faaSectionTitleText').value,
                itfoSectionTitleText: appResources.getResource('StationView.itfoSectionTitleText').value,
                
                audinetHeaderText: appResources.getResource('StationView.audinetHeaderText').value,
                telephoneHeaderText: appResources.getResource('StationView.telephoneHeaderText').value,
                address1HeaderText: appResources.getResource('StationView.address1HeaderText').value,
                cityHeaderText: appResources.getResource('StationView.cityHeaderText').value,
                stateHeaderText: appResources.getResource('StationView.stateHeaderText').value,
                postalCodeHeaderText: appResources.getResource('StationView.postalCodeHeaderText').value,
                countyHeaderText: appResources.getResource('StationView.countyHeaderText').value,
                latitudeHeaderText: appResources.getResource('StationView.latitudeHeaderText').value,
                longitudeHeaderText: appResources.getResource('StationView.longitudeHeaderText').value,
                directionsHeaderText: appResources.getResource('StationView.directionsHeaderText').value,

                contactIdHeaderText: appResources.getResource('StationView.contactIdHeaderText').value,
                contactPhoneHeaderText: appResources.getResource('StationView.contactPhoneHeaderText').value,
                contactSecurityPhoneHeaderText: appResources.getResource('StationView.contactSecurityPhoneHeaderText').value,
                contactAddress1HeaderText: appResources.getResource('StationView.contactAddress1HeaderText').value,
                contactCityHeaderText: appResources.getResource('StationView.contactCityHeaderText').value,
                contactStateHeaderText: appResources.getResource('StationView.contactStateHeaderText').value,
                contactPostalCodeHeaderText: appResources.getResource('StationView.contactPostalCodeHeaderText').value,
                
                medicalEmergencyDepartmentHeaderText: appResources.getResource('StationView.medicalEmergencyDepartmentHeaderText').value,
                medicalEmergencyDepartmentPhoneHeaderText: appResources.getResource('StationView.medicalEmergencyDepartmentPhoneHeaderText').value,
                fireDepartmentHeaderText: appResources.getResource('StationView.fireDepartmentHeaderText').value,
                fireDepartmentPhoneHeaderText: appResources.getResource('StationView.fireDepartmentPhoneHeaderText').value,
                policeDepartmentHeaderText: appResources.getResource('StationView.policeDepartmentHeaderText').value,
                policeDepartmentPhoneHeaderText: appResources.getResource('StationView.policeDepartmentPhoneHeaderText').value,
                
                complexNameHeaderText: appResources.getResource('StationView.complexNameHeaderText').value,
                owningOrganizationHeaderText: appResources.getResource('StationView.owningOrganizationHeaderText').value,
                leasedCircuitsHeaderText: appResources.getResource('StationView.leasedCircuitsHeaderText').value,
                
                faaReportableHeaderText: appResources.getResource('StationView.faaReportableHeaderText').value,
                faaRegionHeaderText: appResources.getResource('StationView.faaRegionHeaderText').value,
                towerNumberHeaderText: appResources.getResource('StationView.towerNumberHeaderText').value,
                nearestAirportHeaderText: appResources.getResource('StationView.nearestAirportHeaderText').value,
                
                benefittingOrganizationHeaderText: appResources.getResource('StationView.benefittingOrganizationHeaderText').value,
                landOwnerHeaderText: appResources.getResource('StationView.landOwnerHeaderText').value,
                servingUtilityTelephoneHeaderText: appResources.getResource('StationView.servingUtilityTelephoneHeaderText').value,
                acCircuitFeederHeaderText: appResources.getResource('StationView.acCircuitFeederHeaderText').value,
                fuelProviderHeaderText: appResources.getResource('StationView.fuelProviderHeaderText').value,
                areaHeaderText: appResources.getResource('StationView.areaHeaderText').value,
                regionHeaderText: appResources.getResource('StationView.regionHeaderText').value,
                equipmentHeaderText: appResources.getResource('StationView.equipmentHeaderText').value,
                telecomNpaHeaderText: appResources.getResource('StationView.telecomNpaHeaderText').value,
                telecomNxxHeaderText: appResources.getResource('StationView.telecomNxxHeaderText').value,
                servingElectricUtilityHeaderText: appResources.getResource('StationView.servingElectricUtilityHeaderText').value,
                servingTelephoneCompanyHeaderText: appResources.getResource('StationView.servingTelephoneCompanyHeaderText').value,
                siteAccessMethodHeaderText: appResources.getResource('StationView.siteAccessMethodHeaderText').value,
                siteTypeHeaderText: appResources.getResource('StationView.siteTypeHeaderText').value,
                notesHeaderText: appResources.getResource('StationView.notesHeaderText').value,
                demarcationLocationHeaderText: appResources.getResource('StationView.demarcationLocationHeaderText').value,
                transformerPoleHeaderText: appResources.getResource('StationView.transformerPoleHeaderText').value
            };
        },
        initialize: function(options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'sync', this.render);
        },
        render: function() {
            console.trace('StationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .directions-link': 'goToDirectionsWithLatLng',
            'click #station-show-contact-details-button': 'toggleContactDetailsPanel',
            'click #station-show-location-details-button': 'toggleLocationDetailsPanel',
            'click #station-show-emergency-details-button': 'toggleEmergencyDetailsPanel',
            'click #station-show-other-details-button': 'toggleOtherDetailsPanel',
            'click #station-show-faa-details-button': 'toggleFAADetailsPanel',
            'click #station-show-complex-details-button': 'toggleComplexDetailsPanel',
            'click #station-show-it-fo-details-button': 'toggleITFODetailsPanel'
        },
        toggleContactDetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-contact-details-icon').toggle('hidden');
            this.$('#station-hide-contact-details-icon').toggle('hidden');
            this.$('#station-contact-details-view').toggle('hidden');
        },
        toggleLocationDetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-location-details-icon').toggle('hidden');
            this.$('#station-hide-location-details-icon').toggle('hidden');
            this.$('#station-location-details-view').toggle('hidden');
        },
        toggleEmergencyDetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-emergency-details-icon').toggle('hidden');
            this.$('#station-hide-emergency-details-icon').toggle('hidden');
            this.$('#station-emergency-details-view').toggle('hidden');
        },
        toggleOtherDetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-other-details-icon').toggle('hidden');
            this.$('#station-hide-other-details-icon').toggle('hidden');
            this.$('#station-other-details-view').toggle('hidden');
        },
        toggleFAADetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-faa-details-icon').toggle('hidden');
            this.$('#station-hide-faa-details-icon').toggle('hidden');
            this.$('#station-faa-details-view').toggle('hidden');
        },
        toggleITFODetailsPanel: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#station-show-it-fo-details-icon').toggle('hidden');
            this.$('#station-hide-it-fo-details-icon').toggle('hidden');
            this.$('#station-it-fo-details-view').toggle('hidden');
        },
        goToDirectionsWithLatLng: function(event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        }
    });

    return StationView;

});