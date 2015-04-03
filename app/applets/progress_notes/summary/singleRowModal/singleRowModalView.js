var dependencies = [
	"backbone",
	"marionette",
	"underscore",
	"hbs!app/applets/progress_notes/summary/singleRowModal/table"
];
'use strict';
define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, modalTemplate) {
	return Backbone.Marionette.ItemView.extend({
		template: modalTemplate,
		className: "modal-content"
	});
}