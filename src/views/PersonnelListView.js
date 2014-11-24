define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            PersonnelListItemView = require('views/PersonnelListItemView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/PersonnelList');

    var PersonnelListView = CompositeView.extend({
        initialize: function(options) {
            console.trace('PersonnelListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
        },
        render: function() {
            console.trace('PersonnelListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            _.each(this.collection.models, this.addOne, this);

            return this;
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
        }
    });

    return PersonnelListView;
});
