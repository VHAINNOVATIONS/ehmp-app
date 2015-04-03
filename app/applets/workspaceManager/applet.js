var dependencies = [
    'underscore',
    'main/ADK',
    'backbone',
    'marionette',
    'app/applets/workspaceManager/appletLayoutView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(_, ADK, Backbone, Marionette, AppletLayoutView) {

    'use strict';

    var RootView = Backbone.Marionette.LayoutView.extend({
        showView: function(event, options) {
            var view = ADK.showFullscreenOverlay(AppletLayoutView, {'callShow': true});
            view.initGridster();
        }
    });

    var applet = {
        id: 'workspaceManager',
        hasCSS: true,
        getRootView: function() {
            return RootView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('workspaceManagerChannel');
        channel.on('workspaceManager', function() {
            var view = ADK.showFullscreenOverlay(new AppletLayoutView(), {'callShow': true});
        });
    })();

    return applet;
}