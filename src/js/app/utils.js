define(function(require) {
    'use strict';

    var utils = {};

    utils.cleanPhone = function(phone) {
        if (phone) {
            var originalPhone = phone;
            var cleanedPhone = originalPhone.replace(/[^0-9]/g, '');
            if (cleanedPhone.length > 10) {
                cleanedPhone = cleanedPhone.substring(cleanedPhone.length - 10);
            }
            return cleanedPhone;
        }
        return phone;
    };

    utils.addMinutes = function(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    };

    return utils;
});
