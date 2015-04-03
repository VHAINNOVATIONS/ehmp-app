var dependencies = [
    "backbone",
    "marionette",
    "underscore"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _) {

    var DateHandlers = {

        isDateBefore: function(date, model) {
            //convert the date to an acceptable format
            if (date === undefined) return true;
            if (model === undefined || model.referenceDateTime === undefined) return false; //if there is no entered, filter out
            return date <= model.referenceDateTime.substr(0, 8);
        },
        isDateAfter: function(date, model) {
            if (date === undefined) return true;
            if (model === undefined || model.referenceDateTime === undefined) return false; //if there is no entered, filter out
            return date >= model.referenceDateTime.substr(0, 8);
        }

    };

    return DateHandlers;
}