var dependencies = [
    "backbone",
    "main/ADK",
    "hbs!app/applets/newsfeed/visitDetail/visitDetailTemplate",
];
'use strict';
define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, ADK, visitDetailTemplate) {
    return Backbone.Marionette.ItemView.extend({
        template: visitDetailTemplate
    });
}
