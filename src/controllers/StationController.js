define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        StationSearchView = require('views/StationSearchView'),
        StationSearchModel = require('models/StationSearchModel'),
        events = require('events');

    /**
     * Creates a new StationController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var StationController = function (options) {
        console.trace('new StationController()');
        this.initialize.apply(this, arguments);
    };

    _.extend(StationController.prototype, Backbone.Events, {
        /** @class StationController
         * @contructs StationController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('StationController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher || events;
            this.stationSearchModel = new StationSearchModel();

            this.listenTo(events, AppEventNamesEnum.goToStationList, this.goToStationSearch);
        },
        /** Shows the station search view 
         */
        goToStationSearch: function () {
            console.trace('StationController.goToStationSearch');
            var currentContext = this,
                    deferred = $.Deferred();

            var stationSearchViewInstance = new StationSearchView({
                controller: currentContext,
                model: currentContext.stationSearchModel
            });

            currentContext.router.swapContent(stationSearchViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'station' || Backbone.history.fragment === '');
            currentContext.router.navigate('station', { replace: fragmentAlreadyMatches });
            deferred.resolve(stationSearchViewInstance);

            return deferred.promise();
        }
    });

    return StationController;
});