define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            globals = require('globals'),
            BaseListView = require('views/BaseListView'),
            AddWarningListItemView = require('views/AddWarningListItemView'),
            ClearWarningListItemView = require('views/ClearWarningListItemView'),
            env = require('env'),
            utils = require('utils'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/EditWarningList'),
            StationWarningModel = require('models/StationWarningModel'),
            alertTemplate = require('hbs!templates/Alert');

    var EditWarningListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('EditWarningListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.warningCollection = options.collection || new Backbone.Collection();
            
            this.parentModel = options.parentModel;

            this.listenToOnce(this.warningCollection, 'reset', this.addAll);
            
            this.listenTo(appEvents, AppEventNamesEnum.clearWarningSuccess, this.onClearWarningSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.addWarningSuccess, this.onAddWarningSuccess);
        },
        render: function() {
            console.trace('EditWarningListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));
    
            this.renderNewAddWarningView();

            return this;
        },
        renderNewAddWarningView: function() {
            var currentContext = this;
            var newStationWarningModel = new StationWarningModel();
            var addWarningListItemView = new AddWarningListItemView({
                parentModel: currentContext.parentModel,
                model: newStationWarningModel,
                dispatcher: currentContext.dispatcher
            });
            if (currentContext.userName) {
                addWarningListItemView.setUserName(currentContext.userName);
            }
            this.appendChildTo(addWarningListItemView, '#add-warning-list-item-container'); 
        },
        setUserRole: function(userRole) {
            var currentContext = this;
            currentContext.userRole = userRole;
            currentContext.checkUserRole();
        },
        setUserName: function(userName) {
            this.userName = userName;
        },
        events: {
            'click #refresh-warning-list-button': 'refreshWarningList',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        checkUserRole: function() {
            var currentContext = this;
            if (currentContext.userRole === UserRolesEnum.NocAdmin) {
                _.each(this.collection.models, this.addOne, this);
            } else {
                this.addAlertBox(1, 'alert', 'Sorry, you are not authorized to perform maintenance.');
                this.$('#warning-list').addClass('hidden');
            }
        },
        addAll: function() {
            _.each(this.collection.models, this.addOne, this);
            this.listenToWindowResize();
            this.hideLoading();
            appEvents.trigger(AppEventNamesEnum.allWarningsLoaded);
        },
        addOne: function(warning) {
            var currentContext = this;
            var warningListItemView = new ClearWarningListItemView({
                model: warning,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(warningListItemView, '#warning-list-item-container');
        },
        refreshWarningList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToMaintainExclusions);
        },
        onClearWarningSuccess: function(stationWarningModel) {
            this.collection.remove(this.collection.where({stationWarningId: stationWarningModel.stationWarningId}));
            if(this.collection.length === 0){
                appEvents.trigger(AppEventNamesEnum.allWarningsCleared);
            }
            this.showSuccess('clear success');
        },
        onAddWarningSuccess: function(stationWarning) {
            this.showSuccess('add success');
            var stationWarningModel = new StationWarningModel(stationWarning);
            this.collection.add(stationWarningModel);
            this.addOne(stationWarningModel);
            this.renderNewAddWarningView();
        },
        onLeave: function() {
        }
    });

    return EditWarningListView;
});
