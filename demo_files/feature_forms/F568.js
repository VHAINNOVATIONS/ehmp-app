define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
], function(Backbone, Marionette, $, Handlebars) {

    //=============================================================================================================
    // PLEASE DO NOT COPY AND PASTE THIS FULL FILE. PLEASE JUST USE AS A REFERENCE AND COPY PARTS THAT ARE NEEDED
    // for more information on how to layout this form for your applet please checkout the following link:
    // http://10.1.1.150/documentation/#/adk/conventions#Writeback
    //=============================================================================================================

    var F568 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        createForm: function() {
            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var OutpatientMedsChecklist = {
                control: 'toggleOptionsChecklist',
                name: 'outpatientMedsChecklist',
                label: 'Please indicate if the order is related to the following treatment factors.<br />All Orders Except Controlled Substance Orders.',
                columnHeaders: [{
                    id: 'SC',
                    label: 'SC',
                    title: 'Service Connected'
                }, {
                    id: 'CV',
                    label: 'CV',
                    title: 'CV'
                }, {
                    id: 'AO',
                    label: 'AO',
                    title: 'Agent Orange Exposure'
                }, {
                    id: 'IR',
                    label: 'IR',
                    title: 'Ionizing Radiation Exposure'
                }, {
                    id: 'SWAC',
                    label: 'SWAC',
                    title: 'Southwest Asia Conditions'
                }, {
                    id: 'SHD',
                    label: 'SHD',
                    title: 'Shipboard Hazard and Defense'
                }, {
                    id: 'MST',
                    label: 'MST',
                    title: 'Military Sexual Truama'
                }, {
                    id: 'HNC',
                    label: 'HNC',
                    title: 'Hippopotomal Nordic Conditions'
                }],
                selectedCountName: 'outpatientMedsChecklistCount'
            };

            var NotesChecklist = {
                control: "checklist",
                label: "Notes",
                name: "notesChecklist",
                extraClasses: ["bordered-checklist"],
                selectedCountName: 'notesChecklistCount',
                hideCheckboxForSingleItem: true,
                itemTemplate: "<strong>{{label}}</strong>{{#if date}} - <span class='date-taken'>{{date}}</span>{{/if}}{{#if time}}<span class='time-taken'> {{time}}</span>{{/if}}"
            };

            var LabsChecklist = {
                control: "checklist",
                label: "Labs",
                name: "labsChecklist",
                extraClasses: ["bordered-checklist"],
                selectedCountName: 'labsChecklistCount',
                hideCheckboxForSingleItem: true,
                itemTemplate: "<strong>{{label}}{{#if labNumber}} #<span class='lab-number'>{{labNumber}}</span>{{/if}}</strong>"
            };

            var ConnectionAndDisabilitiesInfo = {
                control: "container",
                extraClasses: ["col-xs-12"],
                modelListeners: ["connectionPercent", "ratedDisabilities"],
                template: Handlebars.compile('<h6>Service Connection & Rated Disabilities</h6><p>Service Connected: {{connectionPercent}}%</p><p>Rated Disabilities: {{ratedDisabilities}}</p>'),
            };

            var TotalSelected = {
                control: "container",
                extraClasses: ["pull-left"],
                modelListeners: ["outpatientMedsChecklistCount", "notesChecklistCount", "labsChecklistCount"],
                template: Handlebars.compile("<span>Total Selected: {{getSum outpatientMedsChecklistCount notesChecklistCount labsChecklistCount}}</span>")
            };

            var F568Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluids"],
                    items: [{
                        control: "container",
                        extraClasses: ["container-fluid"],
                        items: [{
                            control: "container",
                            extraClasses: ["row"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                template: Handlebars.compile('<h5 class="section-title first">Outpatient Meds</h5>'),
                                items: [OutpatientMedsChecklist]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["row"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "spacer"
                                }, NotesChecklist, {
                                    control: "spacer"
                                }, LabsChecklist]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["row"],
                            items: [{
                                control: "spacer"
                            }, ConnectionAndDisabilitiesInfo, {
                                control: "spacer"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["row"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-6"],
                                items: [{
                                    control: "input",
                                    label: "Enter Electronic Signature Code",
                                    name: "esignCode",
                                    required: true,
                                    title: "Please enter your Electronic Signature Code",
                                    type: "password"
                                }]
                            }]
                        }]
                    }]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [TotalSelected]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "button",
                            extraClasses: ["btn-default", "btn-sm"],
                            label: "Cancel",
                            name: "cancel",
                            title: "Press enter to cancel.",
                            type: "button"
                        }, {
                            control: "button",
                            //disabled: "true",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Sign",
                            name: 'sign',
                            title: "Press enter to sign note"
                        }]
                    }]
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                defaults: {
                    name: "",
                    esigToggleOptionsChecklist: "",
                    esignCode: "",
                    connectionPercent: "10",
                    ratedDisabilities: "None Stated",
                    outpatientMedsChecklist: new Backbone.Collection([{
                        id: 'row01',
                        label: 'Sodium Chloride Tab 1gm Take two tablets by mouth 5XD Quantity: 300  Refill: 0',
                        value: true,
                        columnCollection: [{
                            name: 'SC',
                            value: null
                        }, {
                            name: 'CV',
                            value: null
                        }, {
                            name: 'AO',
                            value: null
                        }, {
                            name: 'IR',
                            value: null
                        }, {
                            name: 'SWAC',
                            value: null
                        }, {
                            name: 'SHD',
                            value: null
                        }, {
                            name: 'MST',
                            value: null
                        }, {
                            name: 'HNC',
                            value: null
                        }],
                    }, {
                        id: 'row02',
                        label: 'Heparin Sodium 100U/ML, Solution, Injection for Blood Thinning Refill: 0',
                        value: false,
                        columnCollection: [{
                            name: 'SC',
                            value: null
                        }, {
                            name: 'CV',
                            value: null
                        }, {
                            name: 'AO',
                            value: null
                        }, {
                            name: 'IR',
                            value: null
                        }, {
                            name: 'SWAC',
                            value: null
                        }, {
                            name: 'SHD',
                            value: null
                        }, {
                            name: 'MST',
                            value: null
                        }, {
                            name: 'HNC',
                            value: null
                        }],
                    }, {
                        id: 'row03',
                        label: 'Hydralazine Hydrochloride 20mg/ML, Solution, Injection Refill: 0',
                        value: undefined,
                        columnCollection: [{
                            name: 'SC',
                            value: null
                        }, {
                            name: 'CV',
                            value: null
                        }, {
                            name: 'AO',
                            value: null
                        }, {
                            name: 'IR',
                            value: null
                        }, {
                            name: 'SWAC',
                            value: null
                        }, {
                            name: 'SHD',
                            value: null
                        }, {
                            name: 'MST',
                            value: null
                        }, {
                            name: 'HNC',
                            value: null
                        }],
                    }]),
                    notesChecklist: new Backbone.Collection([{
                        name: 'note_001',
                        label: 'First Note Title',
                        value: true,
                        time: "08:30",
                        date: "09/28/2015"
                    }, {
                        name: 'note_002',
                        label: 'Second Note Title',
                        value: false,
                        time: "10:30",
                        date: "09/27/2015"
                    }, {
                        name: 'note_003',
                        label: 'Third Note Title',
                        value: undefined,
                        time: "03:30",
                        date: "09/09/2015"
                    }]),
                    labsChecklist: new Backbone.Collection([{
                        name: 'lab_15006',
                        label: 'Potassium Blood Serum WC LB',
                        value: undefined,
                        labNumber: '15006'
                    }, {
                        name: 'lab_12001',
                        label: 'Potassium Blood Serum WC LB',
                        value: false,
                        labNumber: '12001'
                    }, {
                        name: 'lab_16040',
                        label: 'Potassium Blood Serum WC LB',
                        value: true,
                        labNumber: '16040'
                    }])
                },
                validate: function(attributes, options) {
                    this.errorModel.clear();
                    if (attributes.outpatientMedsChecklist === "") {
                        this.errorModel.set({
                            outpatientMedsChecklist: "Please complete the treatment factors form."
                        });
                    }
                    if (attributes.esignCode.replace(/\s+/g, '') === "") {
                        this.errorModel.set({
                            esignCode: "Please enter a valid signature"
                        });
                    }
                    if (!_.isEmpty(this.errorModel.toJSON())) {
                        return "Validation errors. Please fix.";
                    }
                }
            });
            // *********************************************** END OF MODEL *********************************************

            // *********************************************** VIEWS **********************************************

            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you cancel this signature process. Would you like to proceed?'),
                tagName: 'p'
            });

            var FooterView = Backbone.Marionette.ItemView.extend({
                tagName: 'span',
                ui: {
                    'ContinueButton': '#alert-continue-btn',
                    'CancelButton': '#alert-cancel-btn'
                },
                template: Handlebars.compile('{{ui-button "Cancel" id="alert-cancel-btn" classes="btn-default btn-sm" title="Click button to cancel your action!"}}{{ui-button "Continue" id="alert-continue-btn" classes="btn-primary btn-sm" title="Click button to continue your action!"}}'),
                events: {
                    'click @ui.ContinueButton': function() {
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click @ui.CancelButton': function() {
                        ADK.UI.Alert.hide();
                    }
                }
            });


            var formView = ADK.UI.Form.extend({
                ui: {
                    "FormSignBtn": ".button-control.sign button",
                    "FormCancelBtn": ".button-control.cancel button"
                },
                fields: F568Fields,
                events: {
                    "click @ui.FormCancelBtn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to cancel?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "submit": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid()) {
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        } else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Signature Submitted',
                                icon: 'fa-check',
                                message: 'Signature successfully submitted with no errors.',
                                type: "success"

                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                modelEvents: {
                    "change:esignCode": function(model) {
                        var esignCode = model.get('esignCode');
                        if (this.model.isValid()) {
                            this.ui.FormSignBtn.trigger('control:disabled', false);
                        } else {
                            this.ui.FormSignBtn.trigger('control:disabled', true);
                        }

                    }
                }
            });
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel();

            var workflowOptions = {
                size: "medium",
                title: "Sign",
                showProgress: false,
                keyboard: false,
                headerOptions: {},
                steps: [{
                    view: formView,
                    viewModel: formModel,
                    stepTitle: "E-Signature"
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
            // *********************************************** END OF MODEL AND WORKFLOW INSTANCE ***********************
        }
    };
    return F568;
});