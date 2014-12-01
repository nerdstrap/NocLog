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
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        events: {
            'keypress #user-name-input': 'invokeRefreshPersonnelList',
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
                dispatcher: currentContext.dispatcher,
                userRole: currentContext.userRole
            });
            this.appendChildTo(personnelListItemView, '#personnel-list-item-container');
        },
        focusUserNameInput: function() {
            this.$('#user-name-input').focus();
        },
        invokeRefreshPersonnelList: function(event) {
            var validPattern = /^[A-Za-z0-9\s]*$/;
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    this.refreshPersonnelList();
                }
                var charCode = event.charCode || event.keyCode || event.which;
                var inputChar = String.fromCharCode(charCode);
                if (!validPattern.test(inputChar) && event.charCode !== 0) {
                    event.preventDefault();
                    return false;
                }
            }
        },
        dispatchRefreshPersonnelList: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.refreshPersonnelList();
        },
        resetPersonnelList: function(event) {
            if (event) {
                event.preventDefault();
                this.focusUserNameInput();
            }
            this.$('#user-name-input').val('');
            this.collection.sortAttribute = 'userName';
            this.collection.reset();
        },
        refreshPersonnelList: function() {
            this.showLoading();
            var userName = this.$('#user-name-input').val();
            if (userName && userName.length >= 2) {
                var options = {
                    userName: userName
                };
                this.dispatcher.trigger(AppEventNamesEnum.refreshPersonnelList, this.collection, options);
            } else {
                this.showError('User name must be greater than 2 characters.');
                this.collection.reset();
            }
        }
    });

    return PersonnelListView;
});
