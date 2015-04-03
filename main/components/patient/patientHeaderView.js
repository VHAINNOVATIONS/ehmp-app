var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "main/ADK",
    "main/components/patient/cwad/cwadDeatilsView",
    "hbs!main/components/patient/patientHeaderTemplate",
    "api/CCOWService",
    "main/components/patient/smokingStatus/smokingStatusView",
    "api/UrlBuilder"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, ADK, cwadDetailsView, PatientHeaderTemplate, CCOWService, smokingStatusView, UrlBuilder) {

    var visitChannel = ADK.Messaging.getChannel('visit');

    var PatientHeaderView = Backbone.Marionette.LayoutView.extend({
        template: PatientHeaderTemplate,
        regions: {
            cwadDetails: '#cwad-details'
        },
        initialize: function() {
            if ("ActiveXObject" in window) {
                this.model.set('useCcow', 'yes');
                this.updateCcowStatus(CCOWService.getCcowStatus());
                ADK.Messaging.on('ccow:updatedStatus', this.updateCcowStatus, this);
            }

            if (this.model.get('cwadf')) {
                var cwadf = this.model.get('cwadf');

                if (cwadf.indexOf('C') >= 0) {
                    this.model.set('crisisNotes', true);
                }
                if (cwadf.indexOf('W') >= 0) {
                    this.model.set('flags', true);
                }
                if (cwadf.indexOf('A') >= 0) {
                    this.model.set('allergies', true);
                }
                if (cwadf.indexOf('D') >= 0) {
                    this.model.set('directives', true);
                }
            }

            if (this.model.get('patientRecordFlag')) {
                this.model.set('patientflags', true);
            }

            var smokingStatusChannel = ADK.Messaging.getChannel('smokingstatus');
            smokingStatusChannel.comply('smokingstatus:change', smokingStatusView.handleStatusChange);
            smokingStatusChannel.comply('smokingstatus:updated', this.updateSmokingStatus, this);
        },
        onRender: function() { 
            var patientImage = UrlBuilder.buildUrl('patientphoto-getPatientPhoto', {
                pid: this.model.attributes.pid
            });
             this.model.set({
                patientImage: patientImage
            });
            this.$el.find('.cwadfToolTip').tooltip({
                delay: {
                    "show": 300,
                    "hide": 0
                }
            });
        },
        modelEvents: {
            "change": "render"
        },
        events: {
            'click .cwadLabel': 'showCwadDetails',
            'keypress .cwadLabel': 'showCwadDetails',
            //'keypress [data-toggle="dropdown"]': 'showPatientInfoDropdown',
            'click #leaveContext': 'leaveContext',
            'click #joinContext': 'joinContext',
            'click #setVisitContextBtn': 'setVisitContext',
            'click #addAllergy': 'launchAddAllergy',
            'click #addActiveProblem': 'launchAddProblem',
            'click #addVitals': 'launchAddVitals'
        },
        createCwadDetailView: function(cwadIdentifier) {
            return new cwadDetailsView({
                'cwadIdentifier': cwadIdentifier,
                'patientModel': this.model
            });
        },
        showPatientInfoDropdown: function(event) {
            if (event.type === 'keypress' && (event.which === 13 || event.which === 27)) {
                $(event.currentTarget).parent().find('.dropdown-menu').dropdown('toggle');
            }
        },
        hidePatientInfoDropdown: function() {
            if (this.$el.find('.open').length >= 0) {
                this.$el.find('.open .dropdown-menu').dropdown('toggle');
            }
        },
        showCwadDetails: function(event) {
            var cwadLabel = $(event.target);
            var cwadContainer = this.$el.find('#cwad-details');
            if ((event.type === 'click') || ((event.type === 'keypress') && (event.which === 13 || event.which === 27))) {
                if (cwadLabel.attr('data-cwadidentifier') !== 'disabled') {
                    if (cwadContainer.attr('data-current-cwad') === cwadLabel.attr('data-cwadidentifier')) {
                        cwadContainer.toggleClass('hidden');
                        if (cwadContainer.hasClass('hidden')) {
                            $("body").off("mousedown");
                        } else {
                            $('body').on('mousedown', function() {
                                $('#cwad-details').addClass('hidden');
                                $("body").off("mousedown");
                            });
                        }
                        this.hidePatientInfoDropdown();
                    } else {
                        if (cwadContainer.hasClass('hidden')) {
                            cwadContainer.removeClass('hidden');
                        }
                        cwadContainer.attr('data-current-cwad', cwadLabel.attr('data-cwadidentifier'));
                        switch ($(event.target).attr('data-cwadidentifier')) {
                            case 'C':
                                this.cwadDetails.show(this.createCwadDetailView('crisis notes'));
                                break;
                            case 'W':
                                this.cwadDetails.show(this.createCwadDetailView('warnings'));
                                break;
                            case 'A':
                                this.cwadDetails.show(this.createCwadDetailView('allergies'));
                                break;
                            case 'D':
                                this.cwadDetails.show(this.createCwadDetailView('directives'));
                                break;
                            case 'F':
                                this.cwadDetails.show(this.createCwadDetailView('patient flags'));
                                break;
                        }
                        $('body').on('mousedown', function() {
                            if (!($('#cwad-details').hasClass('hidden'))) {
                                $('#cwad-details').addClass('hidden');
                                $("body").off("mousedown");
                            }
                        });
                        this.$el.find(".cwadLabel").on('mousedown', function(evt) {
                            evt.stopPropagation();
                        });
                        cwadContainer.on('mousedown', function(evt) {
                            evt.stopPropagation();
                        });
                        $('body').on('keyup', function(evt) {
                            if (evt.which === 13 || evt.which === 27) {
                                if (!($('#cwad-details').hasClass('hidden'))) {
                                    $('#cwad-details').addClass('hidden');
                                    $("body").off("mousedown");
                                }
                            }
                        });
                        this.$el.find(".cwadLabel").on('keyup', function(evt) {
                            if (evt.which === 13 || evt.which === 27) {
                                evt.stopPropagation();
                            }
                        });
                        cwadContainer.on('keyup', function(evt) {
                            if (evt.which === 13 || evt.which === 27) {
                                evt.stopPropagation();
                            }
                        });
                        this.hidePatientInfoDropdown();
                    }
                }
            }
        },
        updateCcowStatus: function(status) {
            // This will trigger an update of the model
            if (status === 'Connected') {
                this.model.set('ccowConnected', 'yes');
            } else {
                this.model.set('ccowConnected', '');
            }

            this.model.set('ccowStatus', status);
        },
        updateSmokingStatus: function(status){
            this.model.set('smokingStatus', status);
        },
        leaveContext: function() {
            CCOWService.suspendContext(function() {
                console.log('successfully left context');
            });
        },
        joinContext: function() {
            CCOWService.resumeContext(function() {
                CCOWService.handleContextChange();
            });
        },
        setVisitContext: function() {
            visitChannel.command('openVisitSelector', 'patientheader');
        },
        launchAddAllergy: function(event) {
            event.preventDefault();
            var addAllergyChannel = ADK.Messaging.getChannel("addAllergy");
            addAllergyChannel.trigger('addAllergy:clicked', event);
        },
        launchAddProblem: function(event) {
            event.preventDefault();
            var problemChannel = ADK.Messaging.getChannel('problem-add-edit');
            problemChannel.command('openProblemSearch', 'problem_search');
            $('#mainModal').modal('show');
        },
        launchAddVitals: function(event) {
            event.preventDefault();
            var addVitalsChannel = ADK.Messaging.getChannel("addVitals");
            addVitalsChannel.trigger('addVitals:clicked', event);
        }

    });

    return PatientHeaderView;
}
