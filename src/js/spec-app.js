define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var specs = [];
    specs.push('specs/goToStationEntryLogListSpec');
    specs.push('specs/goToStationEntryLogHistoryListSpec');

    $(document).ready(function () {
        require(specs, function (spec) {
            window.executeTests();
        });
    });
});
