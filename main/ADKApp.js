'use strict';
var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'jquery',
    'main/Session',
    'main/ADK',
    'main/ScreenDisplay',
    'app/screens/ScreensManifest',
    "api/SessionStorage",
    "api/UserDefinedScreens",
    'main/ScreenBuilder'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, $, Session, ADK, ScreenDisplay, ScreensManifest, SessionStorage, UserDefinedScreens, ScreenBuilder) {

    var ADKApp = new Backbone.Marionette.Application();
    ADKApp.session = Session;
    ADK.ADKApp = ADKApp;

    ADKApp.on('start', function() {
        // save the original defaultscreen in case it gets changed
        ScreensManifest.predefinedDefaultScreen = ScreensManifest.defaultScreen;

        ADKApp.initAllRoutersPromise.done(function() {
            if (Backbone.history) {
                Backbone.history.start();
            }
        });
    });

    ADKApp.commands.setHandler('screen:navigate', function(screenName, routeOptions) {
        ADKApp.router.navigate(screenName);
        ADKApp.execute('screen:display', screenName, routeOptions);
    });

    ADKApp.commands.setHandler('screen:display', function(screenName, routeOptions) {
        if (!screenName) {
            var screenIdPromise = UserDefinedScreens.getDefaultScreenIdFromScreenConfig();
            screenIdPromise.done(function(screenIdFromConfig) {
                screenName = screenIdFromConfig;
                // if not logged in don't call navigate, we don't want to see the cover-sheet route.
                if (ADK.UserService.checkUserSession()) {
                    ADK.Navigation.navigate(screenName);
                }
            });
        }
        if (_.isUndefined(ADKApp[screenName])) {
            ADKApp.initAllRoutersPromise = new $.Deferred();
            ADKApp.resourceDirectoryLoaded.done(function() {
                var promise = ScreenBuilder.initAllRouters(ADKApp);
                promise.done(function() {
                    ScreenBuilder.buildAll(ADKApp);
                    ADKApp.initAllRoutersPromise.resolve();
                });
            });
        }
        console.log('Command display:screen received, screenName:', screenName);
        if ($('#mainModal').hasClass('in') || $('#mainOverlay').hasClass('in') || $('.modal-backdrop').hasClass('in')) {
            ADK.hideModal();
            ADK.hideFullscreenOverlay();
        }

        if (!ADK.UserService.checkUserSession()) {
            if (screenName !== ScreensManifest.ssoLogonScreen) {
                screenName = ScreensManifest.logonScreen;
            }
            if (!screenName) {
                console.log('logonScreen is undefined.  Update ScreensManifest with logonScreen.');
            }
        } else {
            ADKApp.initAllRoutersPromise.done(function() {
                ADKApp[screenName].buildPromise.done(function() {
                    if ($.isEmptyObject(ADK.PatientRecordService.getCurrentPatient().attributes) && (ADKApp[screenName].config.patientRequired === true)) {
                        screenName = ScreensManifest.patientSearchScreen;
                        ADKApp.router.navigate(screenName);
                        screenModule = ADKApp[screenName];
                        console.log('No Patient Selected: rerouting to patient-search-screen');
                    }
                });
            });

        }
        var screenModule = ADKApp[screenName];
        ScreenDisplay.createScreen(screenModule, screenName, routeOptions, ADKApp);
    });

    ADK.Messaging.on('patient:selected', function(patient) {
        SessionStorage.clear('appletStorage');
        SessionStorage.clear('globalDate');
        SessionStorage.delete.sessionModel('patient');
        SessionStorage.addModel('patient', patient);
        ADK.Messaging.trigger('patient:change');
    });

    ADK.Messaging.on('patient:change', function() {
        var currentRoute = Backbone.history.fragment;
        ADKApp.execute('screen:display', currentRoute);
    });

    /**
     * This is the part that WILL take the user to the login screen
     * @return {undefined}
     */
    ADK.Messaging.on('user:sessionEnd', function() {
        var screenName = ScreensManifest.predefinedDefaultScreen;
        ADK.Navigation.navigate(screenName);
    });

    ADKApp.addRegions({
        ccowRegion: '#ccow-controls',
        topRegion: '#top-region',
        centerRegion: '#center-region',
        bottomRegion: '#bottom-region',
        modalRegion: '#modal-region'
    });

    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            '*default': 'defaultRoute'
        },
        onRoute: function(name, path, args) {
            console.log('onRoute name:', name);
            console.log('onRoute path:', path);
            console.log('onRoute args:', args);
        }
    });

    var AppController = Backbone.Marionette.Controller.extend({
        defaultRoute: function(routeName) {
            if (routeName && routeName.indexOf("?") > -1 && routeName.indexOf("=") > -1 && routeName.split("?")[0] === ScreensManifest.ssoLogonScreen) {
                var routeInfo = routeName.split("?");
                SessionStorage.clear('SSO');
                SessionStorage.addModel('SSO', new Backbone.Model({
                    'CPRSHostIP': routeInfo[1].split("=")[1]
                }));
                ADKApp.execute('screen:navigate', routeInfo[0]);
            } else {
                ADKApp.execute('screen:display');
            }
        }
    });

    ADKApp.router = new Router({
        controller: new AppController()
    });

    return ADKApp;
}