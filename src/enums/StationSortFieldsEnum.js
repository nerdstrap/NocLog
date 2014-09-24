define(function(require) {
    'use strict';

    var StationSortFieldsEnum = {
        stationName: 'stationName',
        region: 'region',
        area: 'area'
    };

    if (Object.freeze) {
        Object.freeze(StationSortFieldsEnum);
    }

    return StationSortFieldsEnum;
});