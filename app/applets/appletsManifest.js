'use strict';
define(function() {
    var appletsManifest = {};

    var applets = [{
        id: 'vitals',
        title: 'Vitals',
        maximizeScreen: 'vitals-full',
        showInUDWSelection: true //true to show up in User Defined Workspace Carousel
    }, {
        id: 'stackedGraph',
        title: 'Stacked Graphs',
        showInUDWSelection: true
    }, {
        id: 'activeMeds',
        title: 'Medications',
        showInUDWSelection: true
    }, {
        id: 'problems',
        title: 'Conditions',
        maximizeScreen: 'problems-full',
        showInUDWSelection: true
    }, {
        id: 'lab_results_grid',
        title: 'Lab Results',
        maximizeScreen: 'lab-results-grid-full',
        showInUDWSelection: true
    }, {
        id: 'encounters',
        title: 'Encounters',
        maximizeScreen: 'news-feed',
        showInUDWSelection: true
    }, {
        id: 'appointments',
        title: 'Appointments & Visits',
        maximizeScreen: 'appointments-full',
        showInUDWSelection: true
    }, {
        id: 'immunizations',
        title: 'Immunizations',
        maximizeScreen: 'immunizations-full',
        showInUDWSelection: true
    }, {
        id: 'allergy_grid',
        title: 'Allergies',
        maximizeScreen: 'allergy-grid-full',
        showInUDWSelection: true
    }, {
        id: 'orders',
        title: 'Orders',
        maximizeScreen: 'orders-full',
        showInUDWSelection: true
    }, {
        id: 'ccd_grid',
        title: 'Community Health Summaries',
        maximizeScreen: 'ccd-list-full',
        showInUDWSelection: true
    }, {
        id: 'cds_advice',
        title: 'Clinical Reminders',
        maximizeScreen: 'cds-advice-full',
        showInUDWSelection: true
    }, {
        id: 'documents',
        title: 'Documents',
        showInUDWSelection: true
    }, {
        id: 'medication_review',
        title: 'Medications Review',
        showInUDWSelection: true
    }, {
        id: 'newsfeed',
        title: 'Timeline',
        showInUDWSelection: true
    }, {
        id: 'vista_health_summaries',
        title: 'VistA Health Summaries',
        showInUDWSelection: true
    }, {
        id: 'addApplets',
        title: 'Add Applets'
    }, {
        id: 'workspaceManager',
        title: 'Workspace Manager'
    }];

    appletsManifest.applets = applets;

    return appletsManifest;
});
