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
            PersonnelStationEntryLogListItemView = require('views/PersonnelStationEntryLogListItemView');

    var PersonnelView = CompositeView.extend({
        resources: function(culture) {
            return {
                'stationNameHeaderText': 'Station',
                'inTimeHeaderText': 'In Time',
                'outTimeHeaderText': 'Out Time',
                'purposeHeaderText': 'Purpose',
                'additionalInfoHeaderText': 'Additional Info'
            };
        },
        initialize: function(options) {
            console.trace('PersonnelView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'sync', this.render);
        },
        render: function() {
            console.trace('PersonnelView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        loadStationEntryLogs: function() {
            var currentContext = this;
            currentContext.stationEntryLogCollection = new StationEntryLogCollection();
            this.listenToOnce(currentContext.stationEntryLogCollection, 'reset', currentContext.renderStationEntryLogs);
            this.dispatcher.trigger('_loadStationEntryLogs', currentContext.stationEntryLogCollection, {userId: currentContext.model.get('userId')});
        },
        renderStationEntryLogs: function() {
            var currentContext = this;
           _.each(currentContext.stationEntryLogCollection.models, currentContext.addOneStationEntryLog, currentContext);
        },
        addOneStationEntryLog: function(stationEntryLog) {
            var currentContext = this;
            var personnelStationEntryLogListItemViewInstance = new PersonnelStationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(personnelStationEntryLogListItemViewInstance, '#personnel-station-entry-log-list');
        }
    });

    return PersonnelView;

});