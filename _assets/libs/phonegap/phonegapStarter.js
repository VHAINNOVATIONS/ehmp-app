// This event will be called when cordova is fully loaded
var phonegapInit = function(routerInit){
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var plistLoaderCompletionCallback = function(plist) {
            if(plist !== null){
                window.resourceDirectory = plist["MHPResourceDirectoryURL"];
                window.appURLScheme = plist["CFBundleURLTypes"][0]["CFBundleURLSchemes"][0];
                window.launchpadURLScheme = plist["LaunchpadCustomUrlScheme"];
                // This is the event called when cordova is fully loaded.
                document.addEventListener("active", onAppActive, false);
            } else {
                alert("Failed to load plist");
            }
            routerInit();
        };
        plistLoader.loadPlist(plistLoaderCompletionCallback);
    };
    function onAppActive() {
        var token = window.sessionStorage['token'];
        if(typeof token !== 'undefined' && token !== 'undefined' && token !== null && token !== 'null') {
            window.location.reload();
        } else {
            nativeAuthLib.isAuthorized(
                function(isAuthorizedBoolean){
                    if(!isAuthorizedBoolean){
                        window.location.reload();
                    }
                }
            );
        }
    };
}