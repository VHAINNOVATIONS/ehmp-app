var dependencies = [
    'main/ADK',
    'app/applets/addAllergy/allergenSearchView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, allergenSearchView) {
    var applet = {
        id: 'addAllergy',
        hasCSS: true,
        getRootView: function() {
            return allergenSearchView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('addAllergyRequestChannel');
        channel.reply('addAllergyModal', function() {
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