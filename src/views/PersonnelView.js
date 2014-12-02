define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseSingletonView = require('views/BaseSingletonView'),
            StationEntryLogCollection = require('collections/StationEntryLogCollection'),
            PersonnelStationEntryLogListView = require('views/PersonnelStationEntryLogListView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            helpers = require('handlebars.helpers'),
            template = require('hbs!templates/Personnel');

    var PersonnelView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('PersonnelView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.stationEntryLogCollection = new StationEntryLogCollection();
            this.stationEntryLogCollection.setSortAttribute('outTime');
            this.stationIdentifierCollection = new Backbone.Collection();

            this.listenTo(this.model, 'change', this.updateViewFromModel);
        },
        render: function() {
            console.trace('PersonnelView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .close-alert-box-button': 'closeAlertBox'
        },
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        updateViewFromModel: function() {
            var currentContext = this;
            if (currentContext.model.has('userName')) {
                currentContext.$('#user-name-input').html(currentContext.model.get('userName'));
                currentContext.$('#contact-number-input').html(helpers.formatPhoneWithDefault(currentContext.model.get('contactNumber'), '', ''));
                currentContext.$('#email-input').html(currentContext.model.get('email'));

            }
            currentContext.hideLoading();

            if (currentContext.model.has('userId') || currentContext.model.has('userName')) {
                currentContext.personnelStationEntryLogListViewInstance = new PersonnelStationEntryLogListView({
                    controller: currentContext.controller,
                    dispatcher: currentContext.dispatcher,
                    collection: currentContext.stationEntryLogCollection,
                    stationIdentifierCollection: currentContext.stationIdentifierCollection
                });
                this.appendChildTo(currentContext.personnelStationEntryLogListViewInstance, '#personnel-station-entry-log-list-view');

                var options = {
                    onlyCheckedOut: true
                };
                if (currentContext.model.has('userId')) {
                    options.userId = currentContext.model.get('userId');
                }
                if (currentContext.model.has('userName')) {
                    options.userName = currentContext.model.get('userName');
                }
                currentContext.personnelStationEntryLogListViewInstance.showLoading();
                currentContext.dispatcher.trigger(AppEventNamesEnum.refreshStationEntryLogList, currentContext.stationEntryLogCollection, options);
                currentContext.dispatcher.trigger(AppEventNamesEnum.refreshOptions, {stationIdentifierCollection: currentContext.stationIdentifierCollection});
            }
        }

    });

    return PersonnelView;

});