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
        'thirdPartyIconAlt': 'Third Party',
        'linkedStationIconAlt': 'Linked with T&amp;D Station: ',
        'linkedStationHazardIconAlt': 'T&D Station has Hazard',
        'tcomStationWarningsIconAlt': 'Telecom Station has Warnings',
        'checkedInWithCrew': 'Checked-in with Crew',

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
        'addButtonText': 'Add',
        'saveButtonText': 'Save',
        'deleteButtonText': 'Delete',
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
        'goToMaintainExclusionsButtonText': 'Maintain Exclusions',

        /* list item headers */
        'actualDurationHeaderText': 'Actual Duration',
        'actualOutTimeHeaderText': 'Actual Out Time',
        'additionalDurationHeaderText': 'Additional Duration',
        'additionalInfoHeaderText': 'Additional Info',
        'areaNameHeaderText': 'Area',
        'nocAreaNameHeaderText': 'TCOM Area',
        'dolAreaNameHeaderText': 'T&D Area',
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
        'linkedStationNameHeaderText': 'T&D Station Name',
        'linkedStationIdHeaderText': 'T&D Station Id',
        'middleInitialHeaderText': 'MI',
        'newExpectedOutTimeHeaderText': 'New Est. Check-out',
        'outTimeHeaderText': 'Checked-out',
        'purposeHeaderText': 'Purpose',
        'purposeOtherHeaderText': 'Other',
        'regionNameHeaderText': 'Region',
        'nocRegionNameHeaderText': 'TCOM Region',
        'dolRegionNameHeaderText': 'T&D Region',
        'showPreviousHeaderText': 'Show Previous',
        'startDateHeaderText': 'Start Date',
        'nocStationNameHeaderText': 'TCOM Station',
        'stationNameHeaderText': 'Station',
        'stationIdHeaderText': 'Station',
        'thirdPartyHeaderText': 'Third Party',
        'userNameHeaderText': 'User Name',
        'userIdHeaderText': 'User Id',
        'checkInTypeHeaderText': 'Type',
        'checkInEmployeeHeaderText': 'Employee',
        'lookupUserIdHeaderText': 'lookup',
        'overrideIdHeaderText': 'Override Id',
        'lookupOverrideIdHeaderText': 'lookup',
        'itemTextHeaderText': 'Purpose',
        'itemValueHeaderText': 'Default Duration',
        'itemEnabledHeaderText': 'Status',
        'itemOrderHeaderText': 'Sort Order',
        'statusHeaderText': 'Check-In Status',
        'withCrewHeaderText': 'Check-in With Crew?',
        
        'checkInLocationTypeHeaderText': 'Location Type',
        'checkInStationSelectHeaderText': 'Station',
        'checkInAdHocHeaderText': 'Ad Hoc',
        'adhocDescriptionHeaderText': 'Description',
        'adhocLatitudeHeaderText': 'Latitude',
        'adhocLongitudeHeaderText': 'Longitude',
        'adhocAreaHeaderText': 'Area',
        'adhocValidateCoordinatesText': 'Validate Coordinates',
        'adhocLatLonHeaderText': 'Lat/Lon',
        
        'linkedStationTDCHeaderText': 'TDC',
        'linkedStationDDCHeaderText': 'DDC',
        
        'filterStationEntryTypeHeaderText': 'Include',
        'filterStationEntryTypeTcomOption': 'TCOM Only',
        'filterStationEntryTypeTDOption': 'T&D Only',
        'filterStationEntryTypeBothOption': 'TCOM and T&D',

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
        'checkOutStationEntryLog.viewTitleText': 'Check-out Details',
        'purposeList.viewTitleText': 'Maintain Purposes',
        'exclusionList.viewTitleText': 'Maintain Exclusions',
        'warningList.viewTitleText': 'Warnings',

        'personnelList.loadingMessage': 'loading users',
        'purposeList.loadingMessage': 'loading purposes',
        'newStationEntryLog.loadingMessage': 'loading',
        'stationEntryLogList.loadingMessage': 'loading check-ins',
        'stationList.loadingMessage': 'loading stations',
        'exclusionList.loadingMessage': 'loading exclusions',
        'warningList.loadingMessage': 'loading warnings',

        'personnel.loadingMessage': 'loading user',
        'stationEntryLog.loadingMessage': 'loading check-in',
        'station.loadingMessage': 'loading station',
        
        'newPurposeItemTextHeaderText': 'New Purpose',
        'newPurposeItemOrderHeaderText': '0-999',
        
        'validationErrorMessage': 'One or more of the fields are invalid. Please update them and try again.',
        'confirmWarningErrorMessage': 'One or more of the warnings are not confirmed. Please confirm them and try again.',

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
        'radioHeaderText': 'Radio Channel',
        'contactsHeaderText': 'Emergency Contact Numbers',
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
        'transformerPoleHeaderText': 'Transformer Pole',
        'hazardWarning': 'Check-in failed due to station hazard!',
        'stationWarningsHeaderText': 'Warnings',
        'warningHeader': 'Warning',
        'warningPlaceholder': 'enter a warning description',
        'stationWarningsCheckInMessageText': 'All warnings must be confirmed, or cleared, on check-out.',
        'confirmButtonText': 'confirm',
        'clearButtonText': 'clear',
        'firstReportedByHeaderText': 'Reported By',
        'lastConfirmedByHeaderText': 'Confirmed By',
        'linkedStationHeaderText': 'Linked Station',
        'linkedStationDetailsHeaderText': 'Linked Station Details',
        'stationNotLinkedMessageText': 'Station is not currently linked.',
        'linkedStationIdPlaceholder': 'Enter T&D Station Id',
        'stationDataHeaderText': 'Additional Station Data'
    };

    var defaultResource = '';

    var resourceHelpers = {
        getResource: function(key) {
            if (resources.hasOwnProperty(key)) {
                return resources[key];
            } else {
                console.warn('resource for key "' + key + '" not found!');
            }
            return defaultResource;
        }
    };

    return resourceHelpers;
});