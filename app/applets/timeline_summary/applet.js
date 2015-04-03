var dependencies = [
    'main/ADK',
    'app/applets/timeline_summary/views/timelineSummaryDG'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, timelineSummaryView) {
    var applet = {
        id: 'timeline_summary',
        //instanceId: 'timeline_summary',
        hasCSS: true,
        getRootView: function() {
            return timelineSummaryView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('globalDate');
        channel.reply('createTimelineSummary', function() {
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