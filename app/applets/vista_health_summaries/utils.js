var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'main/ADK'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, ADK) {

    var utils = {

        getFacilityName : function(response) {
            if (response.siteName === undefined) {
                return response.siteKey;
            } else {
                return response.siteName;
            }
        }
    };

    return utils;
}