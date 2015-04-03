var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
    'app/applets/appointments/utilParse'
];

"use strict";
define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, Util) {
    "use strict";

    Util.getDateTimeFormatted = function(response) {
        if (response.dateTime) {
            response.dateTimeFormatted = ADK.utils.formatDate(response.dateTime, 'MM/DD/YYYY - HH:mm');
        }
        return response;
    };

    return Util;
}