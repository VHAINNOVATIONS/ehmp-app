var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/vista_health_summaries/templates/modalTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, modalTemplate) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        template: modalTemplate
    });
}