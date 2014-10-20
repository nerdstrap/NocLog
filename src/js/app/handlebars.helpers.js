define(function(require) {
    'use strict';

    var Handlebars = require('Handlebars'),
            utils = require('utils'),
            dates = require('dates');


    var helpers = {};

    helpers.withDefault = function(value, defaultValue, options) {
        if (value) {
            if (options.safeString) {
                return new Handlebars.SafeString(value);
            } else {
                return value;
            }
        } else {
            return new Handlebars.SafeString(defaultValue);
        }
    };
    helpers.cleanPhone = function(phone) {
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
    helpers.formatPhone = function(phone, format) {
        if (phone) {
            var cleanedPhone = helpers.cleanPhone(phone);
            var formattedPhone = cleanedPhone;
            if (cleanedPhone.length === 10) {
                formattedPhone = '(' + cleanedPhone.substr(0, 3) + ') ' + cleanedPhone.substr(3, 3) + '-' + cleanedPhone.substr(6, 4);
            }
            if (cleanedPhone.length === 7) {
                formattedPhone = cleanedPhone.substr(0, 3) + '-' + cleanedPhone.substr(3, 4);
            }
            return formattedPhone;
        }
        return phone;
    };
    helpers.formatPhoneWithDefault = function(phone, format, defaultValue) {
        if (phone) {
            return helpers.formatPhone(phone, format);
        }
        return helpers.withDefault(phone, defaultValue);
    };
    helpers.formatDate = function(date, format) {
        date = new Date(date);
        return dates.format(date, format);
    };
    helpers.formatDateWithDefault = function(date, format, defaultValue) {
        if (date) {
            return helpers.formatDate(date, format);
        }
        return helpers.withDefault(date, defaultValue);
    };

    for (var helper in helpers) {
        Handlebars.registerHelper(helper, helpers[helper]);
    }
    
    return helpers;
});