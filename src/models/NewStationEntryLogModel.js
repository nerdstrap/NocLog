define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            utils = require('utils');

    var NewStationEntryLogModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId'
    });

    return NewStationEntryLogModel;
});