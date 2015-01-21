define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var MockStationEntryLogCollection = Backbone.Collection.extend({
        initialize: function(options) {
            options || (options = {});
            this.sortAttribute = options.sortAttribute || 'expectedOutTime';
            this.sortDirection = options.sortDirection || 1;
            
            this.reset = jasmine.createSpy();
            this.setSortAttribute = jasmine.createSpy();
            this.comparator = jasmine.createSpy();
            this.onAdd = jasmine.createSpy();
            this.onRemove = jasmine.createSpy();
            this.onReset = jasmine.createSpy();
            this.setCounts = jasmine.createSpy();
        }
    });

    return MockStationEntryLogCollection;
});