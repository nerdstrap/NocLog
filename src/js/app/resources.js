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
            'value': 'Open Station Entries'
        },
        {
            'key': 'StationEntryLogListView.refreshListButtonText',
            'value': 'Refresh'
        },
        {
            'key': 'StationEntryLogListView.showListOptionsButtonText',
            'value': 'Show Options'
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
            'value': 'loading'
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
            'value': '&#45;&#160;station&#160;&#45;'
        },
        {
            'key': 'StationEntryLogHistoryListView.regionFilterDefaultOption',
            'value': '&#45;&#160;region&#160;&#45;'
        },
        {
            'key': 'StationEntryLogHistoryListView.areaFilterDefaultOption',
            'value': '&#45;&#160;area&#160;&#45;'
        },
        {
            'key': 'StationEntryLogHistoryListView.refreshListButtonText',
            'value': 'Refresh'
        },
        {
            'key': 'StationEntryLogHistoryListView.showListOptionsButtonText',
            'value': 'Show Options'
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
            'key': 'StationListView.refreshListButtonText',
            'value': 'Refresh'
        },
        {
            'key': 'StationListView.showListOptionsButtonText',
            'value': 'Show Options'
        },
        {
            'key': 'StationListView.resetListOptionsButtonText',
            'value': 'Reset'
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
            'key': 'StationView.stationNameHeaderText',
            'value': 'Station'
        },
        {
            'key': 'StationView.contactHeaderText',
            'value': 'Contact'
        },
        {
            'key': 'StationView.regionHeaderText',
            'value': 'Region'
        },
        {
            'key': 'StationView.areaHeaderText',
            'value': 'Area'
        },
        {
            'key': 'StationView.directionsHeaderText',
            'value': 'Directions'
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