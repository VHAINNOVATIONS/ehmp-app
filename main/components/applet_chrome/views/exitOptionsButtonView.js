var dependencies = [
    'hbs!main/components/applet_chrome/templates/exitOptionsButtonTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(exitOptionsButtonTemplate) {
    'use strict';
    var ExitOptionsButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: exitOptionsButtonTemplate
    });
    return ExitOptionsButtonView;
}