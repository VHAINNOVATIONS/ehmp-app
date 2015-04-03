var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/navigation/navigationTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, PatientHeaderTemplate) {

    var PatientHeaderView = Backbone.Marionette.ItemView.extend({
        template: PatientHeaderTemplate,
        modelEvents: {
            "change": "render"
        }
    });

    return PatientHeaderView;
}