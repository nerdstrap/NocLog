define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        StationListItemView = require('views/StationListItemView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        appEvents = require('events'),
        appResources = require('resources'),
        template = require('hbs!templates/StationList');

    var StationListView = CompositeView.extend({
        resources: function (culture) {
            return {
                loadingIconSrc: appResources.getResource('loadingIconSrc').value,
                loadingMessage: appResources.getResource('StationListView.loadingMessage').value,
                errorMessage: appResources.getResource('StationListView.errorMessage').value,
                infoMessage: appResources.getResource('StationListView.infoMessage').value,
                listViewTitleText: appResources.getResource('StationListView.listViewTitleText').value,
                stationNameHeaderText: appResources.getResource('StationListView.stationNameHeaderText').value,
                regionHeaderText: appResources.getResource('StationListView.regionHeaderText').value,
                areaHeaderText: appResources.getResource('StationListView.areaHeaderText').value,
                placeholderHeaderText: appResources.getResource('StationListView.placeholderHeaderText').value
            };
        },
        initialize: function (options) {
            console.trace('StationListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
        },
        
        render: function () {
            console.trace('StationListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model);
            currentContext.$el.html(template(renderModel));
            
            _.each(this.collection.models, this.addOne, this);
            
            return this;
        },
        addAll: function () {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
        },
        addOne: function (station) {
            var currentContext = this;
            var stationListItemView = new StationListItemView({
                model: station,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationListItemView, '.view-list');
        }
    });

    return StationListView;
});
