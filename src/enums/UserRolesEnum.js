define(function(require) {
    'use strict';

    var UserRolesEnum = {
        NocAdmin: 'NOC_Admin',
        NocUser: 'NOC_User',
        NocRead: 'NOC_Read'
    };

    if (Object.freeze) {
        Object.freeze(UserRolesEnum);
    }

    return UserRolesEnum;
});
