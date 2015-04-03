var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/gridFour"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            topLeft: "#topLeft",
            topRight: "#topRight",
            bottomLeft: "#bottomLeft",
            bottomRight: "#bottomRight"
        },
        className: "contentPadding"
    });

    return layoutView;
}