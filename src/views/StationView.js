define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            BaseSingletonView = require('views/BaseSingletonView'),
            DolStationModel = require('models/DolStationModel'),
            DolStationView = require('views/DolStationView'),
            EditWarningListView = require('views/EditWarningListView'),
            AppEventNamesEnum = require('enums/AppEventNamesEnum'),
            UserRolesEnum = require('enums/UserRolesEnum'),
            appEvents = require('events'),
            template = require('hbs!templates/Station');

    var StationView = BaseSingletonView.extend({
        initialize: function(options) {
            console.trace('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, AppEventNamesEnum.addLinkedStationSuccess, this.addLinkedStationSuccess);
            this.listenTo(this.model, AppEventNamesEnum.addLinkedStationError, this.addLinkedStationError);
            this.listenTo(this.model, AppEventNamesEnum.clearLinkedStationSuccess, this.clearLinkedStationSuccess);
            this.listenTo(this.model, AppEventNamesEnum.clearLinkedStationError, this.clearLinkedStationError);
            this.listenTo(appEvents, AppEventNamesEnum.addWarningSuccess, this.onAddWarningSuccess);
            this.listenTo(appEvents, AppEventNamesEnum.allWarningsCleared, this.onAllWarningsCleard);
        },
        render: function() {
            console.trace('StationView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            currentContext.updateViewFromModel();

            if (currentContext.newDolStationViewInstance) {
                this.$('#dol-station-view').html(currentContext.newDolStationViewInstance.el);
            }
            this.renderWarningListView();

            this.hideLoading();

            return this;
        },
        renderWarningListView: function() {
            var currentContext = this;
            var warningCollection = new Backbone.Collection();
            var editWarningListView = new EditWarningListView({
                stationModel: currentContext.model,
                collection: warningCollection,
                dispatcher: currentContext.dispatcher
            });
            editWarningListView.render();
            currentContext.$('#warning-list-view-container').html(editWarningListView.el);
        },
        setUserRole: function(userRole) {
            this.userRole = userRole;
//            this.userRole = 'NocUser';
        },
        events: {
            'click .directions-link': 'goToDirectionsWithLatLng',
            'click .section-header': 'toggleSectionDetails',
            'click #linked-station-add-button': 'goToAddLinkedStation',
            'keypress #linked-station-id-input': 'invokeInputLinkedStationId',
            'click #linked-station-save-button': 'validateAndSubmitLinkedStation',
            'click #linked-station-cancel-edit-button': 'goToCancelEditLinkedStation',
            'click #linked-station-edit-button': 'goToEditLinkedStation',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        updateUserPrivileges: function() {
            if (this.userRole === UserRolesEnum.NocAdmin) {
                this.$('#linked-station-add-button').removeClass('hidden');
                this.$('#linked-station-edit-button').removeClass('hidden');
            } else {
                this.$('#linked-station-add-button').addClass('hidden');
                this.$('#linked-station-edit-button').addClass('hidden');
            }
        },
        updateViewFromModel: function() {
            var currentContext = this;
            currentContext.$('#linkedStationId').html(currentContext.model.get('linkedStationId'));
            currentContext.$('#linkedStationName').html(currentContext.model.get('linkedStationName'));
            if (currentContext.model.has('linkedStationId') && (currentContext.model.get('linkedStationId').length > 0)) {
                currentContext.displayLinkedStation(true);
            } else {
                currentContext.displayLinkedStation(false);
            }
            var hasWarnings = currentContext.model.get('hasWarnings');
            currentContext.displayHasWarnings(hasWarnings);
            currentContext.updateUserPrivileges();
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
                if (sectionHeaderButton[0].id === 'linked-station-details-header') {
                    //Lookup Linked Station details
                    if (!this.newDolStationViewInstance) {
                        this.goToDolStation();
                    } else {
                        if (this.model.get('linkedStationId') !== this.newDolStationViewInstance.model.get('stationId')) {
                            this.goToDolStation();
                        }
                    }
                }
            }
        },
        goToDirectionsWithLatLng: function(event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        goToAddLinkedStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            $("#linked-station-input-container").removeClass('hidden');
            $("#linked-station-add-container").addClass('hidden');
            this.$('#linked-station-id-input').focus();
        },
        invokeInputLinkedStationId: function(event) {
            var validPattern = /^[0-9\s]*$/;
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    this.validateAndSubmitLinkedStation();
                }
                var charCode = event.charCode || event.keyCode || event.which;
                var inputChar = String.fromCharCode(charCode);
                if (!validPattern.test(inputChar) && event.charCode !== 0) {
                    event.preventDefault();
                    return false;
                }
            }
        },
        validateAndSubmitLinkedStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.showLoading();
            var currentContext = this;
            if ((currentContext.$('#linked-station-id-input').val() === '') ||
                    (($.isNumeric(currentContext.$('#linked-station-id-input').val())) &&
                            (currentContext.$('#linked-station-id-input').val() !== currentContext.model.get('linkedStationId')))) {
                currentContext.model.set({
                    linkedStationId: currentContext.$('#linked-station-id-input').val(),
                    linkedStationName: ''
                });
                currentContext.updateStation();
            } else {
                currentContext.showError('Linked station id must be a number.');
                this.$('#linked-station-id-input').focus();
                currentContext.hideLoading();
                return false;
            }
        },
        displayLinkedStation: function(linkedStationExists) {
            if (linkedStationExists) {
                $("#linked-station-icon").removeClass('hidden');
                $("#linked-station-name-and-id").removeClass('hidden');
                $("#linked-station-add-container").addClass('hidden');
                $("#linked-station-details-not-linked").addClass('hidden');
                $("#linked-station-details-linked").removeClass('hidden');
                $("#linked-station-details-panel").removeClass('hidden');

            } else {
                $("#linked-station-icon").addClass('hidden');
                $("#linked-station-name-and-id").addClass('hidden');
                $("#linked-station-add-container").removeClass('hidden');
                $("#linked-station-details-not-linked").removeClass('hidden');
                $("#linked-station-details-linked").addClass('hidden');
                $("#linked-station-details-panel").addClass('hidden');
            }
        },
        displayHasWarnings: function(hasWarnings) {
            if (hasWarnings) {
                $("#station-warning-icon").removeClass('hidden');
            } else {
                $("#station-warning-icon").addClass('hidden');
            }
        },
        updateStation: function() {
            this.dispatcher.trigger(AppEventNamesEnum.updateLinkedStation, this.model);
        },
        updateLinkedStationSuccess: function() {
            var currentContext = this;
            $("#linked-station-input-container").addClass('hidden');
            if (currentContext.newDolStationViewInstance) {
                currentContext.newDolStationViewInstance.model.trigger('destroy');
            }
            currentContext.showSuccess('linked station successfully saved');
            currentContext.hideLoading();
        },
        updateLinkedStationError: function(message) {
            var currentContext = this;
            if (currentContext.model.previous('linkedStationId')) {
                currentContext.model.set({
                    linkedStationId: currentContext.model.previous('linkedStationId'),
                    linkedStationName: currentContext.model.previous('linkedStationName')
                });
            } else {
                currentContext.model.unset('linkedStationId');
            }
            currentContext.showError(message);
            $("#linked-station-input-container").removeClass('hidden');
            $("#linked-station-add-container").addClass('hidden');
            $("#linked-station-name-and-id").addClass('hidden');
            $("#linked-station-details-panel").addClass('hidden');
            this.$('#linked-station-id-input').focus();
            currentContext.hideLoading();
        },
        goToCancelEditLinkedStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            $("#linked-station-input-container").addClass('hidden');
            if (this.model.has('linkedStationId') && (this.model.get('linkedStationId').length > 0)) {
                this.displayLinkedStation(true);
            } else {
                this.displayLinkedStation(false);
            }
        },
        goToEditLinkedStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.$('#linked-station-id-input').val(currentContext.model.get('linkedStationId'));
            $("#linked-station-input-container").removeClass('hidden');
            $("#linked-station-name-and-id").addClass('hidden');
            this.$('#linked-station-id-input').focus();
        },
        goToDolStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;

            var newDolStationModelInstance = new DolStationModel();
            currentContext.newDolStationViewInstance = new DolStationView({
                model: newDolStationModelInstance,
                controller: currentContext,
                dispatcher: currentContext.dispatcher
            });
            currentContext.renderChildInto(currentContext.newDolStationViewInstance, currentContext.$('#dol-station-view'));

            var newLinkedStationId = currentContext.$('#linked-station-id-input').val();
            var currentLinkedStationId = this.model.get('linkedStationId');
            var linkedStationId = '';
            if (newLinkedStationId) {
                linkedStationId = newLinkedStationId;
            } else {
                linkedStationId = currentLinkedStationId;
            }
            var options = {
                stationId: linkedStationId,
                stationType: 'TD'
            };
            currentContext.newDolStationViewInstance.showLoading();
            currentContext.dispatcher.trigger(AppEventNamesEnum.refreshLinkedStationDetails, currentContext.newDolStationViewInstance.model, options);
        },
        onAddWarningSuccess: function() {
            this.displayHasWarnings(true);
        },
        onAllWarningsCleard: function() {
            this.displayHasWarnings(false);
        }
    });

    return StationView;

});