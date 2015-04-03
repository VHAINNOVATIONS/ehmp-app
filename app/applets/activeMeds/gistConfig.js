var dependencies = [
    "main/ADK",
    "backbone",
    "app/applets/activeMeds/medicationCollectionHandler"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, CollectionHandler) {

    var gistConfiguration = {
        fetchOptions: {
            resourceTitle: 'patient-record-med',
            cache: true,
            viewModel: {
                parse: function(response) {
                    var ageData = ADK.utils.getTimeSince(response.lastAction);
                    response.age = response.lastAction;
                    response.ageDescription = ageData.timeSinceDescription;
                    return response;
                }
            },
            pageable: false,
            criteria: {
                filter: ''
            }
        },
        transformCollection: function(collection) {
            var medGroupModel = Backbone.Model.extend({});
            var allMedGroups = new Backbone.Collection();
            var groups = collection.groupBy(function(med) {
                return CollectionHandler.getActiveMedicationGroupbyData(med).groupbyValue;
            });
            var medicationGroups = _.map(groups, function(medications, groupName) {
                return new medGroupModel({
                    groupName: groupName,
                    normalizedName: medications[0].get('normalizedName'),
                    meds: medications,
                    sig: medications[0].get('sig'),
                    facilityDisplay: medications[0].get('facilityName'),
                    uid: medications[0].get('uid'),
                    lastAction: medications[0].get('lastAction'),
                    age: medications[0].get('age'),
                    ageReadText: medications[0].get('ageDescription'),
                    calculatedStatus: medications[0].get('calculatedStatus'),
                    orders: medications[0].get('orders')
                });
            });
            _.each(medicationGroups, function(model) {
                CollectionHandler.afterGroupingParse(model.attributes);

            });
            allMedGroups.reset(medicationGroups);

            return allMedGroups;
        },
        gistHeaders: {
            name: {
                title: 'Medication',
                sortable: true,
                sortType: 'alphabetical'
            },
            description: {
                title: '',
                sortable: false
            },
            graphic: {
                title: 'Change',
                sortable: true,
                sortType: 'alphabetical'
            },
            age: {
                title: 'Last \u0394',
                sortable: true,
                sortType: 'date'
            },
            count: {
                title: 'Refills',
                sortable: true,
                sortType: 'numerical'
            }
        },
        gistModel: [{
            id: 'id',
            field: 'groupName'
        }, {
            id: 'name',
            field: 'normalizedName'
        }, {
            id: 'description',
            field: 'sig'
        }, {
            id: 'age',
            field: 'age'
        }, {
            id: 'ageReadText',
            field: 'ageReadText'
        }, {
            id: 'graphic',
            field: 'doseChange'
        }, {
            id: 'count',
            field: 'totalFillsRemaining'
        }],
        filterFields: ['normalizedName', 'age', 'totalFillsRemaining']
    };
    return gistConfiguration;
}
