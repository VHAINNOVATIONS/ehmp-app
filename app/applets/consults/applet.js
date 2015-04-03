var dependencies = [
    "main/ADK",
    "hbs!app/applets/consults/table",
    "hbs!app/applets/consults/row",
    "app/applets/consults/detailController"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, consultsTableTemplate, consultsRowTemplate, detailController) {

    var appletDefinition = {
        appletId: "consults",
        resource: "patient-record-consult",
        tableTemplate: consultsTableTemplate,
        rowTemplate: consultsRowTemplate,
        hasCSS: true
    };

    detailController.initialize(appletDefinition.appletId);

    return ADK.createSimpleApplet(appletDefinition);
}
