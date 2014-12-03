define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var resources = {
        /* app */
        'appTitleText': 'Network Operations Center | Telecom Station Entry Log',
        'loadingIconSrc': 'images/loading.gif',
        'loadingIconAlt': 'loading...',
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
        'sevenButtonText': '7',
        'fourteenButtonText': '14',
        'thirtyButtonText': '30',
        'ninetyButtonText': '90',

        'goToMapButtonText': 'View Station in Google Maps',

        'goToPersonnelListButtonText': 'Personnel',
        'goToStationEntryLogHistoryListButtonText': 'History',
        'goToStationEntryLogListButtonText': 'Entry Log',
        'goToStationListButtonText': 'Stations',
        'goToMaintainPurposesButtonText': 'Maintain Purposes',

        /* list item headers */
        'actualDurationHeaderText': 'Actual Duration',
        'actualOutTimeHeaderText': 'Actual Out Time',
        'additionalDurationHeaderText': 'Additional Duration',
        'additionalInfoHeaderText': 'Additional Info',
        'areaNameHeaderText': 'Area',
        'hasCrewHeaderText': 'Checked-in With Crew?',
        'companyNameHeaderText': 'Company Name',
        'contactNumberHeaderText': 'Mobile #',
        'daysHeaderText': 'Days',
        'durationHeaderText': 'Duration',
        'emailHeaderText': 'E-mail',
        'endDateHeaderText': 'End Date',
        'expectedOutTimeHeaderText': 'Est. Check-out',
        'firstNameHeaderText': 'First',        
        'inTimeHeaderText': 'Checked-In',
        'lastNameHeaderText': 'Last',
        'middleInitialHeaderText': 'MI',
        'newExpectedOutTimeHeaderText': 'New Est. Check-out',
        'outTimeHeaderText': 'Checked-out',
        'purposeHeaderText': 'Purpose',
        'purposeOtherHeaderText': 'Other',
        'regionNameHeaderText': 'Region',
        'showPreviousHeaderText': 'Show Previous',
        'startDateHeaderText': 'Start Date',
        'stationNameHeaderText': 'Station',
        'stationIdHeaderText': 'Station',
        'thirdPartyHeaderText': 'Third Party',
        'userNameHeaderText': 'User Name',
        'userIdHeaderText': 'User Id',
        'checkInTypeHeaderText': 'Type',
        'checkInEmployeeHeaderText': 'Employee',
        'lookupUserIdHeaderText': 'lookup',
        'itemTextHeaderText': 'Purpose',
        'itemValueHeaderText': 'Default Duration',
        'itemEnabledHeaderText': 'Status',
        'itemOrderHeaderText': 'Sort Order',
        'statusHeaderText': 'Check-In Status',
        'withCrewHeaderText': 'Check-in With Crew?',

        'itemTextPlaceholderText': 'add purpose text',
        'itemOrderPlaceholderText': 'enter a number',
        'userNameSearchQueryPlaceholderText': 'enter a name',

        'filterDefaultOption': '- select -',
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
        'personnelOpenStationEntryLog.viewTitleText': 'Open Check-in',
        'historicalStationEntryLogList.viewTitleText': 'Historical Station Entry Log',
        'stationList.viewTitleText': 'Stations',
        'newStationEntryLog.viewTitleText': 'Manual Check-in',
        'stationEntryLog.viewTitleText': 'Check-in Details',
        'editStationEntryLog.viewTitleText': 'Edit Check-in Details',
        'purposeList.viewTitleText': 'Maintain Purposes',

        'personnelList.loadingMessage': 'loading users',
        'purposeList.loadingMessage': 'loading purposes',
        'newStationEntryLog.loadingMessage': 'loading',
        'stationEntryLogList.loadingMessage': 'loading check-ins',
        'stationList.loadingMessage': 'loading stations',

        'personnel.loadingMessage': 'loading user',
        'stationEntryLog.loadingMessage': 'loading check-in',
        'station.loadingMessage': 'loading station',
        
        'newPurposeItemTextHeaderText': 'New Purpose',
        'newPurposeItemOrderHeaderText': '0-999',
        
        'validationErrorMessage': 'One or more of the fields are invalid. Please update them and try again.',

        /* filter headers */

        /* station */
        'contactSectionTitleText': 'Contact Information',
        'emergencySectionTitleText': 'Medical Emergency Information',
        'faaSectionTitleText': 'FAA Information',
        'itfoSectionTitleText': 'IT FO Information',
        'locationSectionTitleText': 'Location Details',
        'otherSectionTitleText': 'Other Information',
        /* location */
        'address1HeaderText': 'Street',
        'audinetHeaderText': 'Audinet',
        'cityHeaderText': 'City',
        'countyHeaderText': 'County',
        'directionsHeaderText': 'Directions',
        'latitudeHeaderText': 'Latitude',
        'longitudeHeaderText': 'Longitude',
        'postalCodeHeaderText': 'Postal Code',
        'stateHeaderText': 'State',
        'telephoneHeaderText': 'Telephone',
        /* contact */
        'contactAddress1HeaderText': 'Mailing Address',
        'contactCityHeaderText': 'City',
        'contactIdHeaderText': 'IT FO Contact',
        'contactPhoneHeaderText': 'Contact Phone',
        'contactPostalCodeHeaderText': 'Postal Code',
        'contactSecurityPhoneHeaderText': 'Security Phone',
        'contactStateHeaderText': 'State',
        /* emergency */
        'fireDepartmentHeaderText': 'Fire Department',
        'fireDepartmentPhoneHeaderText': 'Fire Department Phone',
        'medicalEmergencyDepartmentHeaderText': 'Medical Emergency',
        'medicalEmergencyDepartmentPhoneHeaderText': 'Medical Emergency Phone',
        'policeDepartmentHeaderText': 'Police Department',
        'policeDepartmentPhoneHeaderText': 'Police Department Phone',
        /* other */
        'complexNameHeaderText': 'Complex',
        'leasedCircuitsHeaderText': 'Leased Circuits',
        'owningOrganizationHeaderText': 'Owning Org.',
        /* faa */
        'faaRegionHeaderText': 'FAA Region',
        'faaReportableHeaderText': 'FAA Reportable',
        'nearestAirportHeaderText': 'Nearest Airport',
        'towerNumberHeaderText': 'Tower Number',
        /* it fo */
        'acCircuitFeederHeaderText': 'AC Circuit Feeder',
        'areaHeaderText': 'IT FO Area',
        'benefitingOrganizationHeaderText': 'Benefiting Org.',
        'demarcationLocationHeaderText': 'Telco Demarc.',
        'equipmentHeaderText': 'Equipment',
        'fuelProviderHeaderText': 'Fuel Provider',
        'landOwnerHeaderText': 'Land Owner',
        'notesHeaderText': 'Site Notes',
        'regionHeaderText': 'IT FO Region',
        'servingElectricUtilityHeaderText': 'Serving Electric Utility',
        'servingTelephoneCompanyHeaderText': 'Serving Telephone Co.',
        'servingUtilityTelephoneHeaderText': 'Serving Utility Phone',
        'siteAccessMethodHeaderText': 'Site Access Method',
        'siteTypeHeaderText': 'Site Type',
        'telecomNpaHeaderText': 'Telecom NPA',
        'telecomNxxHeaderText': 'Telecom NXX',
        'transformerPoleHeaderText': 'Transformer Pole'
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