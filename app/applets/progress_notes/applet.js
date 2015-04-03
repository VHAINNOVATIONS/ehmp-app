var dependencies = [
    "main/ADK",
    "ADKApp",
    "app/applets/progress_notes/appletConfig",
    "app/applets/progress_notes/summary/itemView",
    "app/applets/progress_notes/summary/compositeView"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, ADKApp, AppletConfig, itemView, compositeView) {

    var appletDefinition = {
        appletId: AppletConfig.appletId,
        resource: AppletConfig.resource,
        viewModel: AppletConfig.viewModel,
        itemView: itemView,
        compositeView: compositeView
    };

    return ADK.createSimpleApplet(appletDefinition);
}