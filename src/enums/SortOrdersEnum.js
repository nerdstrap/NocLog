define(function(require) {
    'use strict';

    var SortOrdersEnum = {
        asc: 1,
        desc: -1,
        unknown: 0
    };
    
    if (Object.freeze) {
        Object.freeze(SortOrdersEnum);
    }

    return SortOrdersEnum;
});