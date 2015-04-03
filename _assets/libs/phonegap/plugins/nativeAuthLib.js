var nativeAuthLib = {
    // Boolean to check if authorization process started
    isRequestingAuthCode: false,
    startAuthorizeProcess: function() {
        if(!nativeAuthLib.isRequestingAuthCode){
            nativeAuthLib.isRequestingAuthCode = true;
            var authSuccessCallback = function(token) {
                paramTokenString = "?token=";
                window.location = "index.html" + paramTokenString + token;
            }
            var authFailureCallback = function(errorMesssage) {
                alert(errorMessage);
            }
            cordova.exec(authSuccessCallback, authFailureCallback, "AuthLibPlugin", "startAuthorizeProcess", []);
        }
    },
    startDeauthorizeProcess: function(redirectURI) {
        sessionStorage.clear();
        cordova.exec(null, null, "nativeAuthLibPlugin", "startDeauthorizeProcess", [redirectURI]);
        window.location = "index.html";
    },
    isTokenAvailable: function(callbackFunction){
        cordova.exec(callbackFunction, callbackFunction, "AuthLibPlugin", "isTokenAvailable", []);
    },
    isAuthorized: function(callbackFunction){
        cordova.exec(callbackFunction, callbackFunction, "AuthLibPlugin", "isAuthorized", []);
    },
    isAuthenticated: function(callbackFunction){
        cordova.exec(callbackFunction, callbackFunction, "AuthLibPlugin", "isAuthenticated", []);
    },
    resetNativeSessionStorage: function(callbackFunction){
        cordova.exec(callbackFunction, callbackFunction, "AuthLibPlugin", "resetNativeSessionStorage", []);
    },
    accessDeniedErrorReceived: function(){
        nativeAuthLib.isAuthenticated(
            function(isAuthenticatedBool){
                if(isAuthenticatedBool){
                    nativeAuthLib.resetNativeSessionStorage(
                        function(resetCalled){
                            nativeAuthLib.startAuthorizeProcess();
                        }
                    );
                } else {
                    nativeAuthLib.startAuthorizeProcess();
                }
            }
        );
    }
}