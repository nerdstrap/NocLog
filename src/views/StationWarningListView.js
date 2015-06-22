define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            StationWarningListItemView = require('views/StationWarningListItemView'),
            template = require('hbs!templates/StationWarningList');

    var StationWarningListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('StationWarningListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
        },
        render: function() {
            console.trace('StationWarningListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        addAll: function() {
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function(stationWarning) {
            var currentContext = this;
            var stationWarningListItemView = new StationWarningListItemView({
                model: stationWarning,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationWarningListItemView, '#station-warning-list-item-container');
        },
        onLeave: function() {
        }
    });

    return StationWarningListView;
});
