define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            AppRouter = require('routers/AppRouter');

    var appRouterSingleton = new AppRouter();
    return appRouterSingleton;
});