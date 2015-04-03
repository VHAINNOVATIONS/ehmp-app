//
// TODO: 
//  * appletid is not getting set somehow in dataGridOptions.
//      - believe detailcommunicator may set this up.
//  * expose detail through messaging
//  * not sure I need a list refresh channel handler

var dependencies = [
    "main/ADK",
    'underscore',
    "app/applets/vista_health_summaries/appConfig",
    'app/applets/vista_health_summaries/collectionHandler',
    'app/applets/vista_health_summaries/views/modalView',
    'hbs!app/applets/vista_health_summaries/templates/loadingTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, _, CONFIG, CollectionHandler, ModalView, LoadingTemplate) {
	'use strict';

    // Switch ON/OFF debug info
    var DEBUG = CONFIG.debug;

    //Data Grid Columns
    var fullScreenColumns = [
        {
            name: 'facilityName',
            label: 'Site',
            cell: 'string',
            editable: false,
            /*
            groupable: true,
            groupableOptions: {
                primary:true,
                innerSort: 'isPrimary',
                groupByFunction: function(collectionElement) {
                    return collectionElement.model.get("facilityName");
                },
                //this takes the item returned by the groupByFunction
                groupByRowFormatter: function(item) {
                    return item;
                }
            }
            */
        },
        {
            name: 'isPrimary',
            label: 'Primary',
            editable: false,
            sortable: true,
            cell: 'boolean',
            renderable: false
        },
        /*
        {
            name: 'hsReport',
            label: 'Report',
            editable: false,
            cell: 'string',
            groupable: true,
            groupableOptions: {
                innerSort: "isPrimary"
            }
        }
        */
    ];
    var summaryColumns = [fullScreenColumns[0], fullScreenColumns[1]];


    var _super;
    var GridApplet = ADK.Applets.BaseGridApplet;

    var AppletLayoutView = GridApplet.extend({
        initialize: function(options) {
            var self = this;

            _super = GridApplet.prototype;

            // data grid options
            var dataGridOptions = {};

            // There's an error for options where it's not picking up the appletId
            dataGridOptions.appletId = 'vista_health_summaries';
            dataGridOptions.appletConfig = options.appletConfig;
            dataGridOptions.filterEnabled = false;
            dataGridOptions.enableModal = true;
            dataGridOptions.summaryColumns = summaryColumns;
            dataGridOptions.fullScreenColumns = fullScreenColumns;
            dataGridOptions.columns = fullScreenColumns;
            dataGridOptions.collection = CollectionHandler.queryCollection(this);
            dataGridOptions.groupable = false; 
            
            /*
            dataGridOptions.onClickRow = function(model, event) {
                    event.preventDefault();
                    self.onClickRowHandler(model, event);
            };
            */

            // listen for collection reset
            this.listenTo(CollectionHandler, "resetCollection", function(newCollection) {
                this.dataGridOptions.collection.reset(newCollection);
            }, this);

            this.dataGridOptions = dataGridOptions;
            _super.initialize.apply(this, arguments);
        },
        onRender: function() {
            if (DEBUG) console.log("Health Summary : onRender");
            _super.onRender.apply(this, arguments);
        },
        onClickRowHandler: function(model, event) {
            var self = this;

            // fetch report
            var fetchOptions = {
                resourceTitle: "clinical-reminder-detail",
                criteria: {
                    dfn: self.localId,
                    reminderId: model.get('reminderId')
                }
            };

            var data = ADK.PatientRecordService.fetchCollection(fetchOptions);

            // show modal
            var modalOptions = {
                'title': 'Clinical Reminder - ' + model.get('title')
            };

            // fetch complete
            data.on('sync', function() {

                var detail = data.first().get('detail');
                model.set('detail', detail);
                var view = new ModalView({
                    model: model
                });
                ADK.showModal(view, modalOptions);
            });

            // loading view
            var LoadingView = Backbone.Marionette.ItemView.extend({
                template: LoadingTemplate
            });
            var loadingView = new LoadingView();
            ADK.showModal(loadingView, modalOptions);
        }
    });

    var applet = {
        id: "vista_health_summaries",
        hasCSS: true,
        /*
        getRootView: function(viewTypeOption) {
            return ADK.Views.AppletControllerView.extend({
                viewType: viewTypeOption
            });
        },
        */
        viewTypes: [{
                type: 'summary',
                view: AppletLayoutView.extend({
                    columnsViewType: "summary"
                }),
                chromeEnabled: true
            }
        ],
        defaultView: AppletLayoutView
    };

    return applet;
}
