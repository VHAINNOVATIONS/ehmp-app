var dependencies = [
    "backbone",
    "marionette",
    "hbs!app/applets/medication_review/list/medicationListGraphTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, medicationListGraphTemplate) {

    var MedicationListGraphView = Backbone.Marionette.ItemView.extend({
        template: medicationListGraphTemplate
    });

    return MedicationListGraphView;
}