var dependencies = [
    'underscore',
    'backbone',
    'marionette',
    'jquery',
    'api/SessionStorage',
    'main/ADK',
    'app/applets/appletsManifest',
    'api/ResourceService',
    'app/screens/PreDefinedScreens',
    'api/UserService',
    'app/screens/ScreensManifest'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(_, Backbone, Marionette, $, Session, ADK, appletsManifest, ResourceService, preDefinedScreens, UserService, ScreensManifest) {
    'use strict';

    var UserDefinedScreens = {};
    var id;

    UserDefinedScreens.getAppletDefaultConfig = function(id) {
        var appletConfig = _.find(appletsManifest.applets, function(applet) {
            return applet.id === id;
        });
        if (_.isUndefined(appletConfig)) {
            appletConfig = {
                id: id,
                title: 'Title undefined'
            };
        }
        return _.clone(appletConfig);
    };

    UserDefinedScreens.serializeGridsterScreen = function($gridster, screenName) {
        var divs = $gridster.find('[data-row]');
        var screen = {
            id: screenName,
            contentRegionLayout: 'gridster',
            appletHeader: 'navigation',
            appLeft: 'patientInfo',
            userDefinedScreen: true,
        };
        var applets = [];
        divs.each(function() {
            var $appletEl = $(this).find('[data-appletid]');
            var applet = {};
            var id;
            if ($appletEl.length > 0) {
                id = $appletEl.attr('data-appletid');
                if (!_.isUndefined(id)) {
                    applet = UserDefinedScreens.getAppletDefaultConfig(id);
                    applet.instanceId = $appletEl.attr('data-instanceid');
                    applet.region = $(this).attr('id');
                    applet.dataRow = $(this).attr('data-row');
                    applet.dataCol = $(this).attr('data-col');
                    applet.dataSizeX = $(this).attr('data-sizex');
                    applet.dataSizeY = $(this).attr('data-sizey');

                    applet.dataMinSizeX = $(this).attr('data-min-sizex');
                    applet.dataMinSizeY = $(this).attr('data-min-sizey');
                    applet.dataMaxSizeX = $(this).attr('data-max-sizex');
                    applet.dataMaxSizeY = $(this).attr('data-max-sizey');
                    applet.viewType = $(this).attr('data-view-type');
                    applets.push(applet);
                }

            } else {
                id = $(this).attr('data-appletid');
                if (!_.isUndefined(id)) {
                    applet = UserDefinedScreens.getAppletDefaultConfig(id);
                    applet.instanceId = $(this).attr('data-instanceid');
                    applet.region = $(this).attr('id');
                    applet.dataRow = $(this).attr('data-row');
                    applet.dataCol = $(this).attr('data-col');
                    applet.dataSizeX = $(this).attr('data-sizex');
                    applet.dataSizeY = $(this).attr('data-sizey');

                    applet.dataMinSizeX = $(this).attr('data-min-sizex');
                    applet.dataMinSizeY = $(this).attr('data-min-sizey');
                    applet.dataMaxSizeX = $(this).attr('data-max-sizex');
                    applet.dataMaxSizeY = $(this).attr('data-max-sizey');
                    applet.viewType = $(this).attr('data-view-type');
                    applets.push(applet);
                }

            }


        });
        screen.applets = applets;
        return screen;
    };

    UserDefinedScreens.setAppletDataAttribute = function(currentApplet) {
        if (_.isUndefined(currentApplet.dataSizeX)) currentApplet.dataSizeX = 4;
        if (_.isUndefined(currentApplet.dataSizeY)) currentApplet.dataSizeY = 4;
        if (currentApplet.viewType === 'expanded') {
        	currentApplet.dataSizeX = 8;
            currentApplet.dataMinSizeX = 8;
            currentApplet.dataMaxSizeX = 12;
            currentApplet.dataMinSizeY = 4;
            currentApplet.dataMaxSizeY = 12;
        } else if (currentApplet.viewType === 'gist') {
            currentApplet.dataMinSizeX = 4;
            currentApplet.dataMaxSizeX = 8;
            currentApplet.dataMinSizeY = 4;
            currentApplet.dataMaxSizeY = 12;

        } else {
            //summary view or default
            currentApplet.dataMinSizeX = 4;
            currentApplet.dataMaxSizeX = 8;
            currentApplet.dataMinSizeY = 4;
            currentApplet.dataMaxSizeY = 12;
        }
    };

    UserDefinedScreens.getGridsterTemplate = function(screenModule) {
        var template = '<div class="gridster">';
        _.each(screenModule.applets, function(currentApplet) {
            UserDefinedScreens.setAppletDataAttribute(currentApplet);
            template += '<div id="' + currentApplet.region +
                '" data-row="' + currentApplet.dataRow +
                '" data-col="' + currentApplet.dataCol +
                '" data-sizex="' + currentApplet.dataSizeX +
                '" data-sizey="' + currentApplet.dataSizeY +
                '" data-min-sizex="' + currentApplet.dataMinSizeX +
                '" data-max-sizex="' + currentApplet.dataMaxSizeX +
                '" data-min-sizey="' + currentApplet.dataMinSizeY +
                '" data-max-sizey="' + currentApplet.dataMaxSizeY +
                '" data-view-type="' + currentApplet.viewType +
                '" ></div>';
        });
        template += '</div>';
        return template;
    };

    UserDefinedScreens.getGridsterTemplateForEditor = function(screenModule) {
        var deferred = new $.Deferred();
        UserDefinedScreens.updateScreenModuleFromStorage(screenModule).done(function() {
            var template = '<div id="gridster2" class="gridster"><ul>';
            _.each(screenModule.applets, function(currentApplet) {
                UserDefinedScreens.setAppletDataAttribute(currentApplet);
                template += '<li id="' + currentApplet.region +
                    '" data-appletid="' + currentApplet.id +
                    '" data-instanceid="' + currentApplet.instanceId +
                    '" data-row="' + currentApplet.dataRow +
                    '" data-col="' + currentApplet.dataCol +
                    '" data-sizex="' + currentApplet.dataSizeX +
                    '" data-sizey="' + currentApplet.dataSizeY +
                    '" data-min-sizex="' + currentApplet.dataMinSizeX +
                    '" data-max-sizex="' + currentApplet.dataMaxSizeX +
                    '" data-min-sizey="' + currentApplet.dataMinSizeY +
                    '" data-max-sizey="' + currentApplet.dataMaxSizeY +
                    '" data-view-type="' + currentApplet.viewType +
                    '" ><div class="edit-applet fa fa-cog"></div><br><div class="formatButtonText"><p class="applet-title">' + currentApplet.title + '<p>' + getViewTypeDisplay(currentApplet.viewType) + '</div>';
            });
            template += '</ul></div>';
            deferred.resolve(template);
        });
        return deferred;

        function getViewTypeDisplay(type){
            if(type === "gist"){
                return "trend";
            } else {
                return type;
            }
        }
    };

    UserDefinedScreens.updateScreenModuleFromStorage = function(screenModule) {
        var gridsterScreenConfig_promise = UserDefinedScreens.getGridsterConfig(screenModule.id);
        var deferred = new $.Deferred();
        gridsterScreenConfig_promise.done(function(gridsterScreenConfig) {
            // console.log('updateScreenModuleFromStorage gridster config', JSON.stringify(gridsterScreenConfig.toJSON()));
            if (gridsterScreenConfig && !_.isUndefined(gridsterScreenConfig.get('applets')) && !_.isNull(gridsterScreenConfig.get('applets'))) {
                screenModule.applets = gridsterScreenConfig.get('applets');
            }
            deferred.resolve();
        });
        return deferred;
    };

    UserDefinedScreens.saveConfigToJDS = function(json, key) {
        var id = getId();
        var model = new Backbone.Model({
            screenType: key,
            param: json
        });
        model.urlRoot = ADK.ResourceService.buildUrl('write-user-defined-screens', {
            pid: id
        });
        model.save();
    };

    UserDefinedScreens.saveGridsterConfig = function(gridsterAppletJson, key) {
        UserDefinedScreens.saveGridsterConfigToSession(gridsterAppletJson, key);
        UserDefinedScreens.saveConfigToJDS(gridsterAppletJson, key);
    };

    UserDefinedScreens.saveGridsterConfigToSession = function(gridsterAppletJson, key) {
        // console.log('save to session' + key, gridsterAppletJson);
        Session.set.sessionModel(key, new Backbone.Model(gridsterAppletJson));
    };

    UserDefinedScreens.getConfig = function(key) {
        var deferred = new $.Deferred();
        var id = getId();
        if (_.isUndefined(key) || _.isUndefined(id)) {
            deferred.resolve(new Backbone.Model({}));
            return deferred;
        }

        var res = Session.get.sessionModel(key).toJSON();
        if (!_.isUndefined(res) && !_.isEmpty(res)) {
            deferred.resolve(new Backbone.Model(res));
            return deferred;
        }

        // return Session.get.sessionModel(key).toJSON(); //Old Version
        var fetchOptions = {
            resourceTitle: 'user-defined-screens',
            criteria: {
                pid: id,
                screenType: key
            }
        };
        var coll;

        fetchOptions.onSuccess = function() {
            if (coll.length > 0) {
                deferred.resolve(coll.at(0));
                if(!_.isUndefined(id)) {
                    Session.set.sessionModel(key, coll.at(0));
                }
            }
            else {
                deferred.resolve(new Backbone.Model({}));
            }
        };
        fetchOptions.onError = function() {
            deferred.resolve(new Backbone.Model({}));
        };
        coll = ADK.ResourceService.fetchCollection(fetchOptions);
        return deferred;
    };

    UserDefinedScreens.getGridsterConfig = function(key) {
        return UserDefinedScreens.getConfig(key);
    };

    UserDefinedScreens.saveScreensConfig = function(screenConfigJson) {
        var nullScreenExists = _.some(screenConfigJson.screens, function(screen){
            return !screen;
        });
        if(nullScreenExists){
            console.log('Error: Cannot save a null or undefined screen. Removing that screen');
            var definedScreensOnly = _.filter(screenConfigJson.screens, function(screen){
                if(!_.isUndefined(screen) && screen !== null){
                    return screen;
                }
            });
            screenConfigJson.screens = definedScreensOnly;
        }
        var pid = getId();
        if (pid) {
            UserDefinedScreens.saveScreensConfigToSession(screenConfigJson);
            UserDefinedScreens.saveConfigToJDS(screenConfigJson, 'UserScreensConfig');
        }
    };

    UserDefinedScreens.saveScreensConfigToSession = function(screenConfigJson) {
        Session.set.sessionModel('UserScreensConfig', new Backbone.Model(screenConfigJson));
    };

    UserDefinedScreens.cloneGridsterConfig = function(origScreenId, newScreenId){
        var configClone = Session.get.sessionModel(origScreenId).toJSON();
        if (!_.isUndefined(configClone) && !_.isEmpty(configClone)) {
            configClone.id = newScreenId;
            UserDefinedScreens.saveGridsterConfig(configClone, newScreenId);
        }
    };

    UserDefinedScreens.addNewScreen = function(newScreenConfig) {
        var promise = UserDefinedScreens.getScreensConfig();
        promise.done(function(screensConfig) {
            var screens = screensConfig.screens;
            screens.push(newScreenConfig);
            UserDefinedScreens.saveScreensConfig(screensConfig);
        });

    };

    UserDefinedScreens.screensConfigNullCheck = function() {
        var promise = UserDefinedScreens.getScreensConfig('UserScreensConfig');
        promise.done(function(screenConfig) {
            var definedScreensOnly = _.filter(screenConfig.screens, function(screen){
                if(!_.isUndefined(screen) && screen !== null){
                    return screen;
                }else{
                    console.log("Deleted null screen");
                }
            });
            screenConfig.screens = definedScreensOnly;
            UserDefinedScreens.saveScreensConfig(screenConfig);
        });
    };

    UserDefinedScreens.getScreensConfig = function() {
        var promise = UserDefinedScreens.getConfig('UserScreensConfig');
        var deferred = new $.Deferred();
        promise.done(function(screenConfig) {
            var pdScreens = preDefinedScreens.screens;
            screenConfig = screenConfig.toJSON();
            if (_.isEmpty(screenConfig)) {
                screenConfig = {
                    screens: []
                };
            }

            var userDefined = false;
            _.each(screenConfig.screens, function(screen) {
                if (!screen) {
                    return;
                }
                userDefined = !screen.predefined;
                if (userDefined) {
                    UserDefinedScreens.getConfig(screen.routeName);
                }
            });

            _.each(pdScreens, function(screen) {
                var containScreen = _.filter(screenConfig.screens, function(s) {
                    if(!s || !screen){
                        return;
                    }
                    return s.id === screen.id;
                });
                if (containScreen.length === 0){
                    screenConfig.screens.push(screen);

                 }
                 else{
                    // var newArry = screenConfig.screens;
                    // newArry.pop();
                    // screenConfig.screens = newArry;
                    // UserDefinedScreens.saveScreensConfig(screenConfig);
                }

            });
            deferred.resolve(screenConfig);
        });
        return deferred;
    };

    UserDefinedScreens.sortScreensByIds = function(ids) {
        var promise = UserDefinedScreens.getScreensConfig();
        promise.done(function(screensConfig) {
            var screens = screensConfig.screens;

            var newConfig = {
                screens: []
            };

            _.each(ids, function(id) {
                var screen = _.find(screens, function(screen) {
                    return screen.id === id;
                });
                newConfig.screens.push(screen);
            });
            UserDefinedScreens.saveScreensConfig(newConfig);
        });

    };

    UserDefinedScreens.getDefaultScreenIdFromScreenConfig = function() {
        var promise = UserDefinedScreens.getScreensConfig();
        var deferred = new $.Deferred();
        var screen = ScreensManifest.defaultScreen;
        promise.done(function(screensConfig) {
            var screens = screensConfig.screens;
            for (var i = 0, len = screens.length; i < len; i++) {
                if (screens[i].defaultScreen) {
                    screen = screens[i].id;
                    break;
                }
            }
            deferred.resolve(screen);
        });
        return deferred;
    };

    function getId() {

        var patient = ADK.PatientRecordService.getCurrentPatient();
        var id;

        // Get the pid param in the same way as ADK.PatientRecordService.fetchCollection does
        if (patient.get("icn")) {
            id = patient.get("icn");
        } else if (patient.get("pid")) {
            id = patient.get("pid");
        } else {
            id = patient.get("id");
        }

        return id;

    }



    return UserDefinedScreens;
}