define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var MockStationModel = Backbone.Model.extend({
        attributes: {},
        clear: jasmine.createSpy(),
        set: jasmine.createSpy()
    });

    return MockStationModel;
});