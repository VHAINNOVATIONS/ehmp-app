'use strict';
define(function() {
    var predefinedScreens = {};

    var screens = [{
        title: 'Coversheet',
        id: 'cover-sheet',
        routeName: 'cover-sheet',
        predefined: true,
        description: ''
    }, {
        title: 'Timeline',
        id: 'news-feed',
        routeName: 'news-feed',
        description: '',
        predefined: true
    }, {
        title: 'Overview',
        id: 'overview',
        routeName: 'overview',
        description: '',
        predefined: true
    }, {
        title: 'Meds Review',
        id: 'medication-review',
        routeName: 'medication-review',
        description: '',
        predefined: true
    }, {
        title: 'Documents',
        id: 'documents',
        routeName: 'documents-list',
        description: '',
        predefined: true
    }];

    predefinedScreens.screens = screens;

    return predefinedScreens;
});
