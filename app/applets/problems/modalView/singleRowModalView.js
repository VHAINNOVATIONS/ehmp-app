var dependencies = [
	"backbone",
	"marionette",
	"underscore",
	"hbs!app/applets/problems/modalView/table"
];
'use strict';
define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, modalTemplate) {
	return Backbone.Marionette.ItemView.extend({
		template: modalTemplate
	});
}