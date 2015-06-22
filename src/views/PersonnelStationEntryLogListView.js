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

            this.userId = options.userId;
            this.userName = options.userName;
            this.stationIdentifierCollection = options.stationIdentifierCollection || new Backbone.Collection();

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
            this.listenTo(this.stationIdentifierCollection, 'reset', this.addStationFilter);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('PersonnelStationEntryLogListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.setDefaultDateFilters(0);
            currentContext.onChangeIncludeTDStationFilterOnly();

            return this;
        },
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        events: {
            'click #refresh-station-entry-log-list-button': 'dispatchRefreshStationEntryLogList',
            'click #reset-station-entry-log-list-button': 'resetStationEntryLogList',
            'click .sort-button': 'sortListView',
            'click .close-alert-box-button': 'closeAlertBox',
            'change #station-filter': 'onChangeStationFilterOnly',
            'click #export-station-entry-log-list-button': 'exportStationEntryLogList',
            'click .refresh-button': 'setDateFilter',
            'click #filter-station-entry-td': 'onChangeIncludeTDStationFilterOnly',
            'click #filter-station-entry-tc': 'onChangeIncludeTCStationFilterOnly'
        },
        addAll: function() {
            this._leaveChildren();
            this.clearSortIndicators();
            _.each(this.collection.models, this.addOne, this);
            this.addSortIndicators();
            this.listenToWindowResize();
            this.hideLoading();
        },
        addOne: function(stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemView = new PersonnelStationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher,
                userRole: currentContext.userRole
            });
            this.appendChildTo(stationEntryLogListItemView, '#station-entry-log-list-item-container');
        },
        addStationFilter: function() {
            this.addFilter(this.$('#station-filter'), this.stationIdentifierCollection.models, 'stationId', 'stationName');
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
            this.$('#filter-station-entry-tc').prop('checked', true);
            this.$('#filter-station-entry-td').prop('checked', true);

            this.$('#station-filter').val('');
            this.setDefaultDateFilters(0);
            this.collection.setSortAttribute('outTime');

            this.refreshStationEntryLogList();
        },
        refreshStationEntryLogList: function() {
            this.showLoading();
            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            if (showNoc === false & showDol === false) {
                this.$('#filter-station-entry-tc').prop('checked', true);
                this.$('#filter-station-entry-td').prop('checked', true);
                showDol = true;
                showNoc = true;
                this.onChangeIncludeTDStationFilterOnly();
            }
            var stationId = this.$('#station-filter').val();
            var startDate = this.$('#start-date-filter').val();
            var endDate = this.$('#end-date-filter').val();

            var options = {
                showNoc: showNoc,
                showDol: showDol,
                stationId: stationId,
                startDate: startDate,
                endDate: endDate,
                onlyCheckedOut: true
            };
            
            if (this.parent.model.has('userId')) {
                options.userId = this.parent.model.get('userId');
            }
            if (this.parent.model.has('userName')) {
                options.userName = this.parent.model.get('userName');
            }

            this.dispatcher.trigger(AppEventNamesEnum.refreshStationEntryLogList, this.collection, options);
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
            var currentContext = this;
            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            if (showNoc === false & showDol === false) {
                this.$('#filter-station-entry-tc').prop('checked', true);
                this.$('#filter-station-entry-td').prop('checked', true);
                showDol = true;
                showNoc = true;
                this.onChangeIncludeTDStationFilterOnly();
            }
            var stationId = this.$('#station-filter').val();
            var startDate = this.$('#start-date-filter').val();
            var endDate = this.$('#end-date-filter').val();
            var options = {
                showNoc: showNoc,
                showDol: showDol,
                stationId: stationId,
                startDate: startDate,
                endDate: endDate,
                reportType: 'PersonnelStationEntryLogs'
            };
            if (this.parent.model.has('userId')) {
                options.userId = this.parent.model.get('userId');
            }
            if (this.parent.model.has('userName')) {
                options.userName = this.parent.model.get('userName');
            }
          
            var triggerExport = function() {
                this.dispatcher.trigger(AppEventNamesEnum.goToExportStationEntryLogList, currentContext.collection, options);
            };
            this.listenToOnce(this.collection, 'reset', triggerExport);
            this.refreshStationEntryLogList();
        },
        onChangeStationFilterOnly: function() {
            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            var stationSelected = this.$('#station-filter').val();
            if (stationSelected !== null && stationSelected.length > 0){  
                if (showDol){
                    this.$('#filter-station-entry-td').prop('checked', false);
                }
                if (!showNoc){
                    this.$('#filter-station-entry-tc').prop('checked', true);                
                }
            }
        },
        onChangeIncludeTDStationFilterOnly: function() {
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            if (showDol) {
                this.$('#station-filter').val('');
            }
        },
        onChangeIncludeTCStationFilterOnly: function() {
            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            if (!showNoc) {
                this.$('#station-filter').val('');
            } 
        }  
    });

    return PersonnelStationEntryLogListView;
});
