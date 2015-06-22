define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            ConfirmWarningListItemView = require('views/ConfirmWarningListItemView'),
            template = require('hbs!templates/ConfirmWarningList');

    var ConfirmWarningListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('ConfirmWarningListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
        },
        render: function() {
            console.trace('ConfirmWarningListView.render()');
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
            var confirmWarningListItemView = new ConfirmWarningListItemView({
                model: stationWarning,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(confirmWarningListItemView, '#station-warning-list-item-container');
        },
        onLeave: function() {
        }
    });

    return ConfirmWarningListView;
});
