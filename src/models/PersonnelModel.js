define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            helpers = require('handlebars.helpers');

    var PersonnelModel = Backbone.Model.extend({
        idAttribute: 'userId',
        set: function(key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }

            attributes.thirdParty = true;
            if (attributes.hasOwnProperty('userId')) {
                var userId = attributes.userId;
                if (userId.length > 0) {
                    attributes.thirdParty = false;
                }
            }

            if (attributes.hasOwnProperty('contactNumber')) {
                var cleanedPhone = helpers.cleanPhone(attributes.contactNumber);
                attributes.contactNumber = cleanedPhone;
            }

            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return PersonnelModel;
});