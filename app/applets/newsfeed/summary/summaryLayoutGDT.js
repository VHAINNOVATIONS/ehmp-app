var dependencies = [
    "main/ADK",
    "app/applets/newsfeed/globalDateHandlerTimelineSummary",
    "app/applets/newsfeed/collectionHandler",
    "app/applets/newsfeed/summary/summaryLayout"

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, GlobalDateHandlerTS, CollectionHandler, SummaryLayout) {

    var SummaryLayoutGDT = SummaryLayout.extend({
        initialize: function() {
            this._super = SummaryLayout.prototype;
            this._super.initialize.apply(this, arguments);

            //TODO need to figure out how to turn this off for a single view instance
            //this.removeGlobalDateListener();

            GlobalDateHandlerTS.initialize(function(dateModel) {
                this.loading();
                this.setAppletView();
                // TODO best to handle this with Marionette and not jQuery if possible
                if ($('#timeline-summary').is(':visible')) {
                    CollectionHandler.queryCollection(this, dateModel);
                }
            }, this);

        // this.dataGridOptions.appletConfig.instanceId = 'newsfeed-gdt';

            this.model.set('title', 'Timeline Summary');
        },
        onBeforeDestroy: function() {
            this._super = SummaryLayout.prototype;
            this._super.onBeforeDestroy.apply(this, arguments);
            GlobalDateHandlerTS.destroyGlobalDateListener();
        }
    });

    return SummaryLayoutGDT;
}