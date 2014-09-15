define(function(require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        goToStationEntryLogList: 'goToStationEntryLogList',
        goToStationList: 'goToStationList',
        goToPersonnelList: 'goToPersonnelList',
        goToStationEntryLogWithId: 'goToStationEntryLogWithId',
        goToStationWithId: 'goToStationWithId',
        goToPersonnelWithId: 'goToPersonnelWithId',
        showStationEntryLogs: 'showStationEntryLogs',
        showOpenStationEntryLogs: 'showOpenStationEntryLogs',
        showExpiredStationEntryLogs: 'showExpiredStationEntryLogs',
        showStations: 'showStations',
        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng'
    };
    
    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});