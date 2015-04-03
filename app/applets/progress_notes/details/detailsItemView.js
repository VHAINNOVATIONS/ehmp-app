var dependencies = [
	"backbone",
	"marionette",
	"underscore",
	"hbs!app/applets/progress_notes/details/row"
];
'use strict';
define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, detailsRowTemplate) {
    return Backbone.Marionette.ItemView.extend({
        tagName: "tr",
        template: detailsRowTemplate
    });
}