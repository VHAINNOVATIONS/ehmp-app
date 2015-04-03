var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/gridOne"
];

define(dependencies, onResolveDependencies);


function onResolveDependencies(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            center: "#center"
        }
    });

    return layoutView;
}