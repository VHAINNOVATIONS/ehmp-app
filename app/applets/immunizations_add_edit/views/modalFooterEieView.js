var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/immunizations_add_edit/templates/footerEieTemplate',
    'main/ADK'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, FooterTemplate, ADK) {
    'use strict';

    var immunizationChannel = ADK.Messaging.getChannel('immunization');

    return Backbone.Marionette.ItemView.extend({
        events: {
            'click #remove-immunization': 'removeImmunization',
            'click #back-eie': 'goBack'
        },
        goBack: function(){
            console.log('eie back');
        },        
        removeImmunization: function(){
            console.log('removed!');
        },
        template: FooterTemplate

    });

}
