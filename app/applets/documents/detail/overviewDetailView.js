var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/documents/detail/simple/docDetailTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, detailTemplate) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        template: detailTemplate,
    });
}