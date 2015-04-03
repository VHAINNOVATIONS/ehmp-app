var dependencies = [
    "main/ADK",
    "app/applets/activeMeds/medicationCollectionHandler"
];

define(dependencies, onResolveDependencies);


function onResolveDependencies(ADK, CollectionHandler) {

    var summaryConfiguration = {
        fetchOptions: {
            resourceTitle: 'patient-record-med',
            cache: true,
            criteria: {
                filter: ''
            },
            pageable: false

        },
        summaryColumns: [{
            name: 'summary',
            label: 'Medication',
            cell: 'string',
            sortable: true
        }, {
            name: 'facilityMoniker',
            label: 'Facility',
            cell: 'string',
            sortable: true
        }]
    };

    var AppletLayoutView = ADK.Applets.BaseGridApplet.extend({
        initialize: function(options) {
            this._super = ADK.Applets.BaseGridApplet.prototype; 
            var self = this,
                patientType = ADK.PatientRecordService.getCurrentPatient().attributes.patientStatusClass,
                viewType = 'summary';

            if (options.appletConfig.viewType !== undefined) {
                viewType = options.appletConfig.viewType;
            }

            CollectionHandler.initCollections();
            var appletOptions = {
                filterEnabled: true, // removed for demo purposes due to it not working well with the timeline
                summaryColumns: summaryConfiguration.summaryColumns,
                appletConfiguration: summaryConfiguration,
                enableModal: true,
                onClickRow: function(model, event) {
                    var uid = model.get('uid'),
                        currentPatient = ADK.PatientRecordService.getCurrentPatient();
                    ADK.Messaging.getChannel("activeMeds").trigger('getDetailView', {
                        uid: uid,
                        patient: {
                            icn: currentPatient.attributes.icn,
                            pid: currentPatient.attributes.pid
                        }
                    });
                },
                collection: CollectionHandler.fetchMedsCollection(summaryConfiguration.fetchOptions, patientType, viewType)

            };


            this.dataGridOptions = appletOptions;
            this._super.initialize.apply(this, arguments);
        },
        onRender: function() {
            this._super.onRender.apply(this, arguments);
        }
    });

    return AppletLayoutView;
}