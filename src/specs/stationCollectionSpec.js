define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationCollection = require('collections/StationCollection');

    describe("Station Collection", function () {
        it("should know if collection is empty", function () {
            var collection = new StationCollection();
            expect(collection.isEmpty()).toBe(true);
        });

        // We can also use the async feature on the it function
        // to require assets for a specific test.
        it("should know if collection is not empty", function (done) {
            require(['models/StationModel'], function (StationModel) {
                var collection = new StationCollection([new StationModel()]);
                expect(collection.isEmpty()).toBe(false);
                done();
            });
        });
    });
});
