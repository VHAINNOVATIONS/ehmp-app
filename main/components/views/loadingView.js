var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/views/loadingTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, LoadingTemplate) {
    'use strict';
    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: LoadingTemplate
    });

    var Loading = {
        create: function(options) {
            var loadingView = new LoadingView();
            return loadingView;
        }

    };
    return Loading;
}