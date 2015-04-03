var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "app/applets/progress_notes/summary/singleRowModal/singleRowModalView",
    "hbs!app/applets/progress_notes/summary/row",
    "main/ADK"
];
'use strict';
define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, modalView, summaryRowTemplate, ADK) {

    return Backbone.Marionette.ItemView.extend({
        tagName: "tr",
        template: summaryRowTemplate,
        events: {
            'click td': 'showModal'
        },
        showModal: function(event) {
            event.preventDefault();
            var view = new modalView();
            view.model = this.model;
            console.log(view.model);

            ADK.showModal(view);
        }
    });

}