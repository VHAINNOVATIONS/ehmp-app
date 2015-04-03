var dependencies = [
    'backgrid',
    'backgrid-moment-cell'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies() {
    'use strict';

    //Custom Cells
    Backgrid.HandlebarsCell = Backgrid.Cell.extend({
        className: 'handlebars-cell',
        render: function() {
            this.$el.empty();
            this.$el.html(this.column.get('template')(this.model.toJSON()));
            this.delegateEvents();
            return this;
        }
    });

}