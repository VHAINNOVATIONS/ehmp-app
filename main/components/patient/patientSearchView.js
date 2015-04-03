var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/patient/patientSearchResultTemplate",
    "hbs!main/components/patient/patientSearchTemplate",
    "main/ADK"
];

define(dependencies, onResolveDependencies);


function onResolveDependencies(Backbone, Marionette, _, PatientSearchResultTemplate, PatientSearchTemplate, ADK) {

    var PatientSearchResultView = Backbone.Marionette.ItemView.extend({
        tagName: "a",
        attributes: {
            "href": "javascript:void(0)"
        },
        className: "list-group-item row-layout",
        template: PatientSearchResultTemplate,
        events: {
            "click": "selectPatient"
        },

        selectPatient: function(e) {
            var patient = this.model;
            ADK.Messaging.trigger('patient:selected', patient);
            $("a.active").removeClass('active');
            $(event.currentTarget).addClass('active');
        }
    });

    var PatientSearchResultsView = Backbone.Marionette.CollectionView.extend({
        childView: PatientSearchResultView,
        tagName: "div",
        className: "list-group"
    });

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        template: PatientSearchTemplate,
        regions: {
            patientSearchResults: "#patient-search-results"
        },
        onRender: function() {
            this.loadSearchResults('');
        },
        events: {
            'keyup #patientSearchInput': 'search'
        },
        search: function() {
            if (patientSearchInput) {
                this.loadSearchResults(patientSearchInput.value);
            }
        },
        loadSearchResults: function(fullNameFilter) {
            var criteria = {
                "fullName": fullNameFilter,
                itemsPerPage: 20
            };

            var viewModel = {
                defaults: {
                    ageYears: 'Unk'
                },
                parse: function(response) {

                    //response.ageYears = ADK.utils.getAge(response.birthDate);

                    return response;
                }
            };
            var searchOptions = {};
            searchOptions.resourceTitle = 'patient-search-full-name';
            searchOptions.viewModel = viewModel;
            searchOptions.criteria = criteria;
            var patients = ADK.ResourceService.fetchCollection(searchOptions);

            var patientsView = new PatientSearchResultsView({
                collection: patients
            });
            this.patientSearchResults.show(patientsView);
        }
    });

    return AppletLayoutView;
}