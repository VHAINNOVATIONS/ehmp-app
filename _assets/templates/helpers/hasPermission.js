define(['handlebars', 'main/ADK'], function(Handlebars, ADK) {
    function hasPermission(args, options) {
        'use strict';
        var authorized = false;
        var permission;
        var permissions = args.split('|');
        var i = 0;
        for (permission in permissions) {
            if (ADK.UserService.hasPermission(permissions[permission])) {
                authorized = true;
                break;
            }
        }

        if (authorized) {
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    }

    Handlebars.registerHelper('hasPermission', hasPermission);
    return hasPermission;
});

//Example:
//{{#hasPermission 'editRecord|addRecord'}}
//    test
//{{/hasPermission}}