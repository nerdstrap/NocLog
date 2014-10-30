define(function(require) {
    'use strict';
    
    var module = require('module'),
        globals = require('globals'),
        masterConfig = module.config(),
        apiUrl = masterConfig.apiUrl || '',
        siteRoot = masterConfig.siteRoot || '',
        autoRefreshInterval = masterConfig.autoRefreshInterval || 60000,
        notificationTimeout = masterConfig.notificationTimeout || 5000,
        expirationThreshold = masterConfig.expirationThreshold || 1800000;

    var env = {
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
