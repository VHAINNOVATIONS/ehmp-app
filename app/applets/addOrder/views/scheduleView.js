var dependencies = [
    'app/applets/addOrder/helpers/opDataUtil'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(opDataUtil) {

    return opDataUtil.getComboBoxView('name');
}