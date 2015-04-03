var dependencies = [
    "backbone",
    "marionette",
    "hbs!app/applets/patient_search/templates/common/blankTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, blankTemplate) {

    var BlankView = Backbone.Marionette.ItemView.extend({
        template: blankTemplate
    });

    return BlankView;

}