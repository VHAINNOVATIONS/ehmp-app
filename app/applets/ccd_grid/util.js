var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
    'app/applets/ccd_grid/utilParse'
];

"use strict";
define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, Util) {
    "use strict";

    Util.getResultedTimeFormatted = function(response) {
        response.resultedTimeFormatted = '';
        if (response.resulted) {
            response.resultedTimeFormatted = ADK.utils.formatDate(response.resulted, 'HH:mm');
        }
        return response;
    };

    return Util;
}
