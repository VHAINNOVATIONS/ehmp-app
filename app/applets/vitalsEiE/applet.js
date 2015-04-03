var dependencies = [
    'underscore',
    'main/ADK',
    'app/applets/vitalsEiE/views/vitalsEiEBodyView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(_, ADK, vitalsEiEBodyView) {

    var applet = {
        id: 'vitalsEiE',
        hasCSS: false,
        getRootView: function() {
            return vitalsEiEBodyView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('vitalsEiE');
        channel.reply('vitalsEiEView', function() {
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