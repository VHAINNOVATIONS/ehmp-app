var dependencies = [
    "main/ADK",
    "backbone",
    "marionette",
    'underscore',
    'hbs!app/applets/stackedGraph/list/stackedGraphViewTemplate',

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, StackedGraphViewTemplate) {

    return Backbone.Marionette.LayoutView.extend({
        template: StackedGraphViewTemplate

    });
}