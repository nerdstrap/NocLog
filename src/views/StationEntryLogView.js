define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone.validation'),
            helpers = require('handlebars.helpers'),
            CompositeView = require('views/CompositeView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            appEvents = require('events'),
            appResources = require('resources'),
            utils = require('utils'),
            PersonnelModel = require('models/PersonnelModel'),
            StationEntryLogModel = require('models/StationEntryLogModel'),
            template = require('hbs!templates/StationEntryLog'),
            stationIdentifierListTemplate = require('hbs!templates/StationIdentifierList'),
            purposeListTemplate = require('hbs!templates/PurposeList'),
            durationListTemplate = require('hbs!templates/DurationList');

    var StationEntryLog = CompositeView.extend({
        resources: function(culture) {
            return {
                hazardIconSrc: appResources.getResource('hazardIconSrc'),
                hazardIconSvgSrc: appResources.getResource('hazardIconSvgSrc'),
                hazardIconAlt: appResources.getResource('hazardIconAlt'),
                checkedInIconSvgSrc: appResources.getResource('checkedInIconSvgSrc'),
                checkedInIconAlt: appResources.getResource('checkedInIconAlt'),
                checkOutButtonText: appResources.getResource('checkOutButtonText'),
                stationNameHeaderText: appResources.getResource('StationEntryLogView.stationNameHeaderText'),
                personnelNameHeaderText: appResources.getResource('StationEntryLogView.personnelNameHeaderText'),
                contactHeaderText: appResources.getResource('StationEntryLogView.contactHeaderText'),
                inTimeHeaderText: appResources.getResource('StationEntryLogView.inTimeHeaderText'),
                outTimeHeaderText: appResources.getResource('StationEntryLogView.outTimeHeaderText'),
                durationHeaderText: appResources.getResource('StationEntryLogView.durationHeaderText'),
                purposeHeaderText: appResources.getResource('StationEntryLogView.purposeHeaderText'),
                additionalInfoHeaderText: appResources.getResource('StationEntryLogView.additionalInfoHeaderText'),
                regionHeaderText: appResources.getResource('StationEntryLogView.regionHeaderText'),
                areaHeaderText: appResources.getResource('StationEntryLogView.areaHeaderText'),
                stationIdDefaultOption: appResources.getResource('EditStationEntryLogView.stationIdDefaultOption'),
                purposeDefaultOption: appResources.getResource('EditStationEntryLogView.purposeDefaultOption'),
                durationDefaultOption: appResources.getResource('EditStationEntryLogView.durationDefaultOption'),
                hasCrewYesOption: appResources.getResource('EditStationEntryLogView.hasCrewYesOption'),
                hasCrewNoOption: appResources.getResource('EditStationEntryLogView.hasCrewNoOption'),
                stationIdHeaderText: appResources.getResource('EditStationEntryLogView.stationIdHeaderText'),
                userIdHeaderText: appResources.getResource('EditStationEntryLogView.userIdHeaderText'),
                firstNameHeaderText: appResources.getResource('EditStationEntryLogView.firstNameHeaderText'),
                middleInitialHeaderText: appResources.getResource('EditStationEntryLogView.middleInitialHeaderText'),
                lastNameHeaderText: appResources.getResource('EditStationEntryLogView.lastNameHeaderText'),
                contactNumberHeaderText: appResources.getResource('EditStationEntryLogView.contactNumberHeaderText'),
                emailHeaderText: appResources.getResource('EditStationEntryLogView.emailHeaderText'),
                expectedOutTimeHeaderText: appResources.getResource('EditStationEntryLogView.expectedOutTimeHeaderText'),
                purposeOtherHeaderText: appResources.getResource('EditStationEntryLogView.purposeOtherHeaderText'),
                hasCrewHeaderText: appResources.getResource('EditStationEntryLogView.hasCrewHeaderText'),
                saveButtonText: appResources.getResource('EditStationEntryLogView.saveButtonText'),
                cancelButtonText: appResources.getResource('EditStationEntryLogView.cancelButtonText')
            };
        },
        initialize: function(options) {
            console.trace('StationEntryLog.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationIdentifierCollection = options.stationIdentifierCollection || new Backbone.Collection();
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'sync', this.render);

            this.listenTo(this.stationIdentifierCollection, 'reset', this.addAllStationIdentifiers);
            this.listenTo(this.purposeCollection, 'reset', this.addAllPurposes);
            this.listenTo(this.durationCollection, 'reset', this.addAllDurations);

        },
        render: function() {
            console.trace('StationEntryLog.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.resources(), currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            currentContext.addAllStationIdentifiers();
            currentContext.addAllPurposes();
            currentContext.addAllDurations();

            return this;
        },
        addAllStationIdentifiers: function() {
            var currentContext = this;
            var stationIdentifierListRenderModel = {
                defaultOption: currentContext.resources().stationIdDefaultOption,
                stationIdentifiers: currentContext.stationIdentifierCollection.models
            };
            this.$('#edit-station-entry-log-station-id').html(stationIdentifierListTemplate(stationIdentifierListRenderModel));
        },
        addAllPurposes: function() {
            var currentContext = this;
            var purposeListRenderModel = {
                defaultOption: currentContext.resources().purposeDefaultOption,
                purposes: currentContext.purposeCollection.models
            };
            this.$('#edit-station-entry-log-purpose').html(purposeListTemplate(purposeListRenderModel));
        },
        addAllDurations: function() {
            var currentContext = this;
            var durationListRenderModel = {
                defaultOption: currentContext.resources().durationDefaultOption,
                durations: currentContext.durationCollection.models
            };
            this.$('#edit-station-entry-log-duration').html(durationListTemplate(durationListRenderModel));
        },
        events: {
            'click #edit-station-entry-log-cancel-button': 'cancelEditCheckIn',
            'change #edit-station-entry-log-purpose': 'purposeChanged',
            'change #edit-station-entry-log-duration': 'durationChanged'
        },
        purposeChanged: function(event) {
            if (event) {
                event.preventDefault();
            }
            var purpose = this.$('#edit-station-entry-log-purpose option:selected').text();
            this.togglePurposeOther(purpose === 'Other');
            var defaultDuration = this.$('#edit-station-entry-log-purpose').val();
            if (!this.manualDurationEntry) {
                this.$('#edit-station-entry-log-duration').val(defaultDuration);
                this.changeExpectedOutTime();
            }
        },
        durationChanged: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.changeExpectedOutTime();
            this.manualDurationEntry = true;
        },
        changeExpectedOutTime: function() {
            var duration = this.$('#edit-station-entry-log-duration').val();
            if (duration && !isNaN(duration)) {
                duration = Number(duration);
                var expectedOutTime = utils.addMinutes(new Date(), duration);
                this.$('#edit-station-entry-log-expected-out-time').html(helpers.formatDateWithDefault(expectedOutTime, "%r", "&nbsp;"));
            }
        },
        togglePurposeOther: function(show) {
            if (show) {
                this.$('#edit-station-entry-log-purpose-other-container').removeClass('hidden');
            } else {
                this.$('#edit-station-entry-log-purpose-other-container').addClass('hidden');
            }
        },
        cancelEditCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationEntryLogList);
            this.leave();
        }
    });

    return StationEntryLog;

});