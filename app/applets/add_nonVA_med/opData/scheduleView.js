var dependencies = [
    "app/applets/add_nonVA_med/opData/opDataUtil"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(opDataUtil) {

    return opDataUtil.getComboBoxView('name');
}