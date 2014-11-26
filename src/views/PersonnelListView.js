define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            PersonnelListItemView = require('views/PersonnelListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            env = require('env'),
            globals = require('globals'),
            template = require('hbs!templates/PersonnelList');

    var PersonnelListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('PersonnelListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.addAll);
        },
        render: function() {
            console.trace('PersonnelListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click #refresh-personnel-list-button': 'dispatchRefreshPersonnelList',
            'click #reset-personnel-list-button': 'resetPersonnelList',
            'click .sort-button': 'sortListView',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        addAll: function() {
            this._leaveChildren();
            this.clearSortIndicators();
            _.each(this.collection.models, this.addOne, this);
            this.addSortIndicators();
            this.hideLoading();
        },
        addOne: function(personnel) {
            var currentContext = this;
            var personnelListItemView = new PersonnelListItemView({
                model: personnel,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(personnelListItemView, '.personnel-list-item-container');
        },
        focusUserNameFilter: function() {
            this.$('#user-name-filter').focus();
        },
        dispatchRefreshPersonnelList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.refreshPersonnelList();
        },
        resetSearchQueryInput: function(event) {
            if (event) {
                event.preventDefault();
                this.focusUserNameFilter();
            }
            this.$('#user-name-filter').val('');
            this.collection.sortAttribute = 'userName';
            this.collection.reset();
        },
        refreshPersonnelList: function() {
            var userName = this.$('#user-name-filter').val();
            if (userName && userName.length > 2) {
                var options = {
                    userName: userName
                };
                this.dispatcher.trigger(AppEventNamesEnum.updatePersonnelList, this.collection, options);
            } else {
                this.showInfo('user name must be greater than 2 characters');
            }
        }
    });

    return PersonnelListView;
});
