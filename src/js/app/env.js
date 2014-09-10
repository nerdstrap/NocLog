define(function(require) {
    'use strict';
    
    var module = require('module'),
        globals = require('globals'),
        masterConfig = module.config(),
        apiUrl = masterConfig.apiUrl || '',
        siteRoot = masterConfig.siteRoot || '';

    var env = {
        getApiUrl: function() {
            return apiUrl;
        },
        getSiteRoot: function() {
            return siteRoot;
        }
    };
    return env;
});
