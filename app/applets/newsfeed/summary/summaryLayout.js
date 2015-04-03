var dependencies = [
    "main/ADK",
    "app/applets/newsfeed/newsfeedUtils",
    "app/applets/newsfeed/visitDetail/visitDetailView",
    "hbs!app/applets/newsfeed/summary/formatDateTemplate",
    "app/applets/newsfeed/summary/activityCell",
    "app/applets/newsfeed/collectionHandler",
    "app/applets/newsfeed/globalDateHandler",
    "app/applets/newsfeed/eventHandlers"

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, newsfeedUtils, VisitDetailView, formatDateTemplate, ActivityCell, CollectionHandler, GlobalDateHandler, EventHandlers) {

    var summaryColumns = [{
        name: 'activityDateTime',
        label: 'Date & Time',
        cell: 'handlebars',
        template: formatDateTemplate,
        groupable: true,
        groupableOptions: {
            primary: true,
            innerSort: "activityDateTime",
            groupByFunction: function(collectionElement) {
                return collectionElement.model.get("activityDateTime").substr(0, 6);
            },
            //this takes the item returned by the groupByFunction
            groupByRowFormatter: function(item) {
                return moment(item, "YYYYMM").format("MMMM YYYY");
            }
        }
    }, {
        name: 'activityDateTimeByIso',
        renderable: false,
        sortable: false
    }, {
        name: 'activityDateTimeByIsoWithSlashes',
        renderable: false,
        sortable: false
    }, {
        name: 'activity',
        label: 'Activity',
        cell: ActivityCell,
        sortable: false
    }, {
        name: 'summary',
        renderable: false,
        sortable: false
    }, {
        name: 'typeDisplayName',
        renderable: false,
        sortable: false
    }, {
        name: 'stopCodeName',
        renderable: false,
        sortable: false
    }, {
        name: 'locationDisplayName',
        renderable: false,
        sortable: false
    }, {
        name: 'displayType',
        label: 'Type',
        cell: 'string',
        groupable: true,
        groupableOptions: {
            innerSort: "activityDateTime"
        }
    }];

    var fullScreenColumns = summaryColumns.concat([{
        name: "primaryProviderDisplay",
        cell: "string",
        label: 'Entered By',
        groupable: true,
        groupableOptions: {
            innerSort: "activityDateTime"
        }
    }, {
        name: 'facilityName',
        label: 'Facility',
        groupable: true,
        groupableOptions: {
            innerSort: "activityDateTime"
        }
    }]);

    var DefaultDetailView = Backbone.Marionette.ItemView.extend({
        template: _.template('<div>A detail view for this domain is not yet implemented.</div>')
    });

    var detailAppletChannels = {
        // mapping of domain --> appletId
        "immunization": "immunizations",
        "surgery": "documents",
        "procedure": "documents",
        "consult": "documents",
        "lab": "lab_results_grid"
    };

    var SummaryAdkGrid = ADK.Applets.BaseGridApplet;

    var SummaryLayout = SummaryAdkGrid.extend({
        initialize: function() {
            this._super = SummaryAdkGrid.prototype;
            this.collection = CollectionHandler.queryCollection(this);

            this.listenTo(CollectionHandler, "refreshCollection", function(newCollection) {
                //console.log("NF--->>refreshCollection ");
                this.collection.reset(newCollection);
            }, this);

            //this.listenTo(CollectionHandler, "sendCollection",
            ADK.Messaging.getChannel("nf_internal").on("sendCollection", function(newCollection) {
                //console.log("NF--->>sendCollection --->> received");
                ADK.Messaging.getChannel("news_feed").trigger("nf_tl_data", {
                    msg: "ok",
                    data: newCollection.models,
                    fmode: false
                });
            }, this);

            this.listenTo(this.collection, "reset", function() {
                //console.log("NF--->>reset Backbone.Collection ");
                //var filterStatus = false;
                if ($("#grid-filter-newsfeed").hasClass("collapse in")) { //($("#grid-filter-newsfeed").find("input").val().length>0)
                    //filterStatus = true;
                    ADK.Messaging.getChannel("news_feed").trigger("nf_tl_data", {
                        msg: "ok",
                        data: this.collection.models,
                        fmode: true
                    });
                }
            });

            GlobalDateHandler.initialize(function(dateModel) {
                //console.log("globalDate:selected ---------->>> Handler function");
                this.loading();
                this.setAppletView();
                // TODO change this to better use Marionette
                if ($('#grid-panel-newsfeed').is(':visible')) {
                    CollectionHandler.queryCollection(this);
                }
            }, this);

            var dataGridOptions = {
                appletConfig: {
                    id: 'newsfeed',
                    instanceId: 'newsfeed-gdt'
                },
                filterEnabled: true, // removed for demo purposes due to it not working well with the timeline
                summaryColumns: summaryColumns,
                fullScreenColumns: fullScreenColumns,
                enableModal: true,
                collection: this.collection,
                groupable: true,
                //row click handler
                onClickRow: function(model, event) {
                    event.preventDefault();
                    //ugh, why is this needed?? Is it?? The detailed modals should grab this if need be
                    var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                    var channelObject = {
                        model: model,
                        uid: model.get("uid"),
                        patient: {
                            icn: currentPatient.attributes.icn,
                            pid: currentPatient.attributes.pid
                        }
                    };
                    if (newsfeedUtils.isVisit(model)) {
                        channelObject.channelName = "visitDetail";
                    }

                    var domain = channelObject.uid.split(":")[2],
                    channelName = detailAppletChannels[domain] || channelObject.channelName;

                    if (channelName) {
                        ADK.showModal(ADK.Views.Loading.create(), {
                            size: "large",
                            title: "Loading..."
                        });
                        var channel = ADK.Messaging.getChannel(channelName),
                            deferredResponse = channel.request('detailView', channelObject);

                        deferredResponse.done(function(response) {
                            ADK.showModal(response.view, {
                                size: "large",
                                title: response.title
                            });
                        });
                    } else {
                        ADK.showModal(new DefaultDetailView(), {
                            size: "large",
                            title: "Detail - Placeholder"
                        });
                    }
                }
            };

            this.dataGridOptions = dataGridOptions;
            this._super.initialize.apply(this, arguments);
        },
        removeGlobalDateListener: function() {
            GlobalDateHandler.destroyGlobalDateListener();
        },
        onRender: function() {
            this._super.onRender.apply(this, arguments);
        },
        onBeforeDestroy: function() {
            this.removeGlobalDateListener();
        }
    });

    return SummaryLayout;
}