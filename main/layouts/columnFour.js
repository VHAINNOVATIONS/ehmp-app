var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/columnFour"
];

define(dependencies, onResolveDependencies);


function onResolveDependencies(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            one: "#one",
            two: "#two",
            three: "#three",
            four: "#four"
        },
        className: "contentPadding"
    });

    return layoutView;
}