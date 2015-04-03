/*jslint node: true, nomen: true, unparam: true */
/*global jquery, _, $ */

'use strict';

require.config({
    /**
     * Manage dependencies using Bower.
     * _assets/libs includes custom or non-Bower libraries.
     *
     * Current requirements: backbone#1.0.0, marionette#~2.0, custom hbs#0.4.0
     */
    paths: {
        "async": "bower_components/async/lib/async",
        "backbone": "bower_components/backbone/backbone-min",
        "backbone.paginator": "bower_components/backbone.paginator/lib/backbone.paginator.min",
        "backbone.radio": "bower_components/backbone.radio/src/backbone.radio",
        "backbone-sorted-collection": "bower_components/backbone-sorted-collection/backbone-sorted-collection",
        "sessionstorage": "bower_components/backbone-sessionStorage/backbone.sessionStorage",
        "backgrid-moment-cell": "bower_components/backgrid-moment-cell/backgrid-moment-cell.min",
        "backgrid.filter": "bower_components/backgrid-filter/backgrid-filter.min",
        "bootstrap-datepicker": "bower_components/bootstrap-datepicker/js/bootstrap-datepicker",
        "crossfilter": "bower_components/crossfilter/crossfilter.min",
        "fastclick": "bower_components/fastclick/lib/fastclick",
        "highcharts": "bower_components/highstock-release/highstock.src",
        "highcharts-more": "bower_components/highstock-release/highcharts-more.src",
        "jasmine": "bower_components/jasmine/lib/jasmine-core/jasmine",
        "jasmine-html": "bower_components/jasmine/lib/jasmine-core/jasmine-html",
        "jquery": "bower_components/jquery/jquery.min",
        // "marionette": "bower_components/marionette/lib/backbone.marionette.min",
        "moment": "bower_components/moment/min/moment.min",
        "placeholders": "bower_components/placeholders/lib/utils",
        "underscore": "bower_components/lodash/dist/lodash.underscore.min", // code requires lodash instead of backbone's underscore

        // involve vendor.scss changes
        "backgrid": "bower_components/backgrid/lib/backgrid.min",
        "bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min",
        "bootstrap-timepicker": "bower_components/bootstrap-timepicker/js/bootstrap-timepicker.min",
        "gridster": "bower_components/gridster/dist/jquery.gridster.min",

        // custom libraries (don't do this)
        "hbs": "_assets/libs/handlebars/hbs-0.4.0-custom",
        "handlebars": "_assets/libs/handlebars/handlebars.min",
        "i18nprecompile": "_assets/libs/handlebars/i18nprecompile",
        "json2": "_assets/libs/handlebars/json2",
        "marionette": "_assets/libs/marionette/backbone.marionette-2.4.1-custom.min",


        "backbone.fetch-cache": "_assets/libs/backbone-fetch-cache/backbone.fetch-cache.custom",
        "backgrid.paginator": "_assets/libs/backgrid/backgrid-paginator-master/backgrid-paginator-custom", // custom pagination
        "bootstrap-accessibility": "_assets/libs/bootstrap/accessibility/bootstrap-accessibility-custom.min",
        "modernizr": "_assets/libs/modernizr/modernizr-2.6.2.min", // actually using custom in index.html
        "jquery.inputmask": "_assets/libs/jquery.inputmask/dist/jquery.inputmask.bundle-custom",

        "ie-console-fix": "_assets/libs/ie-console/ie-console-fix",

        // Theming

        // Utilities
        "parser": "core/utilities/parser",

        // Plugins
        "text": "_assets/libs/require/plugins/text",
        "jasminejquery": "_assets/libs/jquery/plugins/jasmine-jquery",
        "jquery.form": "_assets/libs/jquery/plugins/jquery.form.min-20130616",
        "jquery.formparams": "_assets/libs/jquery/plugins/jquery.formparams",
        "jquery-datatable": "_assets/libs/jquery/jquery-datatable/jquery.dataTables.min",
        "jquery-scroll": "_assets/libs/jquery/jquery-scroll/jquery.scrollstart.scrollstop",
        "jquerymobile-autocomplete": "_assets/libs/jqm/jqm-autocomplete/jquery.mobile.accessible-autocomplete",
        "jquerymobile-datepicker": "_assets/libs/jqm/jqm-datepicker/jquery.accessibleDatePicker",
        "jquerymobile-timepicker": "_assets/libs/jqm/jqm-timepicker/jquery.accessibleTimePicker",

        "typeahead": "bower_components/typeahead/dist/typeahead.bundle.min",

        "Init": "main/Init",
        "ADKApp": "main/ADKApp",
        "ADK": "main/ADK",
        "ResourceDirectory": "main/ResourceDirectory",
        "Utils": "main/Utils",

        // Test directory
        "test": "test"
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "jquery-datatable": {
            deps: ["jquery"]
        },
        "typeahead": {
            deps: ["jquery"],
            exports: "Typeahead"
        },
        "jquery-scroll": {
            deps: ["jquery"]
        },
        "highcharts": {
            "deps": ["jquery"],
            "exports": "Highcharts"
        },
        "highcharts-more": {
            "deps": ["jquery", "highcharts"],
            "exports": "HighchartsMore"
        },
        "backbone": {
            "deps": ["underscore"],
            "exports": "Backbone"
        },
        "backbone.paginator": {
            "deps": ["backgrid"]
        },
        "backbone.radio": {
            "deps": ["backbone"]
        },
        "marionette": {
            "deps": ["underscore", "backbone", "jquery"],
            "exports": "Marionette"
        },
        "handlebars": {
            "exports": "Handlebars"
        },
        "jasmine": {
            "exports": "jasmine"
        },
        "jasmine-html": {
            "deps": ["jasmine"],
            "exports": "jasmine"
        },
        "modernizr": {
            "exports": "modernizr"
        },
        "sessionstorage": {
            "deps": ["backbone", "underscore"]
        },
        "backgrid": {
            "deps": ['backbone', 'jquery', 'underscore'],
            "exports": "Backgrid"
        },
        "backgrid.filter": {
            "deps": ['backgrid']
        },
        "backgrid.paginator": {
            "deps": ['backgrid']
        },
        "backgrid-moment-cell": {
            "deps": ['backgrid']
        },
        "jquery.inputmask": {
            "deps": ["jquery"]
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "bootstrap-accessibility": {
            "deps": ["jquery", "bootstrap"]
        },
        "bootstrap-datepicker": {
            "deps": ["jquery"]
        },
        "bootstrap-timepicker": {
            "deps": ["jquery"]
        },
        "placeholders": {
            "deps": ["jquery"]
        },
        "gridster": {
            "deps": ["jquery"]
        },
        "crossfilter": {
            "deps": [],
            "exports": "crossfilter"
        }
    },
    // hbs config - must duplicate in Gruntfile.js Require build
    hbs: {
        templateExtension: "html",
        helpers: true,
        i18n: false,

        compileOptions: {} // options object which is passed to Handlebars compiler
    }
});

var appStart = [
    'ie-console-fix',
    'bootstrap',
    'bootstrap-accessibility',
    'bootstrap-datepicker',
    'bootstrap-timepicker',
    'placeholders',
    'gridster',
    'Init'
];

require(appStart);
