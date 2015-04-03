'use strict';
var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'main/ADK',
    'moment',
    'hbs!main/components/footer/footerTemplate',
    'main/components/footer/patientSyncStatusView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, ADK, moment, footerTemplate, PatientSyncStatusView) {

    return {
        getView: function() {
            return Backbone.Marionette.LayoutView.extend({
                template: footerTemplate,
                initialize: function() {
                    this.model = new Backbone.Model();
                    this.model.set(ADK.Messaging.request('appManifest').attributes);
                    this.patientSyncStatusView = new PatientSyncStatusView();
                },
                onRender: function() {
                    this.patientSyncStatusRegion.show(this.patientSyncStatusView);
                },
                regions: {
                    patientSyncStatusRegion: '#patientSyncStatusRegion'
                },
                className: 'col-md-12 navbar-fixed-bottom'
            });
        }
    };
}