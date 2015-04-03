var dependencies = [
    'hbs!main/components/applet_chrome/templates/refreshButtonTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(refreshButtonTemplate) {
    'use strict';
    var RefreshButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: refreshButtonTemplate
    });
    return RefreshButtonView;
}