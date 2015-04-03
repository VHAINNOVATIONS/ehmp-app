var dependencies = [
    "backbone",
    "underscore",
    "main/ADK",
    "app/applets/newsfeed/newsfeedUtils",
    "app/applets/newsfeed/eventHandlers"

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, _, ADK, newsfeedUtils, EventHandlers) {

    function filterCollection (collection, filterStartDate, filterEndDate) {
        //console.log("Filter Collection call--------->>");
        var filteredCollection = _.filter(collection.models, function (model) {
            model = model.toJSON();
            if(filterStartDate !== undefined && filterEndDate !== undefined)
                return EventHandlers.isValidDate(model) && EventHandlers.isDateBefore(filterStartDate, model) && EventHandlers.isDateAfter(filterEndDate, model);
            else
                return EventHandlers.isValidDate(model);
        }, this);
        return filteredCollection;
    }

    function refreshFilteredCollection(collection) {
        var filteredCollection =  filterCollection(collection);
        CollectionHandler.trigger("refreshCollection", filteredCollection);
    }
    function sendCollection(collection,resp){
        refreshFilteredCollection(collection);
        //console.log("NF -> fetch onSuccess------------>>>");
        ADK.Messaging.getChannel("nf_internal").trigger('sendCollection', collection);
    }

    var CollectionHandler = {
        queryCollection: function(context, dateModel) {

            var options = {};
            if (dateModel !== undefined) {
                options.isOverrideGlobalDate = true;
                options.fromDate = dateModel.from;
                options.toDate = dateModel.to;
            }

           // console.log("NF queryCollection call--------->>");
            var fetchOptions = {
                onSuccess: sendCollection,
                cache: false,
                criteria: {
                    filter: 'or('+context.buildJdsDateFilter('dateTime', options)+','+context.buildJdsDateFilter('administeredDateTime', options)+','+context.buildJdsDateFilter('observed', options)+')',
                    order: 'activityDateTime DESC'
                },
                resourceTitle : 'patient-record-timeline',
                viewModel :  {
                    parse: function(response) {
                        // response.activityDateTime = newsfeedUtils.getActivityDateTime(response);
                        response.primaryProviderDisplay = newsfeedUtils.getPrimaryProviderDisplay(response);
                        response.displayType = newsfeedUtils.getDisplayType(response);
                        //exists to assist with filtering
                        response.activityDateTimeByIso = moment(response.activityDateTime, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm");
                        response.activityDateTimeByIsoWithSlashes = moment(response.activityDateTime, "YYYYMMDDHHmmss").format("YYYY/MM/DD HH:mm");
                        return response;
                    }
                }
            };
            this.newsFeedItems = ADK.PatientRecordService.fetchCollection(fetchOptions, context.dataGridOptions!==undefined ? context.dataGridOptions.collection : undefined);
            //this.newsFeedItems.on("sync", refreshFilteredCollection, this);
            return this.newsFeedItems;
        }
    };

    _.extend(CollectionHandler, Backbone.Events);

    return CollectionHandler;
}
