define(function(require) {
    'use strict';
    
    var module = require('module'),
        globals = require('globals'),
        masterConfig = module.config(),
        apiUrl = masterConfig.apiUrl || '',
        siteRoot = masterConfig.siteRoot || '',
        autoRefreshInterval = masterConfig.getAutoRefreshInterval || 60000;

    var env = {
        getApiUrl: function() {
            return apiUrl;
        },
        getSiteRoot: function() {
            return siteRoot;
        },
        getAutoRefreshInterval: function() {
            return autoRefreshInterval;
        }
    };
    return env;
});
