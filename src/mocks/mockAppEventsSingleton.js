define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            MockDispatcher = require('mocks/MockDispatcher');

    var mockDispatcherInstance = new MockDispatcher();
    return mockDispatcherInstance;
});