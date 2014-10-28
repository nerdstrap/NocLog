define(function(require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        goToStationEntryLogList: 'goToStationEntryLogList',
        goToStationEntryLogHistoryList: 'goToStationEntryLogHistoryList',
        goToStationList: 'goToStationList',
        goToPersonnelList: 'goToPersonnelList',
        goToStationEntryLogWithId: 'goToStationEntryLogWithId',
        goToStationWithId: 'goToStationWithId',
        goToPersonnelWithId: 'goToPersonnelWithId',
        showStationEntryLogs: 'showStationEntryLogs',
        showOpenStationEntryLogs: 'showOpenStationEntryLogs',
        showExpiredStationEntryLogs: 'showExpiredStationEntryLogs',
        showStations: 'showStations',
        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng',
        goToNewStationEntryLog: 'goToNewStationEntryLog',
        goToCheckIn: 'goToCheckIn',
        checkInSuccess: 'checkInSuccess',
        checkInError: 'checkInError',
        closeNewCheckIn: 'closeNewCheckIn',
        checkOutSuccess: 'checkOutSuccess',
        checkOutError: 'checkOutError',
        goToLookupUserId: 'goToLookupUserId',
        userIdFound: 'userIdFound',
        userIdLookupError: 'userIdLookupError',
        leaveNewStationEntryLogView: 'leaveNewStationEntryLogView'
    };

    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});