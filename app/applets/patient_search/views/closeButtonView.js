var dependencies = [
    "backbone",
    "marionette",
    "main/ADK",
    "hbs!app/applets/patient_search/templates/closeButtonTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, ADK, CloseButtonTemplate) {

    var MySiteAllSearchInputView = Backbone.Marionette.ItemView.extend({
        template: CloseButtonTemplate,
        events: {
            'click #searchCloseBtn': 'closeSearchPage'
        },
        initialize: function(options) {
            this.model = new Backbone.Model();
            var currentPatient = ADK.PatientRecordService.getCurrentPatient();
            if(!$.isEmptyObject(currentPatient.attributes)){
                this.model.set('hasPatient','true');
            }
        },
        closeSearchPage: function(e){
            e.preventDefault();
            ADK.Navigation.navigate('cover-sheet');
        }
    });

    return MySiteAllSearchInputView;
}