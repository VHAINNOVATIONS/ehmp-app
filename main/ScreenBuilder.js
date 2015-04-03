'use strict';
var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'main/ADK',
    'main/AppletBuilder',
    'app/screens/ScreensManifest',
    'api/SessionStorage',
    'main/Session',
    'api/UserDefinedScreens'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, ADK, AppletBuilder, screensManifest, SessionStorage, Session, UserDefinedScreens) {

    var ScreenBuilder = {};

    ScreenBuilder.addNewScreen = function(screenConfig, app) {
        screenConfig.fileName = "NewUserScreen";

        //initialize the screen
        var screenModule = app.module(screenConfig.routeName);
        screenModule.buildPromise = $.Deferred();
        var routeController = initializeRouteController(app, screenConfig.routeName);
        initializeRouter(screenConfig.routeName, routeController);

        //build the screen
        require(['app/screens/' + screenConfig.fileName], function(screenDescriptor) {
            screenDescriptor.id = screenConfig.id;
            onLoadScreen(screenDescriptor);
        });

        UserDefinedScreens.addNewScreen(screenConfig);

        function onLoadScreen(screenConfig) {
            ScreenBuilder.build(app, screenConfig);
        }
    };


    ScreenBuilder.editScreen = function(newScreenConfig) {
        var promise = UserDefinedScreens.getScreensConfig();
        promise.done(function(screensConfig) {
            var screenIndex;
            _.find(screensConfig.screens, function(screen, Idx) {
                if (screen.id == newScreenConfig.id) {
                    screenIndex = Idx;
                    return true;
                }
            });
            screensConfig.screens[screenIndex] = newScreenConfig;
            UserDefinedScreens.saveScreensConfig(screensConfig);
        });
    };

    //Deletes the user screen and checks if removed screen is a default screen
    ScreenBuilder.deleteUserScreen = function(screenTitle) {
        var promise = UserDefinedScreens.getScreensConfig();
        promise.done(function(screensConfig) {
            var screenToRemove = _.find(screensConfig.screens, function(screen) {
                return screen.title === screenTitle;
            });
            screensConfig.screens = _.without(screensConfig.screens, screenToRemove);
            UserDefinedScreens.saveScreensConfig(screensConfig);
            UserDefinedScreens.saveGridsterConfig({}, screenToRemove.id);
            if (screenToRemove.defaultScreen === true) {
                ScreenBuilder.setScreensManifestDefualtScreenToDefault();
                console.log("deleting user default screen, setting defaultscreen from predefined default");
            } else {
                //do nothing!
                console.log("Do Nothing - Sheet isnt set to Default");
            }

            // if we are trying to delete the screen that we came from, let's go back to the predefined default screen.
            if (Backbone.history.fragment === screenToRemove.id) {
                ADK.Navigation.navigate(screensManifest.predefinedDefaultScreen, {
                    trigger: false
                });
            }

        });
    };

    //Sets the Coversheet to Default, sets all other screens as not default
    ScreenBuilder.setScreensManifestDefualtScreenToDefault = function() {
        var promise = UserDefinedScreens.getScreensConfig();
        promise.done(function(screensConfig) {
            var setToDefault = _.map(screensConfig.screens, function(screen) {
                if (screen.id === screensManifest.predefinedDefaultScreen) {
                    screen.defaultScreen = true;
                    ScreenBuilder.setDefaultScreen(screen);
                } else {
                    screen.defaultScreen = false;
                }
                return screen;
            });
            var newScreenConfig = {};
            newScreenConfig.screens = setToDefault;
            UserDefinedScreens.saveScreensConfig(newScreenConfig);
        });
    };

    //Setting all screens to not be default
    ScreenBuilder.resetDefaultScreen = function() {
        var promise = UserDefinedScreens.getScreensConfig();
        promise.done(function(screensConfig) {
            var setNoDefault = _.map(screensConfig.screens, function(screen) {
                screen.defaultScreen = false;
                return screen;
            });

            var newScreenConfig = {};
            newScreenConfig.screens = setNoDefault;
            UserDefinedScreens.saveScreensConfig(newScreenConfig);
        });
    };

    ScreenBuilder.setDefaultScreen = function(newDefaultScreen) {
        screensManifest.defaultScreen = newDefaultScreen.id;

    };

    ScreenBuilder.initAllRouters = function(app) {
        var deferred = new $.Deferred();
        var promise = UserDefinedScreens.getScreensConfig();
        promise.done(function(screensConfig) {
            // concat user Session screens into screen manifest
            var additionalScreens = screensConfig.screens;

            _.each(additionalScreens, function(screen) {
                if (_.isUndefined(screen.routeName)) {
                    screen.routeName = screen.id;
                }
                var containScreen = _.filter(screensManifest.screens, function(s) {
                    return s.routeName === screen.routeName;
                });
                if (containScreen.length === 0) screensManifest.screens.push(screen);

            });

            _.each(screensManifest.screens, function initRouter(screenDescriptor) {
                var screenModule = app.module(screenDescriptor.routeName);
                screenModule.buildPromise = $.Deferred();
                var routeController = initializeRouteController(app, screenDescriptor.routeName);
                initializeRouter(screenDescriptor.routeName, routeController);
            });
            deferred.resolve();
        });
        return deferred;
    };

    ScreenBuilder.buildAll = function(marionetteApp) {
        _.each(screensManifest.screens, function loadScreen(screenDescriptor) {
            if (_.isUndefined(screenDescriptor.fileName) || screenDescriptor.fileName === 'NewUserScreen') {
                require(['app/screens/NewUserScreen'], function(screenConfig) {
                    screenConfig.id = screenDescriptor.id;
                    onLoadScreen(screenConfig);
                });
            } else {
                require(['app/screens/' + screenDescriptor.fileName], onLoadScreen);
            }
        });

        function onLoadScreen(screenConfig) {
            ScreenBuilder.build(marionetteApp, screenConfig);
        }

        require(['app/applets/appletsManifest'], loadUserDefinedScreenApplets);

        function loadUserDefinedScreenApplets(screenConfig) {
            _.each(screenConfig.applets, function(applet) {
                // If applet module is undefined, then no screen has built it yet
                if (marionetteApp[applet.id] === undefined) {
                    // marionetteApp[applet.id] will be defined from now on - another screen won't build it again
                    var appletModule = marionetteApp.module(applet.id);

                    appletModule.buildPromise = $.Deferred();
                    require(['app/applets/' + applet.id + '/applet'], function(appletPojo) {
                        AppletBuilder.build(marionetteApp, appletPojo);
                    });
                }
            });
        }
    };

    ScreenBuilder.build = function(marionetteApp, screenConfig) {
        var builtScreen = marionetteApp.module(screenConfig.id);
        initializeScreenModule(marionetteApp, builtScreen, screenConfig);
        builtScreen.buildPromise.resolve();
        return builtScreen;
    };

    function initializeScreenModule(marionetteApp, screenModule, screenConfig) {
        screenModule.id = screenConfig.id;
        screenModule.title = screenConfig.title;
        screenModule.applets = screenConfig.applets;
        if (screenConfig.patientRequired) {
            screenModule.patientRequired = screenConfig.patientRequired;
        } else screenModule.patientRequired = false;
        screenModule.config = screenConfig;
        if (screensManifest.testEnvironmentFlag && (screensManifest.testEnvironmentFlag === true)) {
            SessionStorage.addModel('patient', Session.patient);
        }
        var pathList = [];
        _.each(screenModule.applets, function(applet) {
            // If applet module is undefined, then no screen has built it yet
            if (marionetteApp[applet.id] === undefined) {
                // marionetteApp[applet.id] will be defined from now on - another screen won't build it again
                var appletModule = marionetteApp.module(applet.id);

                appletModule.buildPromise = $.Deferred();
                require(['app/applets/' + applet.id + '/applet'], function(appletPojo) {
                    AppletBuilder.build(marionetteApp, appletPojo);
                });
            }
        });

        //Layout to use in the top-region of index
        screenModule.topRegion_layoutPromise = $.Deferred();
        //If screen specifies true to the requiresPatient variable then use layout that shows patient related components.
        if (screenConfig.patientRequired === true) {
            screenConfig.topRegionLayout = "default_patientRequired";
        } else {
            screenConfig.topRegionLayout = "default_noPatientRequired";
        }
        require(['main/layouts/topRegionLayouts/' + screenConfig.topRegionLayout], function(loadedLayout) {
            screenModule.topRegion_layoutView = loadedLayout;
            screenModule.topRegion_layoutPromise.resolve();
        });

        //Layout to use in the center-region of index
        screenModule.centerRegion_layoutPromise = $.Deferred();
        //Add logic if screen needs to define the appCenterLayout
        screenConfig.centerRegionLayout = "default_fullWidth";
        require(['main/layouts/centerRegionLayouts/' + screenConfig.centerRegionLayout], function(loadedLayout) {
            screenModule.centerRegion_layoutView = loadedLayout;
            screenModule.centerRegion_layoutPromise.resolve();
        });

        //Layout to use in the applet-region
        screenModule.contentRegion_layoutPromise = $.Deferred();
        require(['main/layouts/' + screenConfig.contentRegionLayout], function(loadedLayout) {
            screenModule.contentRegion_layoutView = loadedLayout;
            screenModule.contentRegion_layoutPromise.resolve();
        });
    }

    function initializeRouter(routeName, routeController) {
        var routes = {};
        routes[routeName] = 'displayScreen';

        var routerOptions = {
            appRoutes: routes,
            controller: routeController
        };
        // console.log('initializeRouter', routes);
        new Marionette.AppRouter(routerOptions);
    }

    function initializeRouteController(marionetteApp, screenName) {
        return {
            displayScreen: function(routeOptions) {
                marionetteApp.execute('screen:display', screenName, routeOptions);
            }
        };
    }

    return ScreenBuilder;
}