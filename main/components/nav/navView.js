'use strict';
var dependencies = [
    'backbone',
    'marionette',
    'underscore',
    'hbs!main/components/nav/navTemplate',
    'main/ADK',
    'main/Session'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, navTemplate, ADK, Session) {
    return Backbone.Marionette.ItemView.extend({
        model: ADK.UserService.getUserSession(),
        template: navTemplate,
        className: 'col-md-12 appNav',
        events: {
            'click #logoutButton': 'logout',
            'click #patientSearchButton': 'patientSearch'
        },
        modelEvents: {
            "change": "render"
        },
        initialize: function() {
            this.updatePatientName();
            this.listenTo(Session.patient, 'change:fullName', this.updatePatientName);
        },
        logout: function() {
            ADK.Messaging.trigger('app:logout');
        },
        patientSearch: function(e) {
            e.preventDefault();
            ADK.Navigation.navigate('patient-search-screen');
        },
        updatePatientName: function() {
            this.model.set({
                'patientName': ADK.PatientRecordService.getCurrentPatient().get('fullName')
            });
        }
    });
};