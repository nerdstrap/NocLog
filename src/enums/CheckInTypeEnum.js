define(function(require) {

    "use strict";

    var CheckInTypeEnum = {
        station: 'station',
        adHoc: 'adHoc'
    };
    if (Object.freeze) {
        Object.freeze(CheckInTypeEnum);
    }

    return CheckInTypeEnum;

});