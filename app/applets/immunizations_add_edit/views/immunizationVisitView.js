var dependencies = [
    "main/ADK",
    "hbs!app/applets/immunizations_add_edit/templates/immunizationVisitTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, immunizationVisitTemplate){
    return Backbone.Marionette.ItemView.extend({
        template: immunizationVisitTemplate,
        model: ADK.PatientRecordService.getCurrentPatient(),
        events: {
            'click #immunization-change-visit': 'changeVisit'
        },
        changeVisit: function(){
            ADK.Messaging.getChannel('visit').command('openVisitSelector', 'immunizations_search');
        }
    });
}