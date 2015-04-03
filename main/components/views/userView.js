var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/views/userTemplate",
    "main/ADK"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, userTemplate, ADK) {
    'use strict';
    var userView = Backbone.Marionette.ItemView.extend({
        model: ADK.UserService.getUserSession(),
        template: userTemplate,
        tagName: 'a',
        className: 'dropdown-toggle',
        attributes: {
            "href": "#"
        }
    });
    return userView;
}