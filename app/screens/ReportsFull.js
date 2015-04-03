var dependencies = [
    "backbone",
    "marionette",
    "main/ADK",
    // "hbs!app/applets/discharge_summary/applet"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, ADK) {
    'use strict';

    var screenConfig = {
        id: 'reports-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [
        {
            id: 'reports',
            title: 'Reports',
            region: 'center',
            fullScreen: true
        },
        {
            id: 'discharge_summary',
            title: "Discharge Summary",
            region: 'none'
        },
        {
            id: 'consults',
            title: "Consults",
            region: 'none'
        },
        {
            id: 'surgery',
            title: "Surgery Report",
            region: 'none'
        }],
        patientRequired: true
    };
    return screenConfig;
}
