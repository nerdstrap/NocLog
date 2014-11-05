define(function(require) {
    'use strict';

    var module = require('module'),
            globals = require('globals'),
            masterConfig = module.config(),
            apiUrl = masterConfig.apiUrl || '',
            siteRoot = masterConfig.siteRoot || '',
            autoRefreshInterval = masterConfig.autoRefreshInterval || 60000,
            notificationTimeout = masterConfig.notificationTimeout || 10000,
            expirationThreshold = masterConfig.expirationThreshold || 1800000;

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }


    var env = {
        getNewGuid: function() {
            return s4() + s4();
        },
        getApiUrl: function() {
            return apiUrl;
        },
        getSiteRoot: function() {
            return siteRoot;
        },
        getAutoRefreshInterval: function() {
            return autoRefreshInterval;
        },
        getNotificationTimeout: function() {
            return notificationTimeout;
        },
        getExpirationThreshold: function() {
            return expirationThreshold;
        }
    };
    return env;
});
