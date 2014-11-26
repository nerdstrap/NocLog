define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseSingletonView = require('views/BaseSingletonView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/Personnel');

    var PersonnelView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('PersonnelView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCollection = options.stationIdentifierCollection;
        },
        render: function() {
            console.trace('PersonnelView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        updateViewFromModel: function(personnelModel) {
            this.$('#personnel-user-name').html(personnelModel.firstName + '&nbsp;' + personnelModel.lastName);
            this.$('#personnel-contact-number').html(personnelModel.contactNumber);
            this.$('#personnel-email').html(personnelModel.email);
        }
    });

    return PersonnelView;

});