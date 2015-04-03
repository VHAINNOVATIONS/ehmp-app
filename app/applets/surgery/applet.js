var dependencies = [
    "main/ADK",
    "app/applets/surgery/detailController"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, DetailController) {

    var appletDefinition = {
        appletId: "surgery",
        resource:"patient-record-document-view",
        hasCSS: true
    };

    DetailController.initialize(appletDefinition.appletId);

    return ADK.createSimpleApplet(appletDefinition);
}
