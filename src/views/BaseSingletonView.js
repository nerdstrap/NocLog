define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            globals = require('globals'),
            env = require('env'),
            utils = require('utils'),
            filterTemplate = require('hbs!templates/Filter'),
            alertTemplate = require('hbs!templates/Alert');

    var BaseSingletonView = function(options) {
        CompositeView.apply(this, [options]);
    };

    _.extend(BaseSingletonView.prototype, CompositeView.prototype, {
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        setUserName: function(userName) {
            this.userName = userName;
        },
        addFilter: function(filterSelector, options, valuePropertyName, textPropertyName, nameOptionalProperty1, valueOptionalProperty1, nameOptionalProperty2, valueOptionalProperty2) {
            var filterRenderModel = {
                defaultOption: utils.getResource('filterDefaultOption'),
                options: utils.getFilterOptions(options, valuePropertyName, textPropertyName, nameOptionalProperty1, valueOptionalProperty1, nameOptionalProperty2, valueOptionalProperty2)
            };
            this.$(filterSelector).html(filterTemplate(filterRenderModel));
        },
        updateIndicatorLabel: function(indicator) {
            if (indicator.is(':checked')) {
                indicator.parent().next().addClass('bolder');
                indicator.parent().prev().removeClass('bolder');
            } else {
                indicator.parent().next().removeClass('bolder');
                indicator.parent().prev().addClass('bolder');
            }
        },
        showLoading: function(hideDetails) {
            if (hideDetails) {
                this.$('.view-details').addClass('hidden');
            }
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
            this.$('.view-details').removeClass('hidden');
        },
        showInfo: function(message) {
            var level;
            this.addAutoCloseAlertBox(level, message);
        },
        showSuccess: function(message) {
            this.addAutoCloseAlertBox('success', message);
        },
        showError: function(message) {
            this.addAutoCloseAlertBox('alert', message);
        },
        addAlertBox: function(guid, level, message) {
            var renderModel = {
                guid: guid,
                level: level,
                message: message
            };
            this.$('.view-alerts:first .columns').prepend(alertTemplate(renderModel));
        },
        addAutoCloseAlertBox: function(level, message) {
            var currentContext = this;
            var guid = env.getNewGuid();
            this.addAlertBox(guid, level, message);
            globals.window.setTimeout(function() {
                currentContext.autoCloseAlertBox(guid);
            }, env.getNotificationTimeout());
        },
        closeAlertBox: function(event) {
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
        },
        autoCloseAlertBox: function(guid) {
            if (guid) {
                var closeAlertButton = $('#' + guid);
                if (closeAlertButton) {
                    var alert = closeAlertButton.closest('[data-alert]');
                    if (alert) {
                        alert.trigger('close').trigger('close.fndtn.alert').remove();
                    }
                }
            }
        },
        toggleSectionDetails: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var sectionHeaderButton = $(event.target).closest('.section-header');
                if (sectionHeaderButton) {
                    sectionHeaderButton.next().toggle('hidden');
                    var sectionHeaderIcon = sectionHeaderButton.find('i');
                    if (sectionHeaderIcon.hasClass('fa-minus')) {
                        sectionHeaderIcon.removeClass('fa-minus').addClass('fa-plus');
                    } else {
                        sectionHeaderIcon.removeClass('fa-plus').addClass('fa-minus');
                    }
                }
            }
        }
    });

    BaseSingletonView.extend = CompositeView.extend;

    return BaseSingletonView;
});
