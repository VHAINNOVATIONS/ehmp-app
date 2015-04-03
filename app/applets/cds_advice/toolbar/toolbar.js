var dependencies = [
    'backbone',
    'app/applets/cds_advice/toolbar/toolbarView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, ToolbarView) {
    'use strict';

    /**
     * Type of rules invocation. Specifies the invocation mode.
     */
    var RULES_INVOCATION_USE = {
        FAMILY_MED: 'FamilyMedicine',
        OCCUPATIONAL_MED: 'OccupationalMedicine',
        TEST: 'test'
    };

    var toolbarModel = new Backbone.Model({
        selectedUse: RULES_INVOCATION_USE.FAMILY_MED
    });

    // TODO: Update with real USE values
    var useDropdownList = new Backbone.Collection([
        {
            label: 'Family Medicine',
            value: RULES_INVOCATION_USE.FAMILY_MED
        },
        {
            label: 'Occupational Medicine',
            value: RULES_INVOCATION_USE.OCCUPATIONAL_MED
        }
    ]);

    return {
        /**
         * Creates a new ToolbarView.
         *
         */
        createView: function () {
            return new ToolbarView({
                optionList: useDropdownList,
                model: toolbarModel
            });
        },
        getModel: function () {
            return toolbarModel;
        }
    };
}