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
            this.stationIdentifierCompleteCollection = options.stationIdentifierCompleteCollection;
            this.regionCompleteCollection = options.regionCompleteCollection;
            this.areaCompleteCollection = options.areaCompleteCollection;

            this.stationIdentifierCollection = options.stationIdentifierCollection || new Backbone.Collection();
            this.regionCollection = options.regionCollection || new Backbone.Collection();
            this.areaCollection = options.areaCollection || new Backbone.Collection();

            this.setUserRole = jasmine.createSpy();
            this.showLoading = jasmine.createSpy();
            this.showSuccess = jasmine.createSpy();
            this.showError = jasmine.createSpy();
            this.refreshStationList = jasmine.createSpy();

        }
    });

    return MockStationListView;

});