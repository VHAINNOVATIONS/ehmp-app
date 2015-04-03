var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'hbs!app/applets/cds_advice/toolbar/useSelectorTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, Tpl) {
    'use strict';

    var self;
    return Backbone.Marionette.ItemView.extend({

        initialize: function (options) {
            this.optionList = options.optionList;
            this.model = options.model;
        },

        template: Tpl,
        className: 'list-group-item row-layout',
        events: {
            'change #use-options': 'useChanged'
        },

        useChanged: function () {
            var selectedUse = this.$('#use-options').val();
            this.model.set('selectedUse', selectedUse);
        },

        onRender: function () {
            // create the drop-down template HTML
            this.$el.html(this.template({
                options: this.optionList.toJSON()
            }));
            // update the drop down selection
            this.$('#use-options').val(this.model.get('selectedUse'));
        }

    });
}