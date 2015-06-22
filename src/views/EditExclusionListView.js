define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            globals = require('globals'),
            BaseListView = require('views/BaseListView'),
            AddExclusionListItemView = require('views/AddExclusionListItemView'),
            DeleteExclusionListItemView = require('views/DeleteExclusionListItemView'),
            env = require('env'),
            utils = require('utils'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/EditExclusionList'),
            EntryLogExclusionModel = require('models/EntryLogExclusionModel'),
            alertTemplate = require('hbs!templates/Alert');

    var EditExclusionListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('EditExclusionListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.exclusionCollection = options.collection || new Backbone.Collection();

            this.listenTo(this.exclusionCollection, 'reset', this.addAll);
            
            this.listenTo(appEvents, AppEventNamesEnum.deleteExclusionSuccess, this.onDeleteExclusionSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.addExclusionSuccess, this.onAddExclusionSuccess);
        },
        render: function() {
            console.trace('EditExclusionListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            this.renderNewAddExclusionView();

            return this;
        },
        renderNewAddExclusionView: function() {
            var currentContext = this;
            var newEntryLogExclusionModel = new EntryLogExclusionModel();
            var addExclusionListItemView = new AddExclusionListItemView({
                model: newEntryLogExclusionModel,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(addExclusionListItemView, '#add-exclusion-list-item-container');            
        },
        setUserRole: function(userRole) {
            var currentContext = this;
            currentContext.userRole = userRole;
            currentContext.checkUserRole();
        },
        events: {
            'click #refresh-exclusion-list-button': 'refreshExclusionList',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        checkUserRole: function() {
            var currentContext = this;
            if (currentContext.userRole === UserRolesEnum.NocAdmin) {
                _.each(this.collection.models, this.addOne, this);
            } else {
                this.addAlertBox(1, 'alert', 'Sorry, you are not authorized to perform maintenance.');
                this.$('#exclusion-list').addClass('hidden');
            }
        },
        addAll: function() {
            _.each(this.collection.models, this.addOne, this);
            this.listenToWindowResize();
            this.hideLoading();
        },
        addOne: function(exclusion) {
            var currentContext = this;
            var exclusionListItemView = new DeleteExclusionListItemView({
                model: exclusion,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(exclusionListItemView, '#exclusion-list-item-container');
        },
        refreshExclusionList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToMaintainExclusions);
        },
        onDeleteExclusionSuccess: function(entryLogExclusionModel) {
            this.showSuccess('delete success');
        },
        onAddExclusionSuccess: function(entryLogExclusion) {
            this.showSuccess('add success');
            var entryLogExclusionModel = new EntryLogExclusionModel(entryLogExclusion);
            this.addOne(entryLogExclusionModel);
            this.renderNewAddExclusionView();
        },
        onLeave: function() {
        }
    });

    return EditExclusionListView;
});
