
'use strict';
var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "main/ADK",
    'moment',
    "hbs!main/components/footer/patientSyncStatusTemplate",
    "main/components/footer/views/syncModalView",
    "hbs!main/components/footer/views/syncModalTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, ADK, moment, PatientSyncStatusTemplate, SyncModalView, SyncModalTemplate) {
    return Backbone.Marionette.ItemView.extend({
        template: PatientSyncStatusTemplate,
        initialize: function() {
            this.model = new Backbone.Model();

            if (ADK.ADKApp.currentScreen.patientRequired === true) {
                this.fetchDataStatus();
            }
        },
        onRender: function() {
            this.$el.find('.patient-status-icon').tooltip({
                'delay': 500
            });
        },
        events: {
            'click #refresh-patient-data': 'refreshStatus',
            'keypress #refresh-patient-data': 'refreshStatus',
            'click #open-sync-modal': 'showSyncModal'
        },

        // New Modal Event that opens on the click of the calendar icon in the bottom right of the footer.
        // Calls a new JSON that determines the new model of all the items.
        // this model is CURRENTLY NOT DONE.
        // IT IS MOCKED ONLY.
        showSyncModal: function(event) {
            event.preventDefault(); //prevent the page from jumping back to the top

            var view = new SyncModalView();

            // According to Roph and the wireframes there should be no footer on this modal.
            // However according to Josh Bell we should use the ADK.modal.
            // This seems conflicting.
            // This template part was an attempt to pass in an empty footer.  Did not work.
            // Not sure what to do to remove the footer.  Maybe if we can get an ID on the whole modal window and use CSS to hide the footer??
            // template: _.template(""),

            var buttonView = Backbone.Marionette.ItemView.extend({
                template: _.template(""),
                events: {
                    'click #hideModal':'hideAllModals'
                },
                hideAllModals : function(){
                    ADK.hideModal();
                }
            });
            // This is the currently mocked sync data.
            // It's totally made up on my end.
            // 100% chance this will change.
/*            view.model.set('syncStatus', [
                {
                    'domains': [
                        {
                            'title': 'Active Medications',
                            'mySite': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            },
                            'allVa': {
                                'status': 'Problem Detected',
                                'lastSynced': '1d ago',
                                'problem': true
                            },
                            'dod': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            },
                            'communities': {
                                'status': 'New Data Available',
                                'lastSynced': '1d ago',
                                'newData': true
                            }
                        }, {
                            'title': 'Active Problems',
                            'mySite': {
                                'status': 'Sync in Progress',
                                'lastSynced': '1d ago',
                                'inProgress': true
                            },
                            'allVa': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            },
                            'dod': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            },
                            'communities': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            }
                        }, {
                            'title': 'Allergies',
                            'mySite': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            },
                            'allVa': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            },
                            'dod': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            },
                            'communities': {
                                'status': 'Up to Date',
                                'lastSynced': '1d ago',
                                'current': true
                            }
                        }
                    ]
                }
            ]);*/
            var modalOptions = {
                'title': 'Data Refresh Status by Domains',
                'size': "large"
            };
            ADK.showModal(view, modalOptions);
        },


        refreshStatus: function() {
            this.fetchDataStatus(true);
        },
        refreshPage: function() {
            ADK.ResourceService.clearAllCache();
            ADK.ADKApp.execute('screen:display', ADK.ADKApp.currentScreen.id);
        },
        fetchDataStatus: function(refresh) {
            if (!refresh) {
                refresh = false;
            }
            var oldStats = this.model.get('syncStatus');
            this.model.set('syncStatus', [{
                'title': 'My Site',
            }, {
                'title': 'All VA',
            }, {
                'title': 'External',
            }, {
                'title': 'DoD',
            }]);
            this.render();
            var fetchOptions = {
                resourceTitle: 'synchronization-datastatus',
                cache: false
            };
            var self = this;
            fetchOptions.onError = function(collection, resp) {
                var stats = [{
                    'title': 'My Site',
                    'completed': 'error'
                }, {
                    'title': 'All VA',
                    'completed': 'error'
                }, {
                    'title': 'External',
                    'completed': 'error'
                }, {
                    'title': 'DoD',
                    'completed': 'error'
                }];
                self.model.set('syncStatus', stats);
                self.render();
            };
            fetchOptions.onSuccess = function(collection, resp) {
                var currentSiteCode = ADK.SessionStorage.get.sessionModel('user').get('site');
                var statusObject = self.status.models[0].attributes;
                if (_.isUndefined(statusObject.DOD)) {
                    statusObject.DOD = true;
                }
                if (_.isUndefined(statusObject.CDS)) {
                    statusObject.CDS = true;
                }
                var stats = [{
                    'title': 'My Site',
                    'completed': statusObject.VISTA && statusObject.VISTA[currentSiteCode] || false,
                    'timeStamp': moment().format('MM/DD/YYYY HH:mm')
                }, {
                    'title': 'All VA',
                    'completed': statusObject.VISTA && _.every(_.values(statusObject.VISTA)) && statusObject.CDS || false,
                    'timeStamp': moment().format('MM/DD/YYYY HH:mm')
                }, {
                    'title': 'External',
                    'completed': _.every(_.values(_.omit(statusObject, 'VISTA', 'DOD', 'allSites', 'CDS'))),
                    'timeStamp': moment().format('MM/DD/YYYY HH:mm')
                }, {
                    'title': 'DoD',
                    'completed': statusObject.DOD,
                    'timeStamp': moment().format('MM/DD/YYYY HH:mm')
                }];
                if (refresh && (_.pluck(oldStats, 'completed').equals(_.pluck(stats, 'completed')) === false)) {
                    self.refreshPage();
                } else {
                    setTimeout(function() {
                        self.model.set('syncStatus', stats);
                        self.render();
                    }, 500);
                }
            };
            this.status = ADK.PatientRecordService.fetchCollection(fetchOptions);
        }
    });
};