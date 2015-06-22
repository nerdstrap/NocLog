define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseSingletonView = require('views/BaseSingletonView'),
            globals = require('globals'),
            env = require('env'),
            utils = require('utils'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/DeleteExclusionListItem'),
            alertTemplate = require('hbs!templates/Alert');

    var DeleteExclusionListView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('DeleteExclusionListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.model, AppEventNamesEnum.deleteExclusionSuccess, this.onDeleteExclusionSuccess);
            this.listenTo(this.model, AppEventNamesEnum.deleteExclusionError, this.onDeleteExclusionError);
        },
        render: function() {
            console.trace('DeleteExclusionListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .delete-entry-log-exclusion-button': 'deleteExclusion',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        deleteExclusion: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.deleteExclusion, this.model);
        },
        onDeleteExclusionSuccess: function(entryLogExclusionModel) {
            this.hideLoading();
            appEvents.trigger(AppEventNamesEnum.deleteExclusionSuccess, entryLogExclusionModel);
            this.leave();
        },
        onDeleteExclusionError: function(message) {
            this.hideLoading();
            this.showError(message);
        }
    });

    return DeleteExclusionListView;

});