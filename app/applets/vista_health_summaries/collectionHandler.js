var dependencies = [
    "backbone",
    "underscore",
    "main/ADK",
    'app/applets/vista_health_summaries/utils',
    "app/applets/documents/dateHandler"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, _, ADK, Utils, DateHandlers) {
    function processCollection(collection) {
        this.trigger("resetCollection", collection.models);
    }

    var CollectionHandler = {
        queryCollection: function(obj) {
            var fetchOptions = {
                cache: false,
                pageable: false,
                collectionConfig: {},
                resourceTitle: 'healthsummaries-getSitesInfoFromPatientData',
                viewModel: {
                    parse: function(response) {
                        response.facilityName = Utils.getFacilityName(response);
                        return response;
                    }
                }
            };

            this.docItems = ADK.PatientRecordService.fetchCollection(fetchOptions);
            this.docItems.on("sync", processCollection, this);
            return this.docItems;
        }
    };

    _.extend(CollectionHandler, Backbone.Events);

    return CollectionHandler;
}