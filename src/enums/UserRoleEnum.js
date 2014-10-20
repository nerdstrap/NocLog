define(function(require) {
    'use strict';

    var UserRoleEnum = {
        NocAdmin: 'NOC_Admin',
        NocUser: 'NOC_User',
        NocRead: 'NOC_Read'
    };

    if (Object.freeze) {
        Object.freeze(UserRoleEnum);
    }

    return UserRoleEnum;
});
