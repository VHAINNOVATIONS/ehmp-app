var dependencies = [
    "main/ADK",
    "app/applets/immunizations_add_edit/views/addEditImmunizationView"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, addEditImmunizationView){
    return {
        id: "immunizations_add_edit",
        hasCSS: true,
        getRootView: function() {
            return addEditImmunizationView;
        }
    };
}