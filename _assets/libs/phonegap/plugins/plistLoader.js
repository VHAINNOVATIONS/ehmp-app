// Plugin call to the native code to get the plist elements
var plistLoader = {
    loadPlist: function(completionCallback) {
      function successCallback(plist) {
           completionCallback(plist);
      };
      function failureCallback(failValue) {
          completionCallback(null);
        };   
      cordova.exec(successCallback, failureCallback, "PlistLoader", "loadPlist", []);
    }
}