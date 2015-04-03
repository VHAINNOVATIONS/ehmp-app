var dependencies = [
    "backbone",
    "marionette",
    "main/ADK",
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, ADK) {
    'use strict';

    var VISIT = 'visit',
        ENFORCE_VISIT_SELECTION = 'enforceVisitSelection',
        MEDREVIEW_CHANNEL = 'medicationChannel',
        defaultCallback = function(event, options) {
            return function(response) {
                response.view.showModal(event, options);
            };
        },
        defaultChannelConfig = function(command, callback) {
            return {
                'channel': MEDREVIEW_CHANNEL, //all commands will go through this channel
                'command': command, //the command is specific to the applet action we wish to initiate
                'callback': callback //this is what we want to do when the visit operation has finished
            };
        };

    function issueVisitRequest(appletKey, options) {
        ADK.Messaging.getChannel(VISIT)
            .command(ENFORCE_VISIT_SELECTION, appletKey, options);
    }

    function onAddNonVaMedClicked(event) {
        var options = defaultChannelConfig('addNonVaMedModal', defaultCallback(event));
        issueVisitRequest('add_nonVA_med', options);
    }

    function onDiscontinueNonVaMedClicked(event, model) { //Visit is not required
        var options = defaultChannelConfig('discontinueNonVaModal', defaultCallback(event, {
            'uid': model.attributes.uid,
            'model': model
        }));
        ADK.Messaging.getChannel(options.channel)
            .request(options.command)
            .done(options.callback);
    }

    function onEditNonVaMedClicked(event, model) {
        var callback = function(response) {
                var addNonVaMedApplet = response.view;
                addNonVaMedApplet.editMed(model);
            },
            options = defaultChannelConfig('addNonVaMedModal', callback);
        issueVisitRequest('add_nonVA_med', options);
    }

    function onAddMedicationOrderClicked(event) {
        var options = defaultChannelConfig('addOrderModal', defaultCallback(event));
        issueVisitRequest('addOrder', options);
    }

    var medicationReviewConfig = {
        id: "medication-review",
        contentRegionLayout: "gridOne",
        appletHeader: "navigation",
        appLeft: "patientInfo",
        applets: [{
            id: "medication_review",
            title: "MedicationReview",
            region: "center",
            viewType: 'expanded'
        }, {
            id: "add_nonVA_med",
            title: "Add Non-VA Med",
            region: "none"
        }, {
            id: "discontinueNonVaMed",
            title: "Discontinue Non-VA Med",
            region: "none"
        }],
        onStart: function() {
            this.setUpEvents();
        },
        setUpEvents: function() {
            var channel = ADK.Messaging.getChannel(MEDREVIEW_CHANNEL);
            channel.on('addNonVaMed:clicked', onAddNonVaMedClicked);
            channel.on('discontinueNonVaMed:clicked', onDiscontinueNonVaMedClicked);
            channel.on('editNonVaMed:clicked', onEditNonVaMedClicked);
            channel.on('addOrder:clicked', onAddMedicationOrderClicked);
        },
        patientRequired: true
    };

    return medicationReviewConfig;
}
