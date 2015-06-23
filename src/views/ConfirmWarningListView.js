define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseListView = require('views/BaseListView'),
            ConfirmWarningListItemView = require('views/ConfirmWarningListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/ConfirmWarningList');

    var ConfirmWarningListView = BaseListView.extend({
        initialize: function(options) {
            console.trace('ConfirmWarningListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(appEvents, AppEventNamesEnum.clearWarningSuccess, this.onClearWarningSuccess);
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
        onClearWarningSuccess: function(stationWarningModel) {
            this.collection.remove(this.collection.where({stationWarningId: stationWarningModel.stationWarningId}));
            if (this.collection.length === 0) {
                appEvents.trigger(AppEventNamesEnum.allWarningsCleared);
            }
            this.showSuccess('clear success');
        },
        onLeave: function() {
        }
    });

    return ConfirmWarningListView;
});
