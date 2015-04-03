var dependencies = [
    'backbone',
    'marionette',
    'underscore'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _) {
    'use strict';
    var Util = {};
  
    Util.getModalTitle = function(model) {
        return 'CCD Document - ' + model.get('name');
    };

    return Util;
}
