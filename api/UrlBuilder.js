var dependencies = [
    'ResourceDirectory'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ResourceDirectory) {
    'use strict';

    var resourceDirectory = ResourceDirectory.instance();

    var UrlBuilder = {
        buildUrl: function(resourceTitle, criteria) {
            var url;
            var queryParams = '';
            var resourceModel = resourceDirectory.get(resourceTitle);

            if (resourceModel !== undefined) {
                url = resourceModel.get("href");
            } else {
                console.log("No resource found in resource directory with title: " + resourceTitle);
            }

            if (criteria) {
                var encodedCriteria = [];
                _.each(criteria, function(v, k) {
                    encodedCriteria.push(encodeURIComponent(k).concat('=', encodeURIComponent(v)));
                });
                queryParams = '?' + encodedCriteria.join('&');
            }

            return url + queryParams;
        }
    };

    var amdModule = UrlBuilder;
    return amdModule;
}