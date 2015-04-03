var dependencies = [
    'app/screens/AllergyGridFull',
    'app/screens/VitalsFull',
    'app/screens/ImmunizationsFull',
     'app/screens/OrdersFull',
    "main/ADK"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(AllergyGridFull, VitalsFull, ImmunizationsFull, OrdersFull, ADK) {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
        "med": "medication_review",
        "document": "documents"
    };    

    var config = {
        id: 'cover-sheet',
        contentRegionLayout: 'gridThree',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
                id: 'vitals',
                title: 'Vitals',
                region: 'center',
                maximizeScreen: 'vitals-full'
            }, {
                id: 'activeMeds',
                title: 'Medications',
                region: 'center2',
                viewType: 'summary',
                maximizeScreen: 'medication-review'
            }, {
                id: 'problems',
                title: 'Conditions',
                region: 'left',
                maximizeScreen: 'problems-full'
            }, {
                id: 'lab_results_grid',
                title: 'Lab Results',
                region: 'center3',
                maximizeScreen: 'lab-results-grid-full'
            }, {
                id: 'appointments',
                title: 'Appointments & Visits',
                region: 'left2',
                maximizeScreen: 'appointments-full'
            }, {
                id: 'immunizations',
                title: 'Immunizations',
                region: 'left3',
                maximizeScreen: 'immunizations-full'
            },
            {
                id: 'allergy_grid',
                title: 'Allergies',
                region: 'right',
                maximizeScreen: 'allergy-grid-full',
                viewType: 'gist'
            }, {
                id: 'orders',
                title: 'Orders',
                region: 'right2',
                maximizeScreen: 'orders-full'
            },
            {
                id: 'ccd_grid',
                title: 'Community Health Summaries',
                region: 'right3',
                maximizeScreen: 'ccd-list-full'
            }

        ],
        onResultClicked: function(clickedResult) {

            var domain = clickedResult.uid.split(":")[2],
                channelName = detailAppletChannels[domain],
                modalView = null,
                deferredResponse = $.Deferred();

            if (channelName) {
                if (!clickedResult.suppressModal) {
                    // display spinner in modal while detail view is loading
                    ADK.showModal(ADK.Views.Loading.create(), {
                        size: "large",
                        title: "Loading..."
                    });
                }

                // request detail view from whatever applet is listening for this domain
                var channel = ADK.Messaging.getChannel(channelName),
                    deferredDetailResponse = channel.request('detailView', clickedResult);

                deferredDetailResponse.done(function(response) {
                    if (!clickedResult.suppressModal) {
                        ADK.showModal(response.view, {
                            size: "large",
                            title: response.title
                        });
                        deferredResponse.resolve();
                    } else {
                        deferredResponse.resolve({
                            view: response.view
                        });
                    }
                });
                deferredDetailResponse.fail(function(response) {
                    deferredResponse.reject(response);
                });
            } else {
                // no detail view available; use the default placeholder view
                var detailView = new DefaultDetailView();

                if (!clickedResult.suppressModal) {
                    ADK.showModal(detailView, {
                        size: "large",
                        title: "Detail - Placeholder"
                    });
                    deferredResponse.resolve();
                } else {
                    deferredResponse.resolve({
                        view: detailView
                    });
                }
            }

            return deferredResponse.promise();
        },
        onStart: function() {
            AllergyGridFull.setUpEvents();
            VitalsFull.setUpEvents();
            ImmunizationsFull.setUpEvents();
            OrdersFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('getDetailView', this.onResultClicked);
        },
        // afterStart: function() {
        //     ADK.Messaging.trigger('appletsCreated');
        // },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('getDetailView', this.onResultClicked);
            OrdersFull.turnOffEvents();
        },
        patientRequired: true
    };
    ADK.Messaging.getChannel("lab_results_grid").reply('extDetailView', config.onResultClicked);
    return config;
}
