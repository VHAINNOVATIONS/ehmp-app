'use strict';
var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'hbs!main/components/navSearch/navTemplate',
    'main/ADK',
    'app/screens/ScreensManifest',
    'main/Session'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, navTemplate, ADK, ScreensManifest, Session) {
    return Backbone.Marionette.ItemView.extend({
        model: ADK.UserService.getUserSession(),
        template: navTemplate,
        className: 'col-md-12 appNav',
        events: {
            'click #logoutButton': 'logout'
        },
        logout: function() {
            ADK.Messaging.trigger('app:logout');
        },

    });
}