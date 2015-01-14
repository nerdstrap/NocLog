define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var mockConsole = {};
    
    mockConsole.log = jasmine.createSpy();
    mockConsole.debug = jasmine.createSpy();
    mockConsole.trace = jasmine.createSpy();
    mockConsole.info = jasmine.createSpy();
    mockConsole.warn = jasmine.createSpy();
    mockConsole.error = jasmine.createSpy();

    return mockConsole;
});