var dependencies = [
    "backbone",
    "marionette",
    "main/ADK",
    "ADKApp",
    "hbs!app/applets/medication_review/list/ordersTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, ADK, adkApp, ordersTemplate) {

    var OrderDetailView = Backbone.Marionette.ItemView.extend({
        template: ordersTemplate,
        // className: "detail-panel-item row-layout"
    });

    return OrderDetailView;
}