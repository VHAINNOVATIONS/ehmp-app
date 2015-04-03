var dependencies = [
    "backbone",
    "marionette",
    "hbs!app/applets/patient_search/templates/common/loadingTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, loadingTemplate) {

    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: loadingTemplate
    });

    return LoadingView;

}