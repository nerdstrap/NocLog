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
                goToMapButtonText: appResources.getResource('StationView.goToMapButtonText'),
                locationSectionTitleText: appResources.getResource('StationView.locationSectionTitleText'),
                contactSectionTitleText: appResources.getResource('StationView.contactSectionTitleText'),
                emergencySectionTitleText: appResources.getResource('StationView.emergencySectionTitleText'),
                otherSectionTitleText: appResources.getResource('StationView.otherSectionTitleText'),
                faaSectionTitleText: appResources.getResource('StationView.faaSectionTitleText'),
                itfoSectionTitleText: appResources.getResource('StationView.itfoSectionTitleText'),
                
                audinetHeaderText: appResources.getResource('StationView.audinetHeaderText'),
                telephoneHeaderText: appResources.getResource('StationView.telephoneHeaderText'),
                address1HeaderText: appResources.getResource('StationView.address1HeaderText'),
                cityHeaderText: appResources.getResource('StationView.cityHeaderText'),
                stateHeaderText: appResources.getResource('StationView.stateHeaderText'),
                postalCodeHeaderText: appResources.getResource('StationView.postalCodeHeaderText'),
                countyHeaderText: appResources.getResource('StationView.countyHeaderText'),
                latitudeHeaderText: appResources.getResource('StationView.latitudeHeaderText'),
                longitudeHeaderText: appResources.getResource('StationView.longitudeHeaderText'),
                directionsHeaderText: appResources.getResource('StationView.directionsHeaderText'),

                contactIdHeaderText: appResources.getResource('StationView.contactIdHeaderText'),
                contactPhoneHeaderText: appResources.getResource('StationView.contactPhoneHeaderText'),
                contactSecurityPhoneHeaderText: appResources.getResource('StationView.contactSecurityPhoneHeaderText'),
                contactAddress1HeaderText: appResources.getResource('StationView.contactAddress1HeaderText'),
                contactCityHeaderText: appResources.getResource('StationView.contactCityHeaderText'),
                contactStateHeaderText: appResources.getResource('StationView.contactStateHeaderText'),
                contactPostalCodeHeaderText: appResources.getResource('StationView.contactPostalCodeHeaderText'),
                
                medicalEmergencyDepartmentHeaderText: appResources.getResource('StationView.medicalEmergencyDepartmentHeaderText'),
                medicalEmergencyDepartmentPhoneHeaderText: appResources.getResource('StationView.medicalEmergencyDepartmentPhoneHeaderText'),
                fireDepartmentHeaderText: appResources.getResource('StationView.fireDepartmentHeaderText'),
                fireDepartmentPhoneHeaderText: appResources.getResource('StationView.fireDepartmentPhoneHeaderText'),
                policeDepartmentHeaderText: appResources.getResource('StationView.policeDepartmentHeaderText'),
                policeDepartmentPhoneHeaderText: appResources.getResource('StationView.policeDepartmentPhoneHeaderText'),
                
                complexNameHeaderText: appResources.getResource('StationView.complexNameHeaderText'),
                owningOrganizationHeaderText: appResources.getResource('StationView.owningOrganizationHeaderText'),
                leasedCircuitsHeaderText: appResources.getResource('StationView.leasedCircuitsHeaderText'),
                
                faaReportableHeaderText: appResources.getResource('StationView.faaReportableHeaderText'),
                faaRegionHeaderText: appResources.getResource('StationView.faaRegionHeaderText'),
                towerNumberHeaderText: appResources.getResource('StationView.towerNumberHeaderText'),
                nearestAirportHeaderText: appResources.getResource('StationView.nearestAirportHeaderText'),
                
                benefittingOrganizationHeaderText: appResources.getResource('StationView.benefittingOrganizationHeaderText'),
                landOwnerHeaderText: appResources.getResource('StationView.landOwnerHeaderText'),
                servingUtilityTelephoneHeaderText: appResources.getResource('StationView.servingUtilityTelephoneHeaderText'),
                acCircuitFeederHeaderText: appResources.getResource('StationView.acCircuitFeederHeaderText'),
                fuelProviderHeaderText: appResources.getResource('StationView.fuelProviderHeaderText'),
                areaHeaderText: appResources.getResource('StationView.areaHeaderText'),
                regionHeaderText: appResources.getResource('StationView.regionHeaderText'),
                equipmentHeaderText: appResources.getResource('StationView.equipmentHeaderText'),
                telecomNpaHeaderText: appResources.getResource('StationView.telecomNpaHeaderText'),
                telecomNxxHeaderText: appResources.getResource('StationView.telecomNxxHeaderText'),
                servingElectricUtilityHeaderText: appResources.getResource('StationView.servingElectricUtilityHeaderText'),
                servingTelephoneCompanyHeaderText: appResources.getResource('StationView.servingTelephoneCompanyHeaderText'),
                siteAccessMethodHeaderText: appResources.getResource('StationView.siteAccessMethodHeaderText'),
                siteTypeHeaderText: appResources.getResource('StationView.siteTypeHeaderText'),
                notesHeaderText: appResources.getResource('StationView.notesHeaderText'),
                demarcationLocationHeaderText: appResources.getResource('StationView.demarcationLocationHeaderText'),
                transformerPoleHeaderText: appResources.getResource('StationView.transformerPoleHeaderText')
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