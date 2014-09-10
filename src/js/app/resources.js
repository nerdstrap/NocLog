define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var resources = [
        /* app */
        {
            'key': 'appTitleButtonText',
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
        
        /* dashboard */
        {
            'key': 'showStationListButtonText',
            'value': 'Stations'
        },
        {
            'key': 'showStationEntryLogListButtonText',
            'value': 'Entry Log'
        },
        {
            'key': 'checkInButtonText',
            'value': 'Check-in'
        },
        {
            'key': 'checkOutButtonText',
            'value': 'Check-out'
        },
        
        /* station list */    
        {
            'key': 'StationListView.loadingMessage',
            'value': 'loading'
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
        
        /* station entry log list */
        {
            'key': 'StationEntryLogListView.loadingMessage',
            'value': 'loading'
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
            'value': 'Station Entry Logs'
        },
        {
            'key': 'StationEntryLogListView.listFilterHeaderText',
            'value': 'Show Me'
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
            'key': 'StationEntryLogListView.outTimeHeaderText',
            'value': 'Checked-out'
        },
        {
            'key': 'StationEntryLogListView.durationHeaderText',
            'value': 'Duration'
        },
        {
            'key': 'StationEntryLogListView.purposeHeaderText',
            'value': 'Purpose'
        },
        {
            'key': 'StationEntryLogListView.additionalInfoHeaderText',
            'value': 'Additional Info'
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