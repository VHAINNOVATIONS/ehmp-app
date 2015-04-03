var dependencies = [
    'app/screens/AllergyGridFull',
    'app/screens/VitalsFull',
    "main/ADK"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(AllergyGridFull, VitalsFull, ADK) {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
        "immunization": "immunizations",
        "med": "medication_review"
    };
    var config = {
        id: 'overview',
        contentRegionLayout: 'gridThree',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',

        applets: [{
            id: 'immunizations',
            title: 'Immunizations',
            region: 'left3',
            maximizeScreen: 'immunizations-full',
            viewType: 'gist'
        }, {
            id: 'encounters',
            title: 'Encounters',
            region: 'center',
            viewType: 'gist',
            maximizeScreen: 'news-feed',
        }, {
            id: 'cds_advice',
            title: 'Clinical Reminders',
            region: 'left',
            maximizeScreen: 'cds-advice-full'
        }, {
            id: 'allergy_grid',
            title: 'Allergies',
            region: 'center3',
            maximizeScreen: 'allergy-grid-full',
            viewType: 'gist'
        }, {
            id: 'activeMeds',
            title: 'Medications',
            region: 'center2',
            maximizeScreen: 'medication-review',
            viewType: 'gist'
        }, {
            id: 'reports',
            title: 'Reports',
            region: 'right',
            maximizeScreen: 'reports-full'
        }, {
            id: 'problems',
            title: 'Conditions',
            region: 'left2',
            maximizeScreen: 'problems-full',
            viewType: 'gist'
        }, {
            id: 'vitals',
            title: 'Vitals',
            region: 'right2',
            maximizeScreen: 'vitals-full',
            viewType: 'gist'
        }, {
            id: 'lab_results_grid',
            title: 'Lab Results',
            region: 'right3',
            maximizeScreen: 'lab-results-grid-full',
            viewType: 'gist'
        }],
        onResultClicked: function (clickedResult) {
            var domain = clickedResult.uid.split(":")[2],
                channelName = detailAppletChannels[domain];

            if (channelName) {
                // display spinner in modal while detail view is loading
                ADK.showModal(ADK.Views.Loading.create(), {
                    size: "large",
                    title: "Loading..."
                });

                // request detail view from whatever applet is listening for this domain
                var channel = ADK.Messaging.getChannel(channelName);
                var deferredResponse = channel.request('detailView', clickedResult);

                deferredResponse.done(function (response) {
                    ADK.showModal(response.view, {
                        size: "large",
                        title: response.title
                    });
                });
            } else {
                // no detail view available; use the default placeholder view
                ADK.showModal(new DefaultDetailView(), {
                    size: "large",
                    title: "Detail - Placeholder"
                });
            }
            $('#mainModal').modal('show');
        },
        onStart: function () {
            AllergyGridFull.setUpEvents();
            VitalsFull.setUpEvents();

            var immunizationsAppletChannel = ADK.Messaging.getChannel("igv_applet"); //igv_applet
            immunizationsAppletChannel.on('getDetailView', this.onResultClicked);

            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('getDetailView', this.onResultClicked);

            // var problemsAppletChannel = ADK.Messaging.getChannel("problems");
            // problemsAppletChannel.on('problemGistDetailView', this.onResultClicked);

        },
        onStop: function () {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('getDetailView', this.onResultClicked);
        },
        patientRequired: true
    };

    return config;
}
