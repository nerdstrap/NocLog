define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        PersonnelCollection = require('collections/PersonnelCollection');

    describe("Personnel Collection", function () {

        it("should know if collection is empty", function () {
            var collection = new PersonnelCollection();
            expect(collection.isEmpty()).toBe(true);
        });

        it("should know if collection is not empty", function (done) {
            require(['models/PersonnelModel'], function (PersonnelModel) {
                var collection = new PersonnelCollection([new PersonnelModel()]);
                expect(collection.isEmpty()).toBe(false);
                done();
            });
        });
    });
});
