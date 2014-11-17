define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/Personnel'),
            StationEntryLogCollection = require('collections/StationEntryLogCollection'),
            PersonnelStationEntryLogListView = require('views/PersonnelStationEntryLogListView');

    var PersonnelView = CompositeView.extend({
        resources: function(culture) {
            return {};
        },
        initialize: function(options) {
            console.trace('PersonnelView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCollection = options.stationIdentifierCollection;
        },
        render: function() {
            console.trace('PersonnelView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            currentContext.stationEntryLogCollection = new StationEntryLogCollection();
            this.personnelStationEntryLogListViewInstance = new PersonnelStationEntryLogListView({
                collection: currentContext.stationEntryLogCollection,
                dispatcher: currentContext.dispatcher,
                stationIdentifierCollection: currentContext.stationIdentifierCollection
            });
            this.appendChildTo(this.personnelStationEntryLogListViewInstance, '#personnel-station-entry-log-list-view');

            return this;
        },
        updateViewFromModel: function(personnelModel) {
            this.$('#personnel-first-name').html(personnelModel.firstName);
            this.$('#personnel-last-name').html(personnelModel.lastName);
            this.$('#personnel-contact-number').html(personnelModel.contactNumber);
            this.$('#personnel-email').html(personnelModel.email);
        },
        _loadStationEntryLogs: function(options) {
            var currentContext = this;
            this.personnelStationEntryLogListViewInstance.showLoading();
            this.dispatcher.trigger('_loadStationEntryLogs', currentContext.stationEntryLogCollection, options);
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
        }
    });

    return PersonnelView;

});