define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var resources = [
        /* app */
        {
            'key': 'appTitleText',
            'value': 'Network Operations Center | Telecom Station Entry Log'
        },    
        {
            'key': 'loadingIconSrc',
            'value': 'images/loading.gif'
        },
        {
            'key': 'logoImageSrc',
            'value': 'images/aep_logo_180x180.png'
        },
        {
            'key': 'logoImageSvgSrc',
            'value': 'images/aep_logo_180x180.svg'
        },
        {
            'key': 'logoImageAlt',
            'value': 'AEP'
        },
        {
            'key': 'hazardIconSrc',
            'value': 'images/hazard_180x180.png'
        },
        {
            'key': 'hazardIconSvgSrc',
            'value': 'images/hazard_180x180.svg'
        },
        {
            'key': 'hazardIconAlt',
            'value': 'hazard'
        },
        {
            'key': 'checkedInIconSrc',
            'value': 'images/checked-in_180x180.png'
        },
        {
            'key': 'checkedInIconSvgSrc',
            'value': 'images/checked-in_180x180.svg'
        },
        {
            'key': 'checkedInIconAlt',
            'value': 'open check-in'
        },
        
        /* header */
        {
            'key': 'goToStationEntryLogListButtonText',
            'value': 'Entry Log'
        },
        {
            'key': 'goToStationEntryLogHistoryListButtonText',
            'value': 'History'
        },
        {
            'key': 'goToStationListButtonText',
            'value': 'Stations'
        },
        {
            'key': 'goToPersonnelListButtonText',
            'value': 'Personnel'
        },
        {
            'key': 'checkInButtonText',
            'value': 'Check-in'
        },
        {
            'key': 'checkOutButtonText',
            'value': 'Check-out'
        },
        {
            'key': 'extendDurationButtonText',
            'value': 'Extend duration'
        },
        
        /* station entry log list */
        {
            'key': 'StationEntryLogListView.loadingMessage',
            'value': 'loading station entries'
        },
        {
            'key': 'StationEntryLogListView.errorMessage',
            'value': 'error'
        },
        {
            'key': 'StationEntryLogListView.infoMessage',
            'value': 'info'
        },
        {
            'key': 'StationEntryLogListView.listViewTitleText',
            'value': 'Open Station Entries'
        },
        {
            'key': 'StationEntryLogListView.refreshListButtonText',
            'value': 'Refresh'
        },
        {
            'key': 'StationEntryLogListView.resetListOptionsButtonText',
            'value': 'Reset'
        },
        {
            'key': 'StationEntryLogListView.statusFilterOpenOption',
            'value': 'open'
        },
        {
            'key': 'StationEntryLogListView.statusFilterExpiredOption',
            'value': 'expired'
        },
        {
            'key': 'StationEntryLogListView.regionFilterDefaultOption',
            'value': '&#45;&#160;region&#160;&#45;'
        },
        {
            'key': 'StationEntryLogListView.areaFilterDefaultOption',
            'value': '&#45;&#160;area&#160;&#45;'
        },
        {
            'key': 'StationEntryLogListView.updateListFilterButtonText',
            'value': 'Update List'
        },
        {
            'key': 'StationEntryLogListView.stationNameHeaderText',
            'value': 'Station'
        },
        {
            'key': 'StationEntryLogListView.personnelNameHeaderText',
            'value': 'Personnel'
        },
        {
            'key': 'StationEntryLogListView.contactHeaderText',
            'value': 'Contact'
        },
        {
            'key': 'StationEntryLogListView.inTimeHeaderText',
            'value': 'Checked-In'
        },
        {
            'key': 'StationEntryLogListView.expectedOutTimeHeaderText',
            'value': 'Est. Check-out'
        },
        {
            'key': 'StationEntryLogListView.purposeHeaderText',
            'value': 'Purpose'
        },
        {
            'key': 'StationEntryLogListView.additionalInfoHeaderText',
            'value': 'Additional Info'
        },
        {
            'key': 'StationEntryLogListView.regionHeaderText',
            'value': 'Region'
        },
        {
            'key': 'StationEntryLogListView.areaHeaderText',
            'value': 'Area'
        },
        
        /* station entry log history list */
        {
            'key': 'StationEntryLogHistoryListView.loadingMessage',
            'value': 'loading station entries'
        },
        {
            'key': 'StationEntryLogHistoryListView.errorMessage',
            'value': 'error'
        },
        {
            'key': 'StationEntryLogHistoryListView.infoMessage',
            'value': 'info'
        },
        {
            'key': 'StationEntryLogHistoryListView.listViewTitleText',
            'value': 'Historical Station Entry Log'
        },
        {
            'key': 'StationEntryLogHistoryListView.stationIdentifierFilterDefaultOption',
            'value': '&#45;&#160;select&#160;&#45;'
        },
        {
            'key': 'StationEntryLogHistoryListView.regionFilterDefaultOption',
            'value': '&#45;&#160;select&#160;&#45;'
        },
        {
            'key': 'StationEntryLogHistoryListView.areaFilterDefaultOption',
            'value': '&#45;&#160;select&#160;&#45;'
        },
        {
            'key': 'StationEntryLogHistoryListView.refreshListButtonText',
            'value': 'Refresh'
        },
        {
            'key': 'StationEntryLogHistoryListView.resetListOptionsButtonText',
            'value': 'Reset'
        },
        {
            'key': 'StationEntryLogHistoryListView.stationNameHeaderText',
            'value': 'Station'
        },
        {
            'key': 'StationEntryLogHistoryListView.personnelNameHeaderText',
            'value': 'Personnel'
        },
        {
            'key': 'StationEntryLogHistoryListView.contactHeaderText',
            'value': 'Contact'
        },
        {
            'key': 'StationEntryLogHistoryListView.inTimeHeaderText',
            'value': 'Checked-In'
        },
        {
            'key': 'StationEntryLogHistoryListView.outTimeHeaderText',
            'value': 'Checked-out'
        },
        {
            'key': 'StationEntryLogHistoryListView.purposeHeaderText',
            'value': 'Purpose'
        },
        {
            'key': 'StationEntryLogHistoryListView.additionalInfoHeaderText',
            'value': 'Additional Info'
        },
        {
            'key': 'StationEntryLogHistoryListView.regionHeaderText',
            'value': 'Region'
        },
        {
            'key': 'StationEntryLogHistoryListView.areaHeaderText',
            'value': 'Area'
        },
        {
            'key': 'StationEntryLogHistoryListView.startDateTimeHeaderText',
            'value': 'Start Date/Time'
        },
        {
            'key': 'StationEntryLogHistoryListView.endDateTimeHeaderText',
            'value': 'End Date/Time'
        },
        
        /* station list */    
        {
            'key': 'StationListView.loadingMessage',
            'value': 'loading stations'
        },
        {
            'key': 'StationListView.errorMessage',
            'value': 'error'
        },
        {
            'key': 'StationListView.infoMessage',
            'value': 'info'
        },
        {
            'key': 'StationListView.listViewTitleText',
            'value': 'Stations'
        },
        {
            'key': 'StationListView.refreshListButtonText',
            'value': 'Refresh'
        },
        {
            'key': 'StationListView.resetListOptionsButtonText',
            'value': 'Reset'
        },
        {
            'key': 'StationListView.stationIdentifierSelectDefaultOption',
            'value': '&#45;&#160;jump to station&#160;&#45;'
        },
        {
            'key': 'StationListView.regionFilterDefaultOption',
            'value': '&#45;&#160;region&#160;&#45;'
        },
        {
            'key': 'StationListView.areaFilterDefaultOption',
            'value': '&#45;&#160;area&#160;&#45;'
        },
        {
            'key': 'StationListView.stationNameHeaderText',
            'value': 'Station'
        },
        {
            'key': 'StationListView.regionHeaderText',
            'value': 'Region'
        },
        {
            'key': 'StationListView.areaHeaderText',
            'value': 'Area'
        },
        
        /* personnel list */    
        {
            'key': 'PersonnelListView.loadingMessage',
            'value': 'loading'
        },
        {
            'key': 'PersonnelListView.errorMessage',
            'value': 'error'
        },
        {
            'key': 'PersonnelListView.infoMessage',
            'value': 'info'
        },
        {
            'key': 'PersonnelListView.listViewTitleText',
            'value': 'Personnel'
        },
        {
            'key': 'PersonnelListView.listFilterHeaderText',
            'value': 'Show Me'
        },
        {
            'key': 'PersonnelListView.personnelNameHeaderText',
            'value': 'Personnel'
        },
        {
            'key': 'PersonnelListView.regionHeaderText',
            'value': 'Region'
        },
        {
            'key': 'PersonnelListView.areaHeaderText',
            'value': 'Area'
        },
        
        /* station entry log */
        {
            'key': 'StationEntryLogView.stationNameHeaderText',
            'value': 'Station'
        },
        {
            'key': 'StationEntryLogView.personnelNameHeaderText',
            'value': 'Personnel'
        },
        {
            'key': 'StationEntryLogView.contactHeaderText',
            'value': 'Contact'
        },
        {
            'key': 'StationEntryLogView.inTimeHeaderText',
            'value': 'Checked-In'
        },
        {
            'key': 'StationEntryLogView.outTimeHeaderText',
            'value': 'Checked-out'
        },
        {
            'key': 'StationEntryLogView.durationHeaderText',
            'value': 'Duration'
        },
        {
            'key': 'StationEntryLogView.purposeHeaderText',
            'value': 'Purpose'
        },
        {
            'key': 'StationEntryLogView.additionalInfoHeaderText',
            'value': 'Additional Info'
        },
        {
            'key': 'StationEntryLogView.regionHeaderText',
            'value': 'Region'
        },
        {
            'key': 'StationEntryLogView.areaHeaderText',
            'value': 'Area'
        },
        
        
        
        /* station */
        {
            'key': 'StationView.goToMapButtonText',
            'value': 'View Station in Google Maps'
        },
        {
            'key': 'StationView.contactSectionTitleText',
            'value': 'Contact Information'
        },
        {
            'key': 'StationView.locationSectionTitleText',
            'value': 'Location Details'
        },
        {
            'key': 'StationView.emergencySectionTitleText',
            'value': 'Medical Emergency Information'
        },
        {
            'key': 'StationView.otherSectionTitleText',
            'value': 'Other Information'
        },
        {
            'key': 'StationView.faaSectionTitleText',
            'value': 'FAA Information'
        },
        {
            'key': 'StationView.itfoSectionTitleText',
            'value': 'IT FO Information'
        },
        /* location */
        {
            'key': 'StationView.audinetHeaderText',
            'value': 'Audinet'
        },
        {
            'key': 'StationView.telephoneHeaderText',
            'value': 'Telephone'
        },
        {
            'key': 'StationView.address1HeaderText',
            'value': 'Street'
        },
        {
            'key': 'StationView.cityHeaderText',
            'value': 'City'
        },
        {
            'key': 'StationView.stateHeaderText',
            'value': 'State'
        },
        {
            'key': 'StationView.postalCodeHeaderText',
            'value': 'Postal Code'
        },
        {
            'key': 'StationView.countyHeaderText',
            'value': 'County'
        },
        {
            'key': 'StationView.latitudeHeaderText',
            'value': 'Latitude'
        },
        {
            'key': 'StationView.longitudeHeaderText',
            'value': 'Longitude'
        },
        {
            'key': 'StationView.directionsHeaderText',
            'value': 'Directions'
        },
        /* contact */
        {
            'key': 'StationView.contactIdHeaderText',
            'value': 'IT FO Contact'
        },
        {
            'key': 'StationView.contactPhoneHeaderText',
            'value': 'Contact Phone'
        },
        {
            'key': 'StationView.contactSecurityPhoneHeaderText',
            'value': 'Security Phone'
        },
        {
            'key': 'StationView.contactAddress1HeaderText',
            'value': 'Mailing Address'
        },
        {
            'key': 'StationView.contactCityHeaderText',
            'value': 'City'
        },
        {
            'key': 'StationView.contactStateHeaderText',
            'value': 'State'
        },
        {
            'key': 'StationView.contactPostalCodeHeaderText',
            'value': 'Postal Code'
        },
        /* emergency */
        {
            'key': 'StationView.medicalEmergencyDepartmentHeaderText',
            'value': 'Medical Emergency'
        },
        {
            'key': 'StationView.medicalEmergencyDepartmentPhoneHeaderText',
            'value': 'Medical Emergency Phone'
        },
        {
            'key': 'StationView.fireDepartmentHeaderText',
            'value': 'Fire Department'
        },
        {
            'key': 'StationView.fireDepartmentPhoneHeaderText',
            'value': 'Fire Department Phone'
        },
        {
            'key': 'StationView.policeDepartmentHeaderText',
            'value': 'Police Department'
        },
        {
            'key': 'StationView.policeDepartmentPhoneHeaderText',
            'value': 'Police Department Phone'
        },
        /* other */
        {
            'key': 'StationView.complexNameHeaderText',
            'value': 'Complex'
        },
        {
            'key': 'StationView.owningOrganizationHeaderText',
            'value': 'Owning Org.'
        },
        {
            'key': 'StationView.leasedCircuitsHeaderText',
            'value': 'Leased Circuits'
        },
        /* faa */
        {
            'key': 'StationView.faaReportableHeaderText',
            'value': 'FAA Reportable'
        },
        {
            'key': 'StationView.faaRegionHeaderText',
            'value': 'FAA Region'
        },
        {
            'key': 'StationView.towerNumberHeaderText',
            'value': 'Tower Number'
        },
        {
            'key': 'StationView.nearestAirportHeaderText',
            'value': 'Nearest Airport'
        },
        /* it fo */
        {
            'key': 'StationView.benefittingOrganizationHeaderText',
            'value': 'Benefitting Org.'
        },
        {
            'key': 'StationView.landOwnerHeaderText',
            'value': 'Land Owner'
        },
        {
            'key': 'StationView.servingUtilityTelephoneHeaderText',
            'value': 'Serving Utility Phone'
        },
        {
            'key': 'StationView.acCircuitFeederHeaderText',
            'value': 'AC Circuit Feeder'
        },
        {
            'key': 'StationView.fuelProviderHeaderText',
            'value': 'Fuel Provider'
        },
        {
            'key': 'StationView.areaHeaderText',
            'value': 'IT FO Area'
        },
        {
            'key': 'StationView.regionHeaderText',
            'value': 'IT FO Region'
        },
        {
            'key': 'StationView.equipmentHeaderText',
            'value': 'Equipment'
        },
        {
            'key': 'StationView.telecomNpaHeaderText',
            'value': 'Telecom NPA'
        },
        {
            'key': 'StationView.telecomNxxHeaderText',
            'value': 'Telecom NXX'
        },
        {
            'key': 'StationView.servingElectricUtilityHeaderText',
            'value': 'Serving Electric Utility'
        },
        {
            'key': 'StationView.servingTelephoneCompanyHeaderText',
            'value': 'Serving Telephone Co.'
        },
        {
            'key': 'StationView.siteAccessMethodHeaderText',
            'value': 'Site Access Method'
        },
        {
            'key': 'StationView.siteTypeHeaderText',
            'value': 'Site Type'
        },
        {
            'key': 'StationView.notesHeaderText',
            'value': 'Site Notes'
        },
        {
            'key': 'StationView.demarcationLocationHeaderText',
            'value': 'Telco Demarc.'
        },
        {
            'key': 'StationView.transformerPoleHeaderText',
            'value': 'Transformer Pole'
        }
    ];

    var defaultResource = { 'key': '', 'value': '' };

    var resourceHelpers = {
        getResource: function (key) {
            var result = _.find(resources, function (resource) {
                return resource.key === key;
            });
            if (!result) {
                console.trace('resource for key /"' + key.toString() + '/" not found!');
                result = defaultResource;
            }
            return result;
        }
    };

    return resourceHelpers;
});