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
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc'),
                loadingMessage: appResources.getResource('PersonnelView.loadingMessage')
            };
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

            return this;
        },
        updateViewFromModel: function(personnelModel) {
            this.$('#personnel-name').html(personnelModel.firstName + '&nbsp;' + personnelModel.lastName);
            this.$('#personnel-contact-number').html(personnelModel.contactNumber);
            this.$('#personnel-email').html(personnelModel.email);
        },
        _addStationEntryLogs: function() {
            var currentContext = this;
            currentContext.stationEntryLogCollection = new StationEntryLogCollection();
            this.personnelStationEntryLogListViewInstance = new PersonnelStationEntryLogListView({
                collection: currentContext.stationEntryLogCollection,
                dispatcher: currentContext.dispatcher,
                stationIdentifierCollection: currentContext.stationIdentifierCollection
            });
            this.appendChildTo(this.personnelStationEntryLogListViewInstance, '#personnel-station-entry-log-list-view');
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