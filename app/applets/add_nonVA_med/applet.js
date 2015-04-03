var dependencies = [
    'main/ADK',
    'app/applets/add_nonVA_med/searchMeds'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, searchMeds) {
    var applet = {
        id: 'add_nonVA_med',
        hasCSS: true,
        getRootView: function() {
            return searchMeds;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('medicationChannel');
        channel.reply('addNonVaMedModal', function() {
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