var dependencies = [
    "main/ADK"

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK) {


    var GlobalDateController = {

        //Pass in the handler you want to run when the picker is selected.
        initialize: function (func, context) {
            ADK.Messaging.on('globalDate:updateTimelineSummaryViewOnly', function() {
                func.apply(context, arguments);
            });
        },

        destroyGlobalDateListener: function() {
            ADK.Messaging.off('globalDate:updateTimelineSummaryViewOnly');
        }

    };


    return GlobalDateController;
}
