var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/centerRegionLayouts/templates/fullWidth"
];

define(dependencies, onResolveDependencies);


function onResolveDependencies(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            content_region: '#content-region'
        }
    });

    return layoutView;
}