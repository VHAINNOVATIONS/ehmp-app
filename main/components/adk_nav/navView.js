'use strict';
var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'hbs!main/components/adk_nav/navTemplate',
    'main/ADK',
    'app/screens/ScreensManifest'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, navTemplate, ADK, ScreensManifest) {
    return Backbone.Marionette.ItemView.extend({
        model: ADK.UserService.getUserSession(),
        template: navTemplate,
        className: 'col-md-12 navbar-fixed-top heightSmall',

        events: {
            'click #logoutButton': 'logout'
        },

        logout: function() {
            ADK.Messaging.trigger('app:logout');
        }
    });
}