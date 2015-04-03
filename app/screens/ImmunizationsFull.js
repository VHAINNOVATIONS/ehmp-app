var dependencies = [
    "backbone",
    "marionette",
    "main/ADK",
    'app/applets/immunizations_add_edit/views/immunizationSearchView',
    'app/applets/immunizations_add_edit/views/enteredInErrorView'

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, ADK, SearchView, EieView ) {
    'use strict';

    var dataGridConfig = {
        id: 'immunizations-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'immunizations',
            title: 'Immunizations',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        onStart: function(){
            this.setUpEvents();
        },
        setUpEvents: function(){
            var immunizationChannel = ADK.Messaging.getChannel('immunization');
            immunizationChannel.comply('openImmunizationSearch', SearchView.handleMessage);
            immunizationChannel.comply('immunizationEiE:clicked', EieView.handleMessage);

        },
        patientRequired: true,
        globalDatepicker: false
    };

    return dataGridConfig;
}
