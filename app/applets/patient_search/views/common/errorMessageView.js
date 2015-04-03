var dependencies = [
    "backbone",
    "marionette",
    "hbs!app/applets/patient_search/templates/common/errorMessageTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, errorMessageTemplate) {

    var ErrorMessageView = Backbone.Marionette.ItemView.extend({
        model: new Backbone.Model(),
        template: errorMessageTemplate,
        tagName: "p"
    });

    return ErrorMessageView;

}