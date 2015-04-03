var dependencies = [
    "backgrid"

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backgrid) {

    var TabIndexCell = Backgrid.Cell.extend({
        attributes: {
            tabindex: "0"
        }
    });


    return TabIndexCell;
}
