var dependencies = [
    "backbone",
    "marionette",
    "main/ADK",
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, ADK) {
    'use strict';

    function onAddOrderClicked(event){
        var channel = ADK.Messaging.getChannel('addOrderRequestChannel');
        var deferredResponse = channel.request('addOrderModal');

        deferredResponse.done(function(response) {
            var addOrderApplet = response.view;
            addOrderApplet.showModal(event);
            $('#mainModal').modal('show');
        });
    }

    var screenConfig = {
        id: 'orders-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'orders',
            title: 'Orders',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        },{
            id: 'addOrder',
            title: 'Add New Order',
            region: 'none'
        }],
        patientRequired: true,
        globalDatepicker: false,
        onStart: function() {
            this.setUpEvents();
        },
        setUpEvents: function() {
            var addOrderChannel = ADK.Messaging.getChannel('addOrder');
            addOrderChannel.on('addOrder:clicked', onAddOrderClicked);
        },
        onStop: function() {
            this.turnOffEvents();
        },
        turnOffEvents: function() {
            var addOrderChannel = ADK.Messaging.getChannel('addOrder');
            addOrderChannel.off('addOrder:clicked');
        }
    };

    return screenConfig;
}
