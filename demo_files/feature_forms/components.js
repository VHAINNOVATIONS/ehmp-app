define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {

    return [{
        id: 'modal',
        label: 'Modal',
        developmentStatus: true,
        cometStatus: true,
        storyNumber: 6707,
        documentationURL: "/documentation/#/adk/ui-library#Modal--window-"
    }, {
        id: 'tray',
        label: 'Tray Slider',
        developmentStatus: false,
        cometStatus: false,
        storyNumber: 7849,
        documentationURL: ""
    }, {
        id: 'workflow',
        label: 'Workflow',
        developmentStatus: true,
        cometStatus: true,
        storyNumber: 7450,
        documentationURL: "/documentation/#/adk/ui-library#Workflow--window-"
    }, {
        id: 'workflow_showProgressbar',
        label: 'Workflow (supports showing a progressbar with steps)',
        developmentStatus: true,
        cometStatus: true,
        storyNumber: 7450,
        documentationURL: "/documentation/#/adk/ui-library#Workflow--window-"
    }, {
        id: 'growlNotifications',
        label: 'Growl (Skype) Notifications',
        developmentStatus: true,
        cometStatus: true,
        storyNumber: 8088,
        documentationURL: "/documentation/#/adk/ui-library#Notification"
    }, {
        id: 'alert',
        label: 'Alert / Confirmation',
        developmentStatus: true,
        cometStatus: true,
        storyNumber: 8092,
        documentationURL: "/documentation/#/adk/ui-library#Alert--window-"
    },{
        id: 'collapsableContainer',
        label: 'Collapsable Containers',
        developmentStatus: true,
        cometStatus: true,
        storyNumber: 8423,
        documentationURL: "/documentation/#/adk/form-controls#Collapsible-Container"
    }];
});
