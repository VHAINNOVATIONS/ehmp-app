var dependencies = [
    "main/ADK",
    "app/applets/newsfeed/visitDetail/visitDetailView"
];
'use strict';
define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, visitDetailView) {

    var VisitDetailController = {
        initialize: function () {
            var channel = ADK.Messaging.getChannel('visitDetail');
            channel.reply('detailView', function (params) {
                var response = $.Deferred();
                if (params.model !== undefined) {
                    response.resolve({
                        view: new visitDetailView({
                            model: params.model
                        }),
                        title: params.model.get('summary') || params.model.get('typeDisplayName') //hacktasktic

                    });
                }
                else {
                    //go fetch the details from the server
                }
                return response.promise();
            });
        }
    };
    return VisitDetailController;
}
