var dependencies = [
    'main/ADK',
    'app/applets/stackedGraph/list/stackedGraphView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, StackedGraphView) {
    var stackedGraphChannel = ADK.Messaging.getChannel('stackedGraph');

    var applet = {
        id: 'stackedGraph',
        hasCSS: true,
        getRootView: function(viewTypeOption) {
            return ADK.Views.AppletControllerView.extend({
                viewType: viewTypeOption
            });
        },
        viewTypes: [{
            type: 'summary',
            view: StackedGraphView,
            chromeEnabled: true
        }],

        defaultView: StackedGraphView
    };



    return applet;
}