define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var MockAppRouter = Backbone.Router.extend({
        initialize: function(options) {
            this.navigate = jasmine.createSpy();
            this.swapContent = jasmine.createSpy();
            this.goToStationEntryLogList = jasmine.createSpy();
            this.goToStationList = jasmine.createSpy();
            this.goToPersonnelList = jasmine.createSpy();
            this.goToStationEntryLogHistoryList = jasmine.createSpy();
            this.goToStationEntryLogWithId = jasmine.createSpy();
            this.goToStationWithId = jasmine.createSpy();
            this.goToPersonnelWithUserId = jasmine.createSpy();
            this.goToPersonnelWithUserName = jasmine.createSpy();
            this.goToMaintainPurposes = jasmine.createSpy();
        }
    });

    return MockAppRouter;
});