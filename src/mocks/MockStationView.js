define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            ListItemCollection = require('collections/StationCollection');

    var MockStationListView = Backbone.View.extend({
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.setUserRole = jasmine.createSpy();
            this.showLoading = jasmine.createSpy();
            this.showSuccess = jasmine.createSpy();
            this.showError = jasmine.createSpy();

        }
    });

    return MockStationListView;

});