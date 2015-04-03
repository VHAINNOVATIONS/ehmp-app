var dependencies = [
    "backbone",
    "marionette",
    "underscore"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _) {
    return {
        addAllergyApplication: new Backbone.Marionette.Application(),
        events: {
            ADD_SYMPTOMS: 'addSymptomsEvent',
            REMOVE_SYMPTOMS: 'removeSymptomsEvent'
        }
    };
}