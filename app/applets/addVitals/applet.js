var dependencies = [
    'main/ADK',
    'app/applets/addVitals/addVitalsView'
];

define(dependencies, onResolveDependencies);

// Channel constants
var ADD_VITALS_REQUEST_CHANNEL = 'addVitalsRequestChannel';
var ADD_VITALS_MODAL = 'addVitalsModal';

function onResolveDependencies(ADK, addVitalsView) {
    var applet = {
        id: 'addVitals',
        hasCSS: true,
        getRootView: function() {
            return addVitalsView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel(ADD_VITALS_REQUEST_CHANNEL);
        channel.reply(ADD_VITALS_MODAL, function() {
            var view = applet.getRootView();
            var response = $.Deferred();
            response.resolve({
                view: new view(),
            });

            return response.promise();
        });
    })();

    return applet;
}