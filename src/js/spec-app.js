define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var specs = [];
    specs.push('specs/AppRouterSpec');
    specs.push('specs/GetStationEntryLogsSpec');

    $(document).ready(function () {
        require(specs, function (spec) {
            window.executeTests();
        });
    });
});
