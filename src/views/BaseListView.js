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

    var BaseListView = function(options) {
        CompositeView.apply(this, [options]);
    };

    _.extend(BaseListView.prototype, CompositeView.prototype, {
        addFilter: function(filterSelector, options, valuePropertyName, textPropertyName) {
            var filterRenderModel = {
                defaultOption: utils.getResource('filterDefaultOption'),
                options: utils.getFilterOptions(options, valuePropertyName, textPropertyName)
            };
            this.$(filterSelector).html(filterTemplate(filterRenderModel));
        },
        sortListView: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (event.target) {
                var sortButton = $(event.target);
                if (sortButton) {
                    var sortAttribute = sortButton.data('sort-attribute');
                    var currentSortAttribute = this.collection.sortAttribute;
                    var currentSortDirection = this.collection.sortDirection || 1;
                    var sortDirection = 1;
                    if (currentSortAttribute === sortAttribute) {
                        sortDirection = currentSortDirection * -1;
                    }

                    this.collection.setSortAttribute(sortAttribute, sortDirection);
                    this.collection.sort();
                }
            }
        },
        clearSortIndicators: function() {
            this.$('.list-header-item-view i').remove();
        },
        addSortIndicators: function() {
            var sortAttribute = this.collection.sortAttribute;
            var sortDirection = this.collection.sortDirection;
            var sortIcon = sortDirection === 1 ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc';

            var sortButton = this.$('*[data-sort-attribute="' + sortAttribute + '"]');
            sortButton.parent().append('<i class="fa ' + sortIcon + ' "></i>');
        },
        showLoading: function() {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.view-status').addClass('hidden');
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
        }
    });

    BaseListView.extend = CompositeView.extend;

    return BaseListView;
});
