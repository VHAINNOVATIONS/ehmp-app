var dependencies = [
    "backbone",
    "underscore",
    "main/ADK",
    "app/applets/documents/appletHelper",
    "app/applets/documents/dateHandler"

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, _, ADK, AppletHelper, DateHandlers) {
    function filterCollection(collection, that) {
        var filteredCollection = _.filter(collection.models, function(model) {
            model = model.toJSON();
            //var validItem = isValidItem(model);
            var startDate = that.startDate,
                endDate = that.endDate;

            // if global Date Picker selected All -> reset applet filter
            if ((startDate === undefined) && (endDate !== undefined)) endDate = undefined;
            return DateHandlers.isDateBefore(startDate, model) && DateHandlers.isDateAfter(endDate, model) && !isReallyAnOrder(model) && isAReport(model); //&&validItem

        }, this);

        return filteredCollection;
    }

    function isReallyAnOrder(model) {
        if ((model.kind === "Consult" || model.kind === "Imaging" || model.kind === "Procedure") && model.statusName !== "COMPLETE") {
            return true;
        } else
            return false;
    }

    function isAReport(model) {
        if ((model.kind === "Consult" || model.kind === "Imaging" || model.kind === "Procedure" || model.kind === "Radiology" || model.kind === "Laboratory Report" || model.kind === "Laboratory Result")) {
            return true;
        } else
            return false;
    }

    function processCollection(collection) {
        //this should get stripped out when server sorting works. To do that
        //we need a common date field across every record (referenceDateTime is created after the data is loaded
        //into the applet.
        collection.comparator = function(left, right) {
            var l = left.get('referenceDateTime'),
                r = right.get('referenceDateTime');
            if (l === r) {
                return 0;
            } else if (l < r) return 1;
            else return -1;
        };

        var filteredCollection = filterCollection(collection, this);
        this.trigger("resetCollection", filteredCollection);
    }

    var CollectionHandler = {
        queryCollection: function(obj) {
            var fetchOptions = {
                cache: true,
                pageable: false,
                collectionConfig: {},
                resourceTitle: 'patient-record-document-view',
                viewModel: {
                    parse: function(response) {
                        return AppletHelper.parseDocResponse(response);
                    }
                },
                criteria: {
                    filter: 'or(' + obj.buildJdsDateFilter('referenceDateTime') + ',' + obj.buildJdsDateFilter('dateTime') + ')'
                }
            };

            this.docItems = ADK.PatientRecordService.fetchCollection(fetchOptions);
            this.docItems.on("sync", processCollection, this);
            return this.docItems;
            //}
        }
    };

    _.extend(CollectionHandler, Backbone.Events);

    return CollectionHandler;
}