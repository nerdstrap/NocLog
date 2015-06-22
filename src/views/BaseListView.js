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
        addFilter: function(filterSelector, options, valuePropertyName, textPropertyName, nameOptionalProperty1, valueOptionalProperty1, nameOptionalProperty2, valueOptionalProperty2) {
            var filterRenderModel = {
                defaultOption: utils.getResource('filterDefaultOption'),
                options: utils.getFilterOptions(options, valuePropertyName, textPropertyName, nameOptionalProperty1, valueOptionalProperty1, nameOptionalProperty2, valueOptionalProperty2)
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
        },
        addStationNameFilter: function() {
            this.addFilter(this.$('#station-filter'), this.stationIdentifierCollection.models, 'stationId', 'stationName', 'region', 'regionName', 'area', 'areaName');
        },
        addRegionNameFilter: function() {
            this.addFilter(this.$('#region-filter'), this.regionCollection.models, 'regionName', 'regionName');
        },
        addAreaNameFilter: function() {
            this.addFilter(this.$('#area-filter'), this.areaCollection.models, 'areaName', 'areaName', 'region', 'regionName');
        },
        addDolRegionNameFilter: function() {
            this.addFilter(this.$('#dol-region-filter'), this.dolRegionCollection.models, 'regionName', 'regionName');
        },
        addDolAreaNameFilter: function() {
            this.addFilter(this.$('#dol-area-filter'), this.dolAreaCollection.models, 'areaName', 'areaName', 'region', 'regionName');
        },
        onChangeStationFilter: function() {
            var itemSelected = this.$('#station-filter').find('option:selected');
            var regionAttribute = itemSelected.attr('data-region');
            var areaAttribute = itemSelected.attr('data-area');
            var stationSelected = this.$('#station-filter').val();
            if (stationSelected) {
                var filteredAreaCollection = this.areaCompleteCollection.where({regionName: regionAttribute});
                this.areaCollection.reset(filteredAreaCollection);
                var filteredStationCollection = this.stationIdentifierCompleteCollection.where({areaName: areaAttribute});
                this.stationIdentifierCollection.reset(filteredStationCollection);
                this.$('#region-filter').val(regionAttribute);
                this.$('#area-filter').val(areaAttribute);
                this.$('#station-filter').val(stationSelected);
            } else {
                var areaSelected = this.$('#area-filter').val();
                var filteredStationCollection = this.stationIdentifierCompleteCollection.where({areaName: areaSelected});
                this.stationIdentifierCollection.reset(filteredStationCollection);
            }
            this.onChangeTcomFilters();
        },
        onChangeAreaFilter: function() {
            var itemSelected = this.$('#area-filter').find('option:selected');
            var regionAttribute = itemSelected.attr('data-region');
            var areaSelected = this.$('#area-filter').val();
            if (areaSelected) {
                var filteredAreaCollection = this.areaCompleteCollection.where({regionName: regionAttribute});
                this.areaCollection.reset(filteredAreaCollection);
                var filteredStationCollection = this.stationIdentifierCompleteCollection.where({areaName: areaSelected});
                this.stationIdentifierCollection.reset(filteredStationCollection);
                this.$('#region-filter').val(regionAttribute);
                this.$('#area-filter').val(areaSelected);
                this.$('#station-filter').val('');
            } else {
                var regionSelected = this.$('#region-filter').val();
                var filteredStationCollection = this.stationIdentifierCompleteCollection.where({regionName: regionSelected});
                this.stationIdentifierCollection.reset(filteredStationCollection);
                this.$('#station-filter').val('');
            }
            this.onChangeTcomFilters();
        },
        
        onChangeDolAreaFilter: function() {
            var itemSelected = this.$('#dol-area-filter').find('option:selected');
            var regionAttribute = itemSelected.attr('data-region');
            var areaSelected = this.$('#dol-area-filter').val();
            if (areaSelected) {
                var filteredDolAreaCollection = this.dolAreaCompleteCollection.where({regionName: regionAttribute});
                this.dolAreaCollection.reset(filteredDolAreaCollection);
                this.$('#dol-region-filter').val(regionAttribute);
                this.$('#dol-area-filter').val(areaSelected);
            }
            this.onChangeDolFilters();
        },
        onChangeRegionFilter: function() {
            var regionSelected = this.$('#region-filter').val();
            if (regionSelected) {
                var filteredStationCollection = this.stationIdentifierCompleteCollection.where({regionName: regionSelected});
                var filteredAreaCollection = this.areaCompleteCollection.where({regionName: regionSelected});
                this.areaCollection.reset(filteredAreaCollection);
                this.stationIdentifierCollection.reset(filteredStationCollection);
                this.$('#area-filter').val('');
                this.$('#station-filter').val('');
            } else {
                this.areaCollection.reset(this.areaCompleteCollection.models);
                this.stationIdentifierCollection.reset(this.stationIdentifierCompleteCollection.models);
                this.$('#area-filter').val('');
                this.$('#station-filter').val('');
            }
            this.onChangeTcomFilters();
        },
        onChangeDolRegionFilter: function() {
            var regionSelected = this.$('#dol-region-filter').val();
            if (regionSelected) {
                var filteredDolAreaCollection = this.dolAreaCompleteCollection.where({regionName: regionSelected});
                this.dolAreaCollection.reset(filteredDolAreaCollection);
                this.$('#dol-area-filter').val('');
            } else {
                this.dolAreaCollection.reset(this.dolAreaCompleteCollection.models);
                this.$('#dol-area-filter').val('');
            }
            this.onChangeDolFilters();
        },
        onChangeTcomFilters: function() {  
            var showNocExists = (this.$('#filter-station-entry-tc').length > 0);
            var showDolExists = (this.$('#filter-station-entry-td').length > 0);
            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            var regionSelected = this.$('#region-filter').val();
            
            if (regionSelected !== null && regionSelected.length > 0){               
                if (showDolExists && showDol){
                    this.$('#filter-station-entry-td').prop('checked', false);
                    this.onChangeIncludeTD();
                }
                if (showNocExists && !showNoc){
                    this.$('#filter-station-entry-tc').prop('checked', true);
                    this.onChangeIncludeTC();
                }
            }
        },
        onChangeDolFilters: function() { 
            var showNocExists = (this.$('#filter-station-entry-tc').length > 0);
            var showDolExists = (this.$('#filter-station-entry-td').length > 0);
            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            var regionSelected = this.$('#dol-region-filter').val();
            
            if (regionSelected !== null && regionSelected.length > 0){               
                if (showNocExists && showNoc){
                    this.$('#filter-station-entry-tc').prop('checked', false);
                    this.onChangeIncludeTC();
                }
                if (showDolExists && !showDol){
                    this.$('#filter-station-entry-td').prop('checked', true);                
                    this.onChangeIncludeTD();
                }
            }
        },
        onChangeIncludeTD: function() {
            var showDol = this.$('#filter-station-entry-td').is(':checked');
            if (showDol) {
                this.$('#station-filter').val('');
                this.$('#region-filter').val('');
                this.$('#area-filter').val('');
                this.onChangeRegionFilter();
            } else {
                this.$('#dol-region-filter').val('');
                this.$('#dol-area-filter').val('');
                this.onChangeDolRegionFilter();
            }
        },
        onChangeIncludeTC: function() {
            var showNoc = this.$('#filter-station-entry-tc').is(':checked');
            if (showNoc) {
                this.$('#dol-region-filter').val('');
                this.$('#dol-area-filter').val('');
                this.onChangeDolRegionFilter();
            } else {
                this.$('#region-filter').val('');
                this.$('#area-filter').val('');
                this.onChangeRegionFilter();
            }
        }  
    });

    BaseListView.extend = CompositeView.extend;

    return BaseListView;
});
