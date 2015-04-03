var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/rows"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            rowOne: "#rowOne",
            rowTwo: "#rowTwo"
        },
        className: "contentPadding"
    });

    return layoutView;
}