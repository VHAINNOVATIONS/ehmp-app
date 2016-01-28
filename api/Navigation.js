'use strict';
define([
    'backbone',
    'jquery',
    'api/Messaging'
], function(Backbone, $, Messaging) {
    var Events = {
        navigate: function(screenName, routeOptions, extraScreenDisplayOptions) {
            if (screenName.charAt(0) === '#') {
                screenName = screenName.slice(1);
            }
            Messaging.trigger('screen:navigate');
            var globalChannel = Backbone.Wreqr.radio.channel('global');
            globalChannel.commands.execute('screen:navigate', screenName, routeOptions, extraScreenDisplayOptions);
        },
        displayScreen: function(screenName) {
            if (screenName.charAt(0) === '#') {
                screenName = screenName.slice(1);
            }
            var globalChannel = Backbone.Wreqr.radio.channel('global');
            globalChannel.commands.execute('screen:display', screenName);
        }
    };

    return Events;
});