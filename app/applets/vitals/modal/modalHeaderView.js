var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/vitals/modal/headerTemplate',
    "main/ADK"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, HeaderTemplate, ADK) {
    'use strict';

    var theView;

    //Modal Navigation Item View
    return Backbone.Marionette.ItemView.extend({
        events: {
            'click #vitals-previous, #vitals-next': 'navigateModal'
        },

        navigateModal: function(e) {
            var $target = $(e.currentTarget),
                id = $target.attr('id');

            id === 'vitals-previous' ? this.theView.getPrevModal() : this.theView.getNextModal();
        },

        template: HeaderTemplate

    });

}