'use strict';
var dependencies = [
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'ADKApp',
    'main/ScreenBuilder',
    'ResourceDirectory',
    'main/ADK',
    'main/components/views/globalErrorView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, $, _, ADKApp, ScreenBuilder, ResourceDirectory, ADK, GlobalErrorView) {

    // this allows AJAX to send cookies to a server
    // these cookies are needed for the server's session to run
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        options.xhrFields = {
            withCredentials: true
        };
    });

    // $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    //     // (jqxhr.status === 401 && ADKApp.currentScreen.id !== 'logon-screen') ||
    //     if (jqxhr.status === 500 || (jqxhr.status === 503 && ADKApp.currentScreen.id !== 'logon-screen')) {
    //         var errorMessage, refreshButton, clearSession;
    //         switch (jqxhr.status) {
    //             case 401:
    //                 errorMessage = 'Access Denied<br/><small>You have been logged out.</small>';
    //                 refreshButton = 'LOGON';
    //                 clearSession = true;
    //                 break;
    //             case 500:
    //                 errorMessage = 'Critical Error!<br/><small>No response from server. Check your network settings and refresh the page.</small>';
    //                 refreshButton = 'Refresh Page';
    //                 break;
    //             case 503:
    //                 errorMessage = 'Operational Sync Not Complete<br/><small>Please wait a few minutes and try again.</small>';
    //                 refreshButton = 'Try Again';
    //                 break;
    //             default:
    //                 errorMessage = 'Error: ' + jqxhr.status + '<br/><small>Try refreshing the browser.</small>';
    //                 refreshButton = 'Refresh Page';
    //                 break;
    //         }
    //         var ModalRegionView = new GlobalErrorView({
    //             errorMessage: errorMessage,
    //             refreshButton: refreshButton,
    //             clearSession: clearSession
    //         });
    //         ADKApp.modalRegion.show(ModalRegionView);
    //         $('#mainModal').modal({
    //             show: true,
    //             backdrop: 'static',
    //             keyboard: false
    //         });
    //         $("#msg").append("<li>Error requesting page " + settings.url + "</li>");
    //     }
    // });

    Array.prototype.equals = function(array) {
        if (!array)
            return false;
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i]))
                    return false;
            } else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    };

    ADKApp.on('before:start', function() {

        ADKApp.resourceDirectoryLoaded = $.Deferred();

        var appManifest = new Backbone.Model();
        appManifest.fetch({
            url: '../manifest.json',
            global: false
        });
        ADK.Messaging.reply("appManifest", function() {
            return appManifest;
        });

        var appConfig = new Backbone.Model();
        ADK.Messaging.reply("appConfig", function() {
            return appConfig;
        });

        function fetchAppConfig() {
            var deferred = $.Deferred();
            appConfig.fetch({
                    url: '../app.json',
                    global: false
                })
                .done(function() {
                    deferred.resolve(appConfig);
                })
                .fail(function() {
                    console.log('Failed to resolve app.json');
                    deferred.reject();
                });

            return deferred.promise();
        }

        var onError = function() {
            var ModalRegionView = new GlobalErrorView({
                errorMessage: "No Response From Resource Server<br/><small>Ensure that you have a stable network connection.</small>",
                refreshButton: 'Refresh Page'
            });
            ADKApp.modalRegion.show(ModalRegionView);
            $('#mainModal').modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
        };

        $.when(fetchAppConfig()).then(function(appConfig) {
            console.log("AppConfig: ", appConfig);
            var resourceDirectory = ResourceDirectory.instance();
            resourceDirectory.fetch({
                url: appConfig.get('resourceDirectoryPath'),
                success: function() {
                    ADKApp.resourceDirectoryLoaded.resolve();
                },
                error: function() {
                    onError();
                }
            });
        }).fail(onError);

        ADKApp.initAllRoutersPromise = new $.Deferred();
        ADKApp.resourceDirectoryLoaded.done(function() {
            var promise = ScreenBuilder.initAllRouters(ADKApp);
            promise.done(function() {
                ScreenBuilder.buildAll(ADKApp);
                ADKApp.initAllRoutersPromise.resolve();
            });
        });


        var doit;
        $(window).on('resize load', function() {
            clearTimeout(doit);
            doit = setTimeout(ADK.utils.resize.dw, 300);
        });
    });
    ADKApp.start({});
    
}