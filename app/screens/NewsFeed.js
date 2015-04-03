//----------------------------------------
// Name:        News Feed ADK Screen
// Applets:     News Feed Applet, Time Line Applet
// Screen:      NewsFeed.js
// Version:     1.1
// Modified:    2014-10-20
// Team:        Jupiter
// Description: Provides screen layout for Applets and inter applets communication 
//----------------------------------------
var dependencies = [
    "backbone",
    "marionette",
    "main/ADK",
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, ADK) {
    'use strict';
    var DEBUG = false;
    if (DEBUG) console.log("---------------->> News Feed Screen Started");

    var screenConfig = {
        id: 'news-feed',
        contentRegionLayout: 'fullOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'newsfeed',
            title: 'Timeline',
            region: 'center',
            fullScreen: true
        }, {
            id: 'documents',
            title: 'Documents',
            region: 'none'
        }],
        detailApplets: [{
            id: 'immunizations'
        }],
        started: false,
        onStart: function() {
            this.started = true;
        },
        patientRequired: true
    };
    return screenConfig;
}
