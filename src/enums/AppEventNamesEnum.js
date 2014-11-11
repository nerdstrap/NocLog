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
        goToUpdateCheckIn: 'goToUpdateCheckIn',
        cancelCheckIn: 'cancelCheckIn',
        cancelEditCheckIn: 'cancelEditCheckIn',
        checkInSuccess: 'checkInSuccess',
        checkInError: 'checkInError',
        closeNewCheckIn: 'closeNewCheckIn',
        updateCheckInSuccess: 'updateCheckInSuccess',
        updateCheckInError: 'updateCheckInError',
        checkOutSuccess: 'checkOutSuccess',
        checkOutError: 'checkOutError',
        goToLookupUserId: 'goToLookupUserId',
        userIdFound: 'userIdFound',
        userIdLookupError: 'userIdLookupError',
        leaveNewStationEntryLogView: 'leaveNewStationEntryLogView',
        countExpiredEntriesUpdated: 'countExpiredEntriesUpdated',
        showAdminHeaderButtons: 'showAdminHeaderButtons',
        goToAddItem: 'goToAddItem',
        goToUpdateItem: 'goToUpdateItem',
        AddItemSuccess: 'AddItemSuccess',
        AddItemError: 'AddItemError',
        UpdateItemSuccess: 'UpdateItemSuccess',
        UpdateItemError: 'UpdateItemError'
    };

    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});