define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            globals = require('globals'),
            env = require('env'),
            alertTemplate = require('hbs!templates/Alert');

    var utils = {};

    utils.addAlertBox = function(alertContainer, guid, level, message) {
        var renderModel = {
            guid: guid,
            level: level,
            message: message
        };
        alertContainer.prepend(alertTemplate(renderModel));
    };

    utils.addAutoCloseAlertBox = function(alertContainer, level, message) {
        var currentContext = this;
        var guid = env.getNewGuid();
        utils.addAlert(alertContainer, guid, level, message);
        globals.window.setTimeout(function() {
            currentContext.autoCloseAlertBox(guid);
        }, env.getNotificationTimeout());
    };

    utils.closeAlertBox = function(event) {
        if (event) {
            event.preventDefault();
        }
        if (event.target) {
            var closeAlertButton = $(event.target);
            if (closeAlertButton) {
                var alert = closeAlertButton.closest('[data-alert]');
                if (alert) {
                    alert.trigger('close').trigger('close.fndtn.alert').remove();
                }
            }
        }
    };

    utils.autoCloseAlertBox = function(guid) {
        if (guid) {
            var closeAlertButton = $('#' + guid);
            if (closeAlertButton) {
                var alert = closeAlertButton.closest('[data-alert]');
                if (alert) {
                    alert.trigger('close').trigger('close.fndtn.alert').remove();
                }
            }
        }
    };
    
    return utils;
});
