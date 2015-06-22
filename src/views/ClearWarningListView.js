define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            BaseListView = require('views/BaseListView'),
            AddWarningListItemView = require('views/AddWarningListItemView'),
            ClearWarningListItemView = require('views/ClearWarningListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/ClearWarningList'),
            StationWarningModel = require('models/StationWarningModel');

    var ClearWarningListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('ClearWarningListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.parentModel = options.parentModel;

            this.listenTo(this.collection, 'reset', this.addAll);
            
            this.listenTo(appEvents, AppEventNamesEnum.clearWarningSuccess, this.onClearWarningSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.addWarningSuccess, this.onAddWarningSuccess);
        },
        render: function() {
            console.trace('ClearWarningListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        renderNewAddWarningView: function() {
            var currentContext = this;
            var newStationWarning = new StationWarningModel();
            var addWarningListItemView = new AddWarningListItemView({
                model: newStationWarning,
                parentModel: currentContext.parentModel,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(addWarningListItemView, '#add-station-warning-list-item-container');            
        },
        setUserRole: function(userRole) {
            var currentContext = this;
            currentContext.userRole = userRole;
            currentContext.checkUserRole();
        },
        events: {
            'click .close-alert-box-button': 'closeAlertBox'
        },
        checkUserRole: function() {
            var currentContext = this;
            if (currentContext.userRole === UserRolesEnum.NocAdmin) {
                _.each(this.collection.models, this.addOne, this);
            } else {
                this.addAlertBox(1, 'alert', 'Sorry, you are not authorized to perform maintenance.');
                this.$('#station-warning-list').addClass('hidden');
            }
        },
        addAll: function() {
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function(stationWarning) {
            var currentContext = this;
            var stationWarningListItemView = new ClearWarningListItemView({
                model: stationWarning,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationWarningListItemView, '#clear-station-warning-list-item-container');
        },
        onClearWarningSuccess: function(stationWarning) {
            this.showSuccess('delete success');
        },
        onAddWarningSuccess: function(stationWarning) {
            this.showSuccess('add success');
            var stationWarningModel = new StationWarningModel(stationWarning);
            this.addOne(stationWarningModel);
            this.renderNewAddWarningView();
        },
        onLeave: function() {
        }
    });

    return ClearWarningListView;
});
