var dependencies = [
    "main/ADK",
    "app/applets/discharge_summary/detailController"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, DetailController) {

    var appletDefinition = {
        appletId: "discharge_summary",
        resource:"patient-record-document",
        hasCSS: true
    };

    DetailController.initialize(appletDefinition.appletId);

    return ADK.createSimpleApplet(appletDefinition);
}
