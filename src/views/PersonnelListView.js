define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            PersonnelListItemView = require('views/PersonnelListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            template = require('hbs!templates/PersonnelList');

    var PersonnelListView = CompositeView.extend({
        resources: function(culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc').value,
                loadingMessage: appResources.getResource('PersonnelListView.loadingMessage').value,
                errorMessage: appResources.getResource('PersonnelListView.errorMessage').value,
                infoMessage: appResources.getResource('PersonnelListView.infoMessage').value,
                listViewTitleText: appResources.getResource('PersonnelListView.listViewTitleText').value,
                listFilterHeaderText: appResources.getResource('PersonnelListView.listFilterHeaderText').value,
                stationNameHeaderText: appResources.getResource('PersonnelListView.stationNameHeaderText').value,
                personnelNameHeaderText: appResources.getResource('PersonnelListView.personnelNameHeaderText').value,
                contactHeaderText: appResources.getResource('PersonnelListView.contactHeaderText').value,
                inTimeHeaderText: appResources.getResource('PersonnelListView.inTimeHeaderText').value,
                outTimeHeaderText: appResources.getResource('PersonnelListView.outTimeHeaderText').value,
                durationHeaderText: appResources.getResource('PersonnelListView.durationHeaderText').value,
                purposeHeaderText: appResources.getResource('PersonnelListView.purposeHeaderText').value,
                additionalInfoHeaderText: appResources.getResource('PersonnelListView.additionalInfoHeaderText').value
            };
        },
        initialize: function(options) {
            console.trace('PersonnelListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
        },
        render: function() {
            console.trace('PersonnelListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));

            _.each(this.collection.models, this.addOne, this);

            return this;
        },
        events: {
            'change #station-entry-log-list-filter': 'changePersonnelListFilter'
        },
        addAll: function() {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
        },
        addOne: function(personnel) {
            var currentContext = this;
            var personnelListItemView = new PersonnelListItemView({
                model: personnel,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(personnelListItemView, '.view-list');
        },
        changePersonnelListFilter: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var filter = event.target.value;
                if (filter === "open") {
                    this.dispatcher.trigger(AppEventNamesEnum.showOpenPersonnels);
                }
                if (filter === "expired") {
                    this.dispatcher.trigger(AppEventNamesEnum.showExpiredPersonnels);
                }
                if (filter === "all") {
                    this.dispatcher.trigger(AppEventNamesEnum.showPersonnels);
                }
            }
        }
    });

    return PersonnelListView;
});
