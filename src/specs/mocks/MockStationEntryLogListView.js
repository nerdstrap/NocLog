define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var MockStationEntryLogListView = Backbone.View.extend({
        initialize: function(options) {
            this.setUserRole = jasmine.createSpy();
            this.showLoading = jasmine.createSpy();
            this.showSuccess = jasmine.createSpy();
            this.showError = jasmine.createSpy();
        }
    });

    return MockStationEntryLogListView;

});