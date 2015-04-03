var nativeAppLauncher = {
    launchAppWithURI: function(uri) {
        cordova.exec(null, null, "AppLauncherPlugin", "launchAppWithURI", [uri]);
    }
}