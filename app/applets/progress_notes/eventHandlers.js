var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "main/ADK"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, ADK) {

    var EventHandlers = {
        sortCollection: function(collection, key, sortType, ascending) {
            ADK.utils.sortCollection(collection, key, sortType, ascending);
        }
    };

    return EventHandlers;
}