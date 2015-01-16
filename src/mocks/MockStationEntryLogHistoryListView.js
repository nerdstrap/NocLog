define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            ListItemCollection = require('collections/ListItemCollection');

    var MockStationEntryLogHistoryListView = Backbone.View.extend({
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCompleteCollection = options.stationIdentifierCompleteCollection;
            this.regionCompleteCollection = options.regionCompleteCollection;
            this.areaCompleteCollection = options.areaCompleteCollection;
            this.stationIdentifierCollection = options.stationIdentifierCollection || new ListItemCollection();
            this.regionCollection = options.regionCollection || new ListItemCollection();
            this.areaCollection = options.areaCollection || new ListItemCollection();
            
            this.setUserRole = jasmine.createSpy();
            this.showLoading = jasmine.createSpy();
            this.showSuccess = jasmine.createSpy();
            this.showError = jasmine.createSpy();
        }
    });

    return MockStationEntryLogHistoryListView;

});