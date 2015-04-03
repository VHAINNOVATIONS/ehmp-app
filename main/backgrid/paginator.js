var dependencies = [
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'backgrid',
    'backgrid.paginator'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, $, _, Backgrid) {
    'use strict';
    var Paginator = {};

    Paginator.create = function(options) {
        var paginatorOptions = {
            slideScale: 0
        };
        _.extend(paginatorOptions, options);
        var paginatorView = new Backgrid.Extension.Paginator(paginatorOptions);
        return paginatorView;
    };

    return Paginator;
}