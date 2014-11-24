define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var resources = {
        /* app */
        'appTitleText': 'Network Operations Center | Telecom Station Entry Log',
        'loadingIconSrc': 'images/loading.gif',
        'logoImageAlt': 'AEP',
        'logoImageSrc': 'images/aep_logo_180x180.png',
        'logoImageSvgSrc': 'images/aep_logo_180x180.svg',

        'checkInErrorMessage': 'check-in error',
        'checkInSuccessMessage': 'check-in success',
        'checkOutErrorMessage': 'check-out error',
        'checkOutSuccessMessage': 'check-out success',

        /* buttons */
        'cancelButtonText': 'Cancel',
        'checkInButtonText': 'Check-in',
        'checkOutButtonText': 'Check-out',
        'editCheckInButtonText': 'Edit Check-in',
        'exportButtonText': 'Export',
        'newCheckInButtonText': 'Create Manual Check-in',
        'refreshButtonText': 'Refresh',
        'resetButtonText': 'Reset',
        'saveButtonText': 'Save',
        'viewCheckInButtonText': 'View Check-in',

        'goToMapButtonText': 'View Station in Google Maps',

        'goToPersonnelListButtonText': 'Personnel',
        'goToStationEntryLogHistoryListButtonText': 'History',
        'goToStationEntryLogListButtonText': 'Entry Log',
        'goToStationListButtonText': 'Stations',
        'goToMaintainPurposesButtonText': 'Maintain Purposes',

        /* list item headers */
        'actualDurationHeaderText': 'Actual Duration',
        'actualOutTimeHeaderText': 'Actual Out Time',
        'additionalInfoHeaderText': 'Additional Info',
        'areaNameHeaderText': 'Area',
        'companyNameHeaderText': 'Company Name',
        'contactNumberHeaderText': 'Mobile #',
        'daysHeaderText': 'Days',
        'durationHeaderText': 'Duration',
        'emailHeaderText': 'E-mail',
        'endDateTimeHeaderText': 'End Date/Time',
        'expectedOutTimeHeaderText': 'Est. Check-out',
        'firstNameHeaderText': 'First',
        'hasCrewHeaderText': 'Check-in With Crew?',
        'inTimeHeaderText': 'Checked-In',
        'lastNameHeaderText': 'Last',
        'middleInitialHeaderText': 'MI',
        'newDurationHeaderText': 'New Duration',
        'outTimeHeaderText': 'Checked-out',
        'purposeHeaderText': 'Purpose',
        'purposeOtherHeaderText': 'Other',
        'regionNameHeaderText': 'Region',
        'showPreviousHeaderText': 'Show Previous',
        'startDateTimeHeaderText': 'Start Date/Time',
        'stationNameHeaderText': 'Station',
        'stationIdHeaderText': 'Station',
        'thirdPartyHeaderText': 'Third Party',
        'userNameHeaderText': 'User',
        'userIdHeaderText': 'User Id',
        'checkInTypeHeaderText': 'Type',
        'checkInEmployeeHeaderText': 'Employee',
        'lookupUserIdHeaderText': 'lookup',
        'itemTextHeaderText': 'Purpose',
        'itemValueHeaderText': 'Default Duration',
        'itemEnabledHeaderText': 'Status',
        'itemOrderHeaderText': 'Sort Order',

        'itemTextPlaceholderText': 'add purpose text',
        'itemOrderPlaceholderText': 'enter a number',

        'areaNameFilterDefaultOption': '- area -',
        'durationFilterDefaultOption': '- duration -',
        'regionNameFilterDefaultOption': '- region -',
        'stationNameFilterDefaultOption': '- station -',
        'purposeFilterDefaultOption': '- purpose -',
        'itemEnabledFilterDefaultOption': '- set status -',
        'yesOptionText': 'Yes',
        'noOptionText': 'No',
        'trueOptionValue': true,
        'enabledOptionText': 'Enabled',
        'falseOptionValue': false,
        'disabledOptionText': 'Disabled',

        'statusFilterExpiredOption': 'expired',
        'statusFilterOpenOption': 'open',

        'personnelList.viewTitleText': 'Personnel',
        'stationEntryLogList.viewTitleText': 'Station Entry Logs',
        'openStationEntryLogList.viewTitleText': 'Open Station Entries',
        'historicalStationEntryLogList.viewTitleText': 'Historical Station Entry Log',
        'stationList.viewTitleText': 'Stations',
        'newStationEntryLog.viewTitleText': 'Manual Check-in',
        'purposeList.viewTitleText': 'Maintain Purposes',

        'personnelList.loadingMessage': 'loading users',
        'purposeList.loadingMessage': 'loading purposes',
        'stationEntryLogList.loadingMessage': 'loading check-ins',
        'stationList.loadingMessage': 'loading stations',

        'personnel.loadingMessage': 'loading user',
        'stationEntryLog.loadingMessage': 'loading check-in',
        'station.loadingMessage': 'loading station',
        
        'newPurposeItemTextHeaderText': 'New Purpose',
        'newPurposeItemOrderHeaderText': '0-999',

        /* filter headers */

        /* station */
        'Station.contactSectionTitleText': 'Contact Information',
        'Station.emergencySectionTitleText': 'Medical Emergency Information',
        'Station.faaSectionTitleText': 'FAA Information',
        'Station.itfoSectionTitleText': 'IT FO Information',
        'Station.locationSectionTitleText': 'Location Details',
        'Station.otherSectionTitleText': 'Other Information',
        /* location */
        'Station.address1HeaderText': 'Street',
        'Station.audinetHeaderText': 'Audinet',
        'Station.cityHeaderText': 'City',
        'Station.countyHeaderText': 'County',
        'Station.directionsHeaderText': 'Directions',
        'Station.latitudeHeaderText': 'Latitude',
        'Station.longitudeHeaderText': 'Longitude',
        'Station.postalCodeHeaderText': 'Postal Code',
        'Station.stateHeaderText': 'State',
        'Station.telephoneHeaderText': 'Telephone',
        /* contact */
        'Station.contactAddress1HeaderText': 'Mailing Address',
        'Station.contactCityHeaderText': 'City',
        'Station.contactIdHeaderText': 'IT FO Contact',
        'Station.contactPhoneHeaderText': 'Contact Phone',
        'Station.contactPostalCodeHeaderText': 'Postal Code',
        'Station.contactSecurityPhoneHeaderText': 'Security Phone',
        'Station.contactStateHeaderText': 'State',
        /* emergency */
        'Station.fireDepartmentHeaderText': 'Fire Department',
        'Station.fireDepartmentPhoneHeaderText': 'Fire Department Phone',
        'Station.medicalEmergencyDepartmentHeaderText': 'Medical Emergency',
        'Station.medicalEmergencyDepartmentPhoneHeaderText': 'Medical Emergency Phone',
        'Station.policeDepartmentHeaderText': 'Police Department',
        'Station.policeDepartmentPhoneHeaderText': 'Police Department Phone',
        /* other */
        'Station.complexNameHeaderText': 'Complex',
        'Station.leasedCircuitsHeaderText': 'Leased Circuits',
        'Station.owningOrganizationHeaderText': 'Owning Org.',
        /* faa */
        'Station.faaRegionHeaderText': 'FAA Region',
        'Station.faaReportableHeaderText': 'FAA Reportable',
        'Station.nearestAirportHeaderText': 'Nearest Airport',
        'Station.towerNumberHeaderText': 'Tower Number',
        /* it fo */
        'Station.acCircuitFeederHeaderText': 'AC Circuit Feeder',
        'Station.areaHeaderText': 'IT FO Area',
        'Station.benefitingOrganizationHeaderText': 'Benefiting Org.',
        'Station.demarcationLocationHeaderText': 'Telco Demarc.',
        'Station.equipmentHeaderText': 'Equipment',
        'Station.fuelProviderHeaderText': 'Fuel Provider',
        'Station.landOwnerHeaderText': 'Land Owner',
        'Station.notesHeaderText': 'Site Notes',
        'Station.regionHeaderText': 'IT FO Region',
        'Station.servingElectricUtilityHeaderText': 'Serving Electric Utility',
        'Station.servingTelephoneCompanyHeaderText': 'Serving Telephone Co.',
        'Station.servingUtilityTelephoneHeaderText': 'Serving Utility Phone',
        'Station.siteAccessMethodHeaderText': 'Site Access Method',
        'Station.siteTypeHeaderText': 'Site Type',
        'Station.telecomNpaHeaderText': 'Telecom NPA',
        'Station.telecomNxxHeaderText': 'Telecom NXX',
        'Station.transformerPoleHeaderText': 'Transformer Pole'
    };

    var defaultResource = '';

    var resourceHelpers = {
        getResource: function(key) {
            if (resources.hasOwnProperty(key)) {
                return resources[key];
            } else {
                console.warn('resource for key "' + key + '" not found!')
            }
            return defaultResource;
        }
    };

    return resourceHelpers;
});