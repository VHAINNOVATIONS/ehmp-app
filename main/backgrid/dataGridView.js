var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/backgrid/dataGridTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, dataGridTemplate) {
    'use strict';

    var dataGridView = Backbone.Marionette.LayoutView.extend({
        template: dataGridTemplate,
        regions: {
            dataGridHeaderLeft: '.data-grid-header-left',
            dataGridHeaderRight: '.data-grid-header-right',
            dataGrid: '.data-grid'
        }
    });

    return dataGridView;
}