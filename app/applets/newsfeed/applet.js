var dependencies = [
    'main/ADK',
    "app/applets/newsfeed/summary/summaryLayout",
    "app/applets/newsfeed/summary/summaryLayoutGDT",
    "app/applets/newsfeed/visitDetail/visitDetailController"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, SummaryLayout, SummaryLayoutGDT, VisitDetailController) {

    VisitDetailController.initialize();

    var applet = {
        id: "newsfeed",
        hasCSS: true,
        viewTypes: [{
            type: 'summary',
            view: SummaryLayout,
            chromeEnabled: true
        }, {
            type: 'summaryGDT',
            view: SummaryLayoutGDT,
            chromeEnabled: true
        }],
        defaultViewType: 'summary'

    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('timelineSummary');
        channel.reply('createTimelineSummary', function() {
            var view = SummaryLayoutGDT;
            var options = {
                viewTypes: applet.viewTypes
            };

            var response = $.Deferred();
            response.resolve({
                view: new view(options),
            });


            return response.promise();
        });
    })();

    return applet;
}