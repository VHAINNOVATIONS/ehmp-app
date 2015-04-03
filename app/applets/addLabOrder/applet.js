var dependencies = [
    'main/ADK',
    'app/applets/addLabOrder/views/addLabOrderView'
];

define(dependencies, onResolveDependencies);

// Channel constants
var ADD_LAB_ORDER_REQUEST_CHANNEL = 'addALabOrderRequestChannel';
var ADD_ORDER_MODAL = 'addLabOrderModal';

function onResolveDependencies(ADK, addLabOrderView) {
    var applet = {
        id: 'addLabOrder',
        hasCSS: true,
        getRootView: function() {
            return addLabOrderView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('addALabOrderRequestChannel');
        channel.reply('addLabOrderModal', function() {
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