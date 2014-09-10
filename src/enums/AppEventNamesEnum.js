define(function(require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        goToDashboard: 'goToDashboard',
        goToStationWithId: 'goToStationWithId',
        goToPersonnelWithId: 'goToPersonnelWithId',
        goToStationEntryLogWithId: 'goToStationEntryLogWithId',
        showStationEntryLogs: 'showStationEntryLogs',
        showOpenStationEntryLogs: 'showOpenStationEntryLogs',
        showExpiredStationEntryLogs: 'showExpiredStationEntryLogs',
        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng'
    };
    
    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});