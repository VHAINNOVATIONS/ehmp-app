var dependencies = [
    "moment",
    "backbone",
    "main/ADK",
    "app/applets/encounters/appConfig"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Moment, Backbone, ADK, CONFIG) {
    'use strict';

    var gistConfiguration = {
        gistHeaders: {
            visits: {
                name: {
                    title: 'Visit Type',
                    sortable: true,
                    sortType: 'alphabetical',
                    key: 'groupName'
                },
                itemsInGraphCount: {
                    title: 'Hx Occurrence',
                    sortable: true,
                    sortType: 'numeric',
                    key: 'encounterCount'
                },
                age: {
                    title: 'Last',
                    sortable: true,
                    sortType: 'date',
                    key: 'sort_time'
                }
            },
            procedures: {
                name: {
                    title: 'CLN/WARD',
                    sortable: true,
                    sortType: 'alphabetical',
                    key: 'groupName'
                },
                itemsInGraphCount: {
                    title: 'Hx Occurrence',
                    sortable: true,
                    sortType: 'numeric',
                    key: 'encounterCount'
                },
                age: {
                    title: 'Last',
                    sortable: true,
                    sortType: 'date',
                    key: 'sort_time'
                }
            },
            appointments: {
                name: {
                    title: 'Type',
                    sortable: true,
                    sortType: 'alphabetical',
                    key: 'groupName'
                },
                itemsInGraphCount: {
                    title: 'Hx Occurrence',
                    sortable: true,
                    sortType: 'numeric',
                    key: 'encounterCount'
                },
                age: {
                    title: 'Next',
                    sortable: true,
                    sortType: 'date',
                    key: 'sort_time'
                }
            },
            admissions: {
                name: {
                    title: 'Location - CLN/WARD',
                    sortable: true,
                    sortType: 'alphabetical',
                    key: 'groupName'
                },
                itemsInGraphCount: {
                    title: 'Hx Occurrence',
                    sortable: true,
                    sortType: 'numeric',
                    key: 'encounterCount'
                },
                age: {
                    title: 'Last',
                    sortable: true,
                    sortType: 'date',
                    key: 'sort_time'
                }
            }
        },
        gistModel: [{
            id: 'groupName',
            field: 'subKind'
        }, {
            id: 'encounterCount',
            field: 'count'
        }, {
            id: 'timeSince', //'age',
            field: 'time'
        }, ],
        filterFields: ['groupName', 'problemText', 'acuityName'],
        defaultView: 'encounters'
    };
    return gistConfiguration;
}