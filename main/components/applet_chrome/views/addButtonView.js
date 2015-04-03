var dependencies = [
    'hbs!main/components/applet_chrome/templates/addButtonTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(addButtonTemplate) {
    'use strict';
    var AddButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: addButtonTemplate
    });
    return AddButtonView;
}