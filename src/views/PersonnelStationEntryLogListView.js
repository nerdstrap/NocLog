define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            PersonnelStationEntryLogListItemView = require('views/PersonnelStationEntryLogListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            utils = require('utils'),
            template = require('hbs!templates/PersonnelStationEntryLogList');

    var PersonnelStationEntryLogListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('PersonnelStationEntryLogListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.stationIdentifierCollection = options.stationIdentifierCollection || new Backbone.Collection();

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationNameFilter);
            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(appEvents, AppEventNamesEnum.userRoleUpdated, this.userRoleUpdated);
        },
        render: function() {
            console.trace('PersonnelStationEntryLogListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.setDefaultDateFilters(-1);

            return this;
        },
        events: {
            'click #refresh-station-entry-log-list-button': 'dispatchRefreshStationEntryLogList',
            'click #reset-station-entry-log-list-button': 'resetStationEntryLogList',
            'click .sort-button': 'sortListView',
            'click .close-alert-box-button': 'closeAlertBox',
            'click #export-station-entry-log-list-button': 'exportStationEntryLogList',
            'click .refresh-button': 'setDateFilter'
        },
        addAll: function() {
            this._leaveChildren();
            this.clearSortIndicators();
            _.each(this.collection.models, this.addOne, this);
            this.addSortIndicators();
            this.hideLoading();
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new PersonnelStationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationEntryLogListItemView, '#station-entry-log-list-item-container');
        },
        addStationNameFilter: function() {
            this.addFilter(this.$('#station-name-filter'), this.stationIdentifierCollection.models, 'stationId', 'stationName');
        },
        dispatchRefreshStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.refreshStationEntryLogList();
        },
        resetStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.$('#station-name-filter').val('');
            this.setDefaultDateFilters(-1);
            this.collection.setSortAttribute('outTime');

            this.refreshStationEntryLogList();
        },
        refreshStationEntryLogList: function() {
            this.showLoading();

            var userId = this.parent.model.get('userId');
            var stationId = this.$('#station-name-filter').val();
            var startDate = this.$('#start-date-filter').val();
            var endDate = this.$('#end-date-filter').val();

            var options = {
                userId: userId,
                stationId: stationId,
                startDate: startDate,
                endDate: endDate,
                onlyCheckedOut: true
            };

            this.dispatcher.trigger(AppEventNamesEnum.refreshPersonnelList, this.collection, options);
        },
        setDateFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            var daysToAdd = -1;
            if (event.target) {
                var button = $(event.target);
                var daysToAddString = button.data('days-to-add');
                if (daysToAddString) {
                    daysToAdd = parseInt(daysToAddString, 10);
                }
                ;
            }
            this.setDefaultDateFilters(daysToAdd);
            this.refreshStationEntryLogList();
        },
        setDefaultDateFilters: function(daysToAdd) {
            var today = new Date();
            var yesterday = utils.addDays(Date.now(), daysToAdd);

            this.$('#start-date-filter').val(utils.getFormattedDate(yesterday));
            this.$('#end-date-filter').val(utils.getFormattedDate(today));
        },
        exportStationEntryLogList: function(event) {
            if (event) {
                event.preventDefault();
            }
            
            var userId = this.parent.model.get('userId');
            var stationId = this.$('#station-name-filter').val();
            var startDate = this.$('#start-date-filter').val();
            var endDate = this.$('#end-date-filter').val();
            var options = {
                userId: userId,
                stationId: stationId,
                startDate: startDate,
                endDate: endDate,
                reportType: 'PersonnelStationEntryLogs'
            };
            this.dispatcher.trigger(AppEventNamesEnum.goToExportStationEntryLogList, this.collection, options);
        }
    });

    return PersonnelStationEntryLogListView;
});
