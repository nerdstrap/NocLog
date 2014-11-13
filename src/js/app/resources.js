define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var resources = {
        /* app */
        'appTitleText': 'Network Operations Center | Telecom Station Entry Log',
        'checkedInIconAlt': 'open check-in',
        'checkedInIconSrc': 'images/checked-in_180x180.png',
        'checkedInIconSvgSrc': 'images/checked-in_180x180.svg',
        'hazardIconAlt': 'hazard',
        'hazardIconSrc': 'images/hazard_180x180.png',
        'hazardIconSvgSrc': 'images/hazard_180x180.svg',
        'loadingIconSrc': 'images/loading.gif',
        'logoImageAlt': 'AEP',
        'logoImageSrc': 'images/aep_logo_180x180.png',
        'logoImageSvgSrc': 'images/aep_logo_180x180.svg',
        /* header */
        'checkInButtonText': 'Check-in',
        'checkInErrorMessage': 'check-in error',
        'checkInSucessMessage': 'check-in success',
        'checkOutButtonText': 'Check-out',
        'checkOutErrorMessage': 'check-out error',
        'checkOutSucessMessage': 'check-out success',
        'editCheckInButtonText': 'Edit Check-in',
        'extendDurationButtonText': 'Extend duration',
        'goToPersonnelListButtonText': 'Personnel',
        'goToStationEntryLogHistoryListButtonText': 'History',
        'goToStationEntryLogListButtonText': 'Entry Log',
        'goToStationListButtonText': 'Stations',
        'goToMaintainPurposesButtonText': 'Maintain Purposes',
        'viewCheckInButtonText': 'View Check-in',
        /* station entry log list */
        'StationEntryLogListView.additionalInfoHeaderText': 'Additional Info',
        'StationEntryLogListView.areaFilterDefaultOption': '&#45;&#160;area&#160;&#45;',
        'StationEntryLogListView.areaHeaderText': 'Area',
        'StationEntryLogListView.contactHeaderText': 'Contact',
        'StationEntryLogListView.errorMessage': 'error',
        'StationEntryLogListView.expectedOutTimeHeaderText': 'Est. Check-out',
        'StationEntryLogListView.inTimeHeaderText': 'Checked-In',
        'StationEntryLogListView.infoMessage': 'info',
        'StationEntryLogListView.listViewTitleText': 'Open Station Entries',
        'StationEntryLogListView.loadingMessage': 'loading station entries',
        'StationEntryLogListView.newStationEntryLogButtonText': 'Create Manual Check-in',
        'StationEntryLogListView.personnelNameHeaderText': 'Personnel',
        'StationEntryLogListView.purposeHeaderText': 'Purpose',
        'StationEntryLogListView.refreshListButtonText': 'Refresh',
        'StationEntryLogListView.regionFilterDefaultOption': '&#45;&#160;region&#160;&#45;',
        'StationEntryLogListView.regionHeaderText': 'Region',
        'StationEntryLogListView.resetListOptionsButtonText': 'Reset',
        'StationEntryLogListView.stationNameHeaderText': 'Station',
        'StationEntryLogListView.statusFilterExpiredOption': 'expired',
        'StationEntryLogListView.statusFilterOpenOption': 'open',
        'StationEntryLogListView.updateListFilterButtonText': 'Update List',
        /* station entry log history list */
        'StationEntryLogHistoryListView.additionalInfoHeaderText': 'Additional Info',
        'StationEntryLogHistoryListView.areaFilterDefaultOption': '&#45;&#160;select&#160;&#45;',
        'StationEntryLogHistoryListView.areaHeaderText': 'Area',
        'StationEntryLogHistoryListView.contactHeaderText': 'Contact',
        'StationEntryLogHistoryListView.endDateTimeHeaderText': 'End Date/Time',
        'StationEntryLogHistoryListView.errorMessage': 'error',
        'StationEntryLogHistoryListView.inTimeHeaderText': 'Checked-In',
        'StationEntryLogHistoryListView.infoMessage': 'info',
        'StationEntryLogHistoryListView.listViewTitleText': 'Historical Station Entry Log',
        'StationEntryLogHistoryListView.loadingMessage': 'loading station entries',
        'StationEntryLogHistoryListView.outTimeHeaderText': 'Checked-out',
        'StationEntryLogHistoryListView.personnelNameHeaderText': 'Personnel',
        'StationEntryLogHistoryListView.purposeHeaderText': 'Purpose',
        'StationEntryLogHistoryListView.refreshListButtonText': 'Refresh',
        'StationEntryLogHistoryListView.regionFilterDefaultOption': '&#45;&#160;select&#160;&#45;',
        'StationEntryLogHistoryListView.regionHeaderText': 'Region',
        'StationEntryLogHistoryListView.resetListOptionsButtonText': 'Reset',
        'StationEntryLogHistoryListView.startDateTimeHeaderText': 'Start Date/Time',
        'StationEntryLogHistoryListView.stationIdentifierFilterDefaultOption': '&#45;&#160;select&#160;&#45;',
        'StationEntryLogHistoryListView.stationNameHeaderText': 'Station',
        /* station list */
        'StationListView.areaFilterDefaultOption': '&#45;&#160;area&#160;&#45;',
        'StationListView.areaHeaderText': 'Area',
        'StationListView.errorMessage': 'error',
        'StationListView.infoMessage': 'info',
        'StationListView.listViewTitleText': 'Stations',
        'StationListView.loadingMessage': 'loading stations',
        'StationListView.refreshListButtonText': 'Refresh',
        'StationListView.regionFilterDefaultOption': '&#45;&#160;region&#160;&#45;',
        'StationListView.regionHeaderText': 'Region',
        'StationListView.resetListOptionsButtonText': 'Reset',
        'StationListView.stationIdentifierSelectDefaultOption': '&#45;&#160;jump to station&#160;&#45;',
        'StationListView.stationNameHeaderText': 'Station',
        /* personnel list */
        'PersonnelListView.areaHeaderText': 'Area',
        'PersonnelListView.errorMessage': 'error',
        'PersonnelListView.infoMessage': 'info',
        'PersonnelListView.listFilterHeaderText': 'Show Me',
        'PersonnelListView.listViewTitleText': 'Personnel',
        'PersonnelListView.loadingMessage': 'loading',
        'PersonnelListView.personnelNameHeaderText': 'Personnel',
        'PersonnelListView.regionHeaderText': 'Region',
        /* station entry log */
        'StationEntryLogView.additionalInfoHeaderText': 'Additional Info',
        'StationEntryLogView.areaHeaderText': 'Area',
        'StationEntryLogView.contactHeaderText': 'Contact',
        'StationEntryLogView.durationHeaderText': 'Duration',
        'StationEntryLogView.inTimeHeaderText': 'Checked-In',
        'StationEntryLogView.outTimeHeaderText': 'Checked-out',
        'StationEntryLogView.personnelNameHeaderText': 'Personnel',
        'StationEntryLogView.purposeHeaderText': 'Purpose',
        'StationEntryLogView.regionHeaderText': 'Region',
        'StationEntryLogView.stationNameHeaderText': 'Station',
        /* station */
        'StationView.contactSectionTitleText': 'Contact Information',
        'StationView.emergencySectionTitleText': 'Medical Emergency Information',
        'StationView.faaSectionTitleText': 'FAA Information',
        'StationView.goToMapButtonText': 'View Station in Google Maps',
        'StationView.itfoSectionTitleText': 'IT FO Information',
        'StationView.loadingMessage': 'loading station',
        'StationView.locationSectionTitleText': 'Location Details',
        'StationView.otherSectionTitleText': 'Other Information',
        /* location */
        'StationView.address1HeaderText': 'Street',
        'StationView.audinetHeaderText': 'Audinet',
        'StationView.cityHeaderText': 'City',
        'StationView.countyHeaderText': 'County',
        'StationView.directionsHeaderText': 'Directions',
        'StationView.latitudeHeaderText': 'Latitude',
        'StationView.longitudeHeaderText': 'Longitude',
        'StationView.postalCodeHeaderText': 'Postal Code',
        'StationView.stateHeaderText': 'State',
        'StationView.telephoneHeaderText': 'Telephone',
        /* contact */
        'StationView.contactAddress1HeaderText': 'Mailing Address',
        'StationView.contactCityHeaderText': 'City',
        'StationView.contactIdHeaderText': 'IT FO Contact',
        'StationView.contactPhoneHeaderText': 'Contact Phone',
        'StationView.contactPostalCodeHeaderText': 'Postal Code',
        'StationView.contactSecurityPhoneHeaderText': 'Security Phone',
        'StationView.contactStateHeaderText': 'State',
        /* emergency */
        'StationView.fireDepartmentHeaderText': 'Fire Department',
        'StationView.fireDepartmentPhoneHeaderText': 'Fire Department Phone',
        'StationView.medicalEmergencyDepartmentHeaderText': 'Medical Emergency',
        'StationView.medicalEmergencyDepartmentPhoneHeaderText': 'Medical Emergency Phone',
        'StationView.policeDepartmentHeaderText': 'Police Department',
        'StationView.policeDepartmentPhoneHeaderText': 'Police Department Phone',
        /* other */
        'StationView.complexNameHeaderText': 'Complex',
        'StationView.leasedCircuitsHeaderText': 'Leased Circuits',
        'StationView.owningOrganizationHeaderText': 'Owning Org.',
        /* faa */
        'StationView.faaRegionHeaderText': 'FAA Region',
        'StationView.faaReportableHeaderText': 'FAA Reportable',
        'StationView.nearestAirportHeaderText': 'Nearest Airport',
        'StationView.towerNumberHeaderText': 'Tower Number',
        /* it fo */
        'StationView.acCircuitFeederHeaderText': 'AC Circuit Feeder',
        'StationView.areaHeaderText': 'IT FO Area',
        'StationView.benefittingOrganizationHeaderText': 'Benefitting Org.',
        'StationView.demarcationLocationHeaderText': 'Telco Demarc.',
        'StationView.equipmentHeaderText': 'Equipment',
        'StationView.fuelProviderHeaderText': 'Fuel Provider',
        'StationView.landOwnerHeaderText': 'Land Owner',
        'StationView.notesHeaderText': 'Site Notes',
        'StationView.regionHeaderText': 'IT FO Region',
        'StationView.servingElectricUtilityHeaderText': 'Serving Electric Utility',
        'StationView.servingTelephoneCompanyHeaderText': 'Serving Telephone Co.',
        'StationView.servingUtilityTelephoneHeaderText': 'Serving Utility Phone',
        'StationView.siteAccessMethodHeaderText': 'Site Access Method',
        'StationView.siteTypeHeaderText': 'Site Type',
        'StationView.telecomNpaHeaderText': 'Telecom NPA',
        'StationView.telecomNxxHeaderText': 'Telecom NXX',
        'StationView.transformerPoleHeaderText': 'Transformer Pole',
        /* new station entry log */
        'NewStationEntryLogView.additionalInfoHeaderText': 'Additional Info',
        'NewStationEntryLogView.cancelButtonText': 'Cancel',
        'NewStationEntryLogView.companyNameHeaderText': 'Company Name',
        'NewStationEntryLogView.contactNumberHeaderText': 'Mobile&#160;&#35;',
        'NewStationEntryLogView.durationDefaultOption': '&#45;&#160;duration&#160;&#45;',
        'NewStationEntryLogView.durationHeaderText': 'Duration',
        'NewStationEntryLogView.emailHeaderText': 'E-mail',
        'NewStationEntryLogView.expectedOutTimeHeaderText': 'Est. Check-out',
        'NewStationEntryLogView.firstNameHeaderText': 'First',
        'NewStationEntryLogView.hasCrewHeaderText': 'Check-in With Crew?',
        'NewStationEntryLogView.hasCrewNoOption': '&#45;&#160;no&#160;&#45;',
        'NewStationEntryLogView.hasCrewYesOption': '&#45;&#160;yes&#160;&#45;',
        'NewStationEntryLogView.lastNameHeaderText': 'Last',
        'NewStationEntryLogView.middleInitialHeaderText': 'MI',
        'NewStationEntryLogView.purposeDefaultOption': '&#45;&#160;purpose&#160;&#45;',
        'NewStationEntryLogView.purposeHeaderText': 'Purpose',
        'NewStationEntryLogView.purposeOtherHeaderText': 'Other',
        'NewStationEntryLogView.saveButtonText': 'Save',
        'NewStationEntryLogView.stationIdDefaultOption': '&#45;&#160;station&#160;&#45;',
        'NewStationEntryLogView.stationIdHeaderText': 'Station',
        'NewStationEntryLogView.thirdPartyHeaderText': 'Third Party',
        'NewStationEntryLogView.userIdHeaderText': 'User Id',
        'NewStationEntryLogView.viewTitleText': 'Manual Check-in',
        /* edit station entry log */
        'EditStationEntryLogView.actualDurationHeaderText': 'Actual Duration',
        'EditStationEntryLogView.actualOutTimeHeaderText': 'Actual Out Time',
        'EditStationEntryLogView.additionalInfoHeaderText': 'Additional Info',
        'EditStationEntryLogView.cancelButtonText': 'Cancel',
        'EditStationEntryLogView.companyNameHeaderText': 'Company Name',
        'EditStationEntryLogView.contactNumberHeaderText': 'Mobile&#160;&#35;',
        'EditStationEntryLogView.durationDefaultOption': '&#45;&#160;duration&#160;&#45;',
        'EditStationEntryLogView.durationHeaderText': 'Duration',
        'EditStationEntryLogView.durationHeaderTextNew': 'New Duration',
        'EditStationEntryLogView.emailHeaderText': 'E-mail',
        'EditStationEntryLogView.expectedOutTimeHeaderText': 'Est. Check-out',
        'EditStationEntryLogView.expectedOutTimeHeaderTextNew': 'New Est. Check-out',
        'EditStationEntryLogView.firstNameHeaderText': 'First',
        'EditStationEntryLogView.hasCrewHeaderText': 'Check-in With Crew?',
        'EditStationEntryLogView.hasCrewNoOption': '&#45;&#160;no&#160;&#45;',
        'EditStationEntryLogView.hasCrewYesOption': '&#45;&#160;yes&#160;&#45;',
        'EditStationEntryLogView.lastNameHeaderText': 'Last',
        'EditStationEntryLogView.loadingMessage': 'loading check-in',
        'EditStationEntryLogView.middleInitialHeaderText': 'MI',
        'EditStationEntryLogView.purposeDefaultOption': '&#45;&#160;purpose&#160;&#45;',
        'EditStationEntryLogView.purposeHeaderText': 'Purpose',
        'EditStationEntryLogView.purposeOtherHeaderText': 'Other',
        'EditStationEntryLogView.saveButtonText': 'Save',
        'EditStationEntryLogView.stationIdDefaultOption': '&#45;&#160;station&#160;&#45;',
        'EditStationEntryLogView.stationIdHeaderText': 'Station',
        'EditStationEntryLogView.userIdHeaderText': 'User Id',
         /* edit purpose list view */
        'EditPurposeListView.loadingMessage': 'loading purposes'
    };

    var defaultResource = '';

    var resourceHelpers = {
        getResource: function(key) {
            if (resources.hasOwnProperty(key)) {
                return resources[key];
            }
            return defaultResource;
        }
    };

    return resourceHelpers;
});