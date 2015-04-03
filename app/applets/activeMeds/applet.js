var dependencies = [
    'main/ADK',
    "app/applets/activeMeds/appletLayout",
    "app/applets/activeMeds/gistView",
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, AppletLayoutView, GistView) {

    var applet = {
        id: "activeMeds",
        hasCSS: true,
        viewTypes: [{
            type: 'gist',
            view: GistView,
            chromeEnabled: true
        }, {
            type: 'summary',
            view: AppletLayoutView.extend({
                columnsViewType: "summary"
            }),
            chromeEnabled: true
        }],
        defaultViewType: 'summary'
    };

    return applet;
}