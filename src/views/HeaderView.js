define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        UserRolesEnum = require('enums/UserRolesEnum'),
        appEvents = require('events'),
        template = require('hbs!templates/Header');

    var HeaderView = CompositeView.extend({
        initialize: function (options) {
            console.trace('HeaderView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(appEvents, AppEventNamesEnum.userRoleUpdated, this.userRoleUpdated);
        },
        events: {
            'click #app-title-button': 'titleButtonClick',
            'click #go-to-station-entry-log-list-button': 'goToStationEntryLogList',
            'click #go-to-station-entry-log-history-list-button': 'goToStationEntryLogHistoryList',
            'click #go-to-station-list-button': 'goToStationList',
            'click #go-to-personnel-list-button': 'goToPersonnelList',
            'click #go-to-maintain-purposes-button': 'goToMaintainPurposes'
        },
        render: function () {
            console.trace('HeaderView.render');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        userRoleUpdated: function (userRole) {
            if (userRole === UserRolesEnum.NocAdmin) {
                this.$('#go-to-maintain-purposes-link-container').removeClass('hidden');
            } else {
                this.$('#go-to-maintain-purposes-link-container').addClass('hidden');
            }
        },
        titleButtonClick: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToStationEntryLogList: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList);
        },
        goToStationList: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationList);
        },
        goToPersonnelList: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnelList);
        },
        goToStationEntryLogHistoryList: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogHistoryList);
        },
        goToMaintainPurposes: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToMaintainPurposes);
        }
    });

    return HeaderView;
});