var dependencies = [
    'underscore',
    'main/ADK',
    'hbs!app/applets/vitalsObservationList/templates/vitalsObservationListFooterTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(_, ADK, vitalsObservationListFooterTemplate) {

    var vitalsObservationListFooterView = Backbone.Marionette.ItemView.extend({
        'template': vitalsObservationListFooterTemplate
    });

    return vitalsObservationListFooterView;
}