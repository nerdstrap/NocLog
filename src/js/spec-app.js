define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var specs = [];
    specs.push('specs/goToStationEntryLogListSpec');
    specs.push('specs/goToStationEntryLogHistoryListSpec');
    specs.push('specs/goToMaintainPurposesSpec');
    specs.push('specs/refreshMaintainPurposesSpec');
    specs.push('specs/checkInSpec');
    specs.push('specs/checkOutSpec');
    specs.push('specs/updateCheckInSpec');
    specs.push('specs/addItemSpec');
    specs.push('specs/updateItemSpec');

    $(document).ready(function() {
        require(specs, function(spec) {
            window.executeTests();
        });
    });
});
