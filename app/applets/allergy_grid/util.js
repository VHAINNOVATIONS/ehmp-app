var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
    'app/applets/allergy_grid/utilParse'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, util) {
    "use strict";
    var Util = util || {};

    Util.getModalTitle = function(model) {
        return 'Allergen - ' + model.get('summary');
    };

    Util.getOriginatedFormatted = function(response) {
        response.originatedFormatted = '';
        if (response.originated) {
            response.originatedFormatted = ADK.utils.formatDate(response.originated, "MM/DD/YYYY - HH:mm");
        }
        return response;
    };

    return Util;
}