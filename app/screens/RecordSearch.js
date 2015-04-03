var dependencies = [
    "backbone",
    "underscore",
    "marionette",
    "main/ADK",
    "handlebars"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, _, Marionette, ADK, Handlebars) {
    'use strict';

    // temporary default detail view. remove once all detail view have been implemented
    var DefaultDetailView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('<div>A detail view for this domain is not yet implemented.</div>')
    });
    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('<div>{{ error }}</div>')
    });

    var detailAppletChannels = {
        // mapping of domain --> appletId
        "med": "medication_review",
        "allergy": "allergy_grid",
        "immunization": "immunizations",
        "problem": "problems",
        "vital": "vitals",
        "lab": "lab_results_grid",
        "document": "documents",
        "order": "orders",
        "surgery": "documents",
        "procedure": "documents",
        "consult": "documents",
        "image": "documents"
    };

    function onResultClicked(clickedResult) {
        var domain = clickedResult.uid.split(":")[2],
            channelName = detailAppletChannels[domain];

        if (channelName) {
            // display spinner in modal while detail view is loading
            ADK.showModal(ADK.Views.Loading.create(), {
                size: "large",
                title: "Loading..."
            });

            // request detail view from whatever applet is listening for this domain
            var channel = ADK.Messaging.getChannel(channelName),
                deferredResponse = channel.request('detailView', clickedResult);

            deferredResponse.done(function(response) {
                var modalOptions = {
                    size: "large",
                    title: response.title
                };
                if (response.headerView) {
                    modalOptions.headerView = response.headerView;
                }
                if (response.footerView) {
                    modalOptions.footerView = response.footerView;
                }

                ADK.showModal(response.view, modalOptions);

            });
            deferredResponse.fail(function(response) {
                ADK.showModal(
                    new ErrorView({
                        model: new Backbone.Model({
                            error: response
                        })
                    }), {
                        size: "large",
                        title: "An Error Occurred"
                    }
                );
            });
        } else {
            // no detail view available; use the default placeholder view
            ADK.showModal(new DefaultDetailView(), {
                size: "large",
                title: "Detail - Placeholder"
            });
        }
    }

    var screenConfig = {
        id: 'record-search',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'search',
            title: 'Search',
            region: 'center'
        }, {
            id: 'medication_review',
            title: "Medication Review",
            region: 'none'
        }, {
            id: 'allergy_grid',
            title: "Allergies",
            region: 'none'
        }, {
            id: 'immunizations',
            title: "Immunizations",
            region: 'none'
        }, {
            id: 'problems',
            title: "Problems",
            region: 'none'
        }, {
            id: 'vitals',
            title: "Vitals",
            region: 'none'
        }, {
            id: 'lab_results_grid',
            title: "Lab Results",
            region: 'none'
        }, {
            id: 'documents',
            title: "Documents",
            region: 'none'
        }, {
            id: 'orders',
            title: "Orders",
            region: 'none'
        }],
        onStart: function() {
            ADK.SessionStorage.setAppletStorageModel('search', 'useTextSearchFilter', true);
            var searchAppletChannel = ADK.Messaging.getChannel("search");
            searchAppletChannel.on('resultClicked', onResultClicked);

        },
        onStop: function() {
            ADK.SessionStorage.setAppletStorageModel('search', 'useTextSearchFilter', false);
            var searchAppletChannel = ADK.Messaging.getChannel("search");
            searchAppletChannel.off('resultClicked', onResultClicked);
        },
        patientRequired: true,
        globalDatepicker: false
    };
    return screenConfig;
}
