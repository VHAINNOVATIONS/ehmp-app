var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/centerRegionLayouts/templates/fixedLeft"
];

define(dependencies, onResolveDependencies);


function onResolveDependencies(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            content_left_region: '#content-left-region',
            content_region: '#content-region'
        }
    });

    return layoutView;
}