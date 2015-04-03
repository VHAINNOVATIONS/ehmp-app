var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/allergy_grid/details/detailsTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, detailsTemplate) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        template: detailsTemplate
    });
}