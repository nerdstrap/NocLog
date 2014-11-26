define(function(require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        
        userRoleUpdated: 'userRoleUpdated',
        
        goToStationEntryLogList: 'goToStationEntryLogList',
        goToStationEntryLogHistoryList: 'goToStationEntryLogHistoryList',
        goToStationList: 'goToStationList',
        goToPersonnelList: 'goToPersonnelList',
        goToMaintainPurposes: 'goToMaintainPurposes',
        
        goToStationEntryLogWithId: 'goToStationEntryLogWithId',
        goToStationWithId: 'goToStationWithId',
        goToPersonnelWithId: 'goToPersonnelWithId',
        
        refreshStationEntryLogList: 'refreshStationEntryLogList',
        refreshStationList: 'refreshStationList',
        refreshPersonnelList: 'refreshPersonnelList',
        refreshMaintainPurposes: 'refreshMaintainPurposes',
        
        goToNewStationEntryLog: 'goToNewStationEntryLog',
        checkIn: 'checkIn',
        cancelCheckIn: 'cancelCheckIn',
        checkInSuccess: 'checkInSuccess',
        checkInError: 'checkInError',
        
        checkOut: 'checkOut',
        checkOutSuccess: 'checkOutSuccess',
        checkOutError: 'checkOutError',
        
        updateCheckIn: 'updateCheckIn',
        cancelUpdateCheckIn: 'cancelUpdateCheckIn',
        updateCheckInSuccess: 'updateCheckInSuccess',
        updateCheckInError: 'updateCheckInError',
        
        addItem: 'addItem',
        updateItem: 'updateItem',
        addItemSuccess: 'addItemSuccess',
        addItemError: 'addItemError',
        updateItemSuccess: 'updateItemSuccess',
        updateItemError: 'updateItemError',
        
        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng',
        goToExportStationEntryLogList: 'goToExportStationEntryLogList'
    };

    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});