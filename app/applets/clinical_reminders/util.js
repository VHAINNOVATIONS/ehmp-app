var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
];

"use strict";
define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, util) {
    "use strict";

    var Util = util || {};

    Util.getDueDateFormatted = function(response) {
        if (response.dueDate) {
            //the source format of the date is YYYYMMDDHHmmss for clinical reminders from RDK            
            response.dueDateFormatted = ADK.utils.formatDate(response.dueDate, 'YYYY-MM-DD', 'YYYYMMDDHHmmss');
        }
        return response;
    };

    Util.getDoneDateFormatted = function(response) {
        if (response.doneDate) {
            //the source format of the date is YYYYMMDDHHmmss for clinical reminders from RDK 
            response.doneDateFormattted = ADK.utils.formatDate(response.doneDate, 'YYYY-MM-DD', 'YYYYMMDDHHmmss');
        }
        return response;
    };


    return Util;
}