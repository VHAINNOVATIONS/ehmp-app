'use strict';
var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'jquery',
    'main/components/adk_nav/navView',
    'main/Session',
    'main/ComponentLoader',
    'main/components/patient/patientHeaderView',
    'main/components/views/ccowObjectsView',
    'main/ADK',
    'main/Utils',
    'app/screens/ScreensManifest',
    'api/SessionStorage',
    'api/UserDefinedScreens',
    'main/components/applets/view_switchboard/optionsSelectionView',
    'main/ScreenBuilder',
    'highcharts',
    'main/components/applet_chrome/chromeView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, $, Nav, session, ComponentLoader, PatientHeaderView, CCOWObjectsView, ADK, Utils, ScreensManifest, SessionStorage, UserDefinedScreens, ViewSwitchboard, ScreenBuilder, Highcharts, ChromeView) {

    var ScreenDisplay = {};

    ScreenDisplay.createScreen = function(screenModule, screenName, routeOptions, ADKApp) {
        if (screenModule) {
            if (ADKApp.currentScreen && ADKApp.currentScreen.config.onStop) {
                ADKApp.currentScreen.config.onStop();
            }
            ADKApp.currentScreen = screenModule;

            screenModule.buildPromise.done(function() {
                // Only show CCOW ActiveX controls in IE & if we have a session already
                if ("ActiveXObject" in window && (screenName !== ScreensManifest.logonScreen)) {
                    var ccowView = new CCOWObjectsView();
                    ADKApp.ccowRegion.show(ccowView);
                }

                var contentRegion_layoutView, topRegion_layoutView, centerRegion_layoutView;
                screenModule.topRegion_layoutPromise.done(function() {
                    topRegion_layoutView = new screenModule.topRegion_layoutView();
                    ADKApp.topRegion.show(topRegion_layoutView);

                    screenModule.centerRegion_layoutPromise.done(function() {
                        centerRegion_layoutView = new screenModule.centerRegion_layoutView();
                        ADKApp.centerRegion.show(centerRegion_layoutView);

                        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                        ComponentLoader.load(ADKApp, topRegion_layoutView, centerRegion_layoutView, screenModule.config, currentPatient);

                        //Adding margin to top of contentRegion to allow topRegion to have fixed position
                        //On resize of the window, re-calulate the height of topRegion
                        $(window).resize(function() {
                            if (this.resizeTO) clearTimeout(this.resizeTO);
                            this.resizeTO = setTimeout(Utils.resize.centerRegion(centerRegion_layoutView, topRegion_layoutView, ADKApp), 100);
                        });
                        Utils.resize.centerRegion(centerRegion_layoutView, topRegion_layoutView, ADKApp);

                        screenModule.contentRegion_layoutPromise.done(function() {
                            //creating dynamic template for gridster enabled page
                            //cover-sheet-gridster only for now
                            if (screenModule.config.userDefinedScreen || screenModule.config.contentRegionLayout === 'gridster') {
                                var deferred = UserDefinedScreens.updateScreenModuleFromStorage(screenModule);
                                deferred.done(function() {
                                    var template = UserDefinedScreens.getGridsterTemplate(screenModule);
                                    contentRegion_layoutView = new screenModule.contentRegion_layoutView({
                                        template: _.template(template),
                                        freezeApplets: screenModule.config.freeApplets
                                    });
                                    centerRegion_layoutView.content_region.show(contentRegion_layoutView);

                                    screenModule.contentRegion_layoutView_obj = contentRegion_layoutView;

                                    $('body').removeClass();
                                    $('body').addClass('' + screenName);

                                    _.each(screenModule.applets, function(currentApplet) {

                                        if (typeof currentApplet.setDefaultView === 'function') {
                                            currentApplet.setDefaultView();
                                        }
                                        var appletModule = ADKApp[currentApplet.id];
                                        ScreenDisplay.addAppletToScreen(appletModule, currentApplet, screenModule, routeOptions);
                                    });
                                });

                            } else {
                                contentRegion_layoutView = new screenModule.contentRegion_layoutView();
                                centerRegion_layoutView.content_region.show(contentRegion_layoutView);

                                screenModule.contentRegion_layoutView_obj = contentRegion_layoutView;

                                //TEMPORARY FIX FOR LOGIN BACKGROUND IMAGE TO NOT DISPLAY IN APP
                                $('body').removeClass();
                                $('body').addClass('' + screenName);

                                _.each(screenModule.applets, function(currentApplet) {

                                    if (typeof currentApplet.setDefaultView === 'function') {
                                        currentApplet.setDefaultView();
                                    }
                                    var appletModule = ADKApp[currentApplet.id];
                                    ScreenDisplay.addAppletToScreen(appletModule, currentApplet, screenModule, routeOptions);
                                });
                            }
                        });
                    });
                });

                if (screenModule.config.onStart) {
                    screenModule.config.onStart();
                    $('#screen-reader-screen-description').html('You have navigated to '+ screenName + '. Skip to main content.').focus();
                }
            });
        }
    };

    ScreenDisplay.addAppletToScreen = function(appletModule, appletConfig, screenModule, routeOptions) {
        if (appletModule) {
            $.when(screenModule.contentRegion_layoutPromise,
                screenModule.centerRegion_layoutPromise,
                screenModule.topRegion_layoutPromise,
                appletModule.buildPromise).then(function() {
                var regionName = appletConfig.region;
                if (_.isUndefined(appletConfig.instanceId) || _.isNull(appletConfig.instanceId)) {
                    appletConfig.instanceId = appletConfig.id;
                }

                var viewType = appletModule.defaultViewType || "",
                    AppletView,
                    options = {
                        appletConfig: appletConfig,
                        routeParam: routeOptions,
                        viewTypes: appletModule.appletConfig.viewTypes,
                        defaultViewType: appletModule.appletConfig.defaultViewType
                    };
                if (appletConfig.viewType !== undefined && appletConfig.viewType !== "undefined") {
                    viewType = appletConfig.viewType;
                }
                if (appletModule.viewTypes) {
                    if (Utils.appletViewTypes.isChromeEnabled(appletModule.appletConfig, viewType)) {
                        AppletView = ChromeView.extend({
                            appletScreenConfig: appletConfig,
                            AppletView: new Utils.appletViewTypes.getViewTypeConfig(appletModule.appletConfig, viewType).view,
                            AppletController: ADK.Views.AppletControllerView.extend({viewType: viewType}),
                            attributes: {
                                'data-appletid': appletConfig.id,
                                'data-instanceId': appletConfig.instanceId,
                            }
                        });
                    } else {
                        AppletView = ADK.Views.AppletControllerView.extend({
                            viewType: viewType
                        }).extend({
                            attributes: {
                                'data-appletid': appletConfig.id,
                                'data-instanceId': appletConfig.instanceId,
                            }
                        });
                    }
                } else {
                    //Still use old getRootView as backup until it is deprecated
                    AppletView = appletModule.getRootView(viewType).extend({
                        attributes: {
                            'data-appletid': appletConfig.id,
                            'data-instanceId': appletConfig.instanceId,
                        }
                    });
                }
                var contentRegion_layoutView = screenModule.contentRegion_layoutView_obj;
                if (regionName !== 'none') {
                    if (_.isUndefined(contentRegion_layoutView[regionName])) {
                        contentRegion_layoutView.addRegion(regionName, '#' + regionName);
                    }
                    options.region = contentRegion_layoutView[regionName];
                    contentRegion_layoutView[regionName].show(new AppletView(options));
                }

                if (appletModule.displayApplet) {
                    appletModule.displayApplet();
                }
            });
        }
    };


    return ScreenDisplay;
}