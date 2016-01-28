/**
 * getSum
 * Returns the sum of n item.
 */

define(['handlebars'], function(Handlebars) {
    'use strict';
    function getSum (parameters) {
        var sumValue = 0,
            v;
        for (var i = 0; i < arguments.length; i++) {
            v = parseFloat(arguments[i]);
            if (!isNaN(v)) sumValue += v;
        }
        return sumValue;
    }

    Handlebars.registerHelper('getSum', getSum);
    return getSum;
});