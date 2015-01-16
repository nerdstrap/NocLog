define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var MockEditPurposeListView = Backbone.View.extend({
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.durationCollection = options.durationCollection;

            this.setUserRole = jasmine.createSpy();
            this.showLoading = jasmine.createSpy();
            this.showError = jasmine.createSpy();
        }
    });

    return MockEditPurposeListView;

});