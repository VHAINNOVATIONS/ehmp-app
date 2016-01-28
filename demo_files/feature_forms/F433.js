define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'hbs!demo_files/feature_forms/supporting_templates/F433_summaryTemplate'
], function(Backbone, Marionette, $, Handlebars, SummaryTemplate) {

    var F433 = {
        createForm: function() {
            var F433Fields = [{
                //*************************** Modal Body START ***************************
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluid"],
                    items: [{
                        control: "container",
                        extraClasses: ["row", "row-subheader"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "alertBanner", //Drug allergy
                                name: "drugAlergyAlertBanner",
                                type: "warning",
                                dismissible: true,
                                title: "DRUG-ALLERGY INTERACTION",
                                icon: "fa-warning"
                            }, {
                                control: "alertBanner", //Patient is taking other drug that may react with this one
                                name: "drugDrugInteractionAlertBanner",
                                type: "warning",
                                dismissible: true,
                                title: "DRUG-DRUG INTERACTION",
                                icon: "fa-warning"
                            }, {
                                control: "alertBanner", //Duplicate order - Dummy text
                                name: "dummyTextAlertBanner",
                                type: "warning",
                                dismissible: true,
                                title: "DUPLICATE ORDER",
                                icon: "fa-warning"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row", "section-divider"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "typeahead",
                                name: "outpatientMed",
                                label: "Select an Outpatient Med",
                                options: {
                                    minLength: 3
                                },
                                required: true,
                                pickList: [{
                                    value: "Amoxicillin",
                                    label: "Amoxicillin"
                                }, {
                                    value: "Azithromycin",
                                    label: "Azithromycin"
                                }, {
                                    value: "Hydrocodone",
                                    label: "Hydrocodone"
                                }, {
                                    value: "Lisinopril",
                                    label: "Lisinopril"
                                }, {
                                    value: "Prilosec",
                                    label: "Prilosec"
                                }, {
                                    value: "Zocor",
                                    label: "Zocor"
                                }, {
                                    value: "opt1",
                                    label: "Option 1"
                                }, {
                                    value: "opt2",
                                    label: "Option 2"
                                }, {
                                    value: "opt3",
                                    label: "Option 3"
                                }, {
                                    value: "opt4",
                                    label: "Option 4"
                                }, {
                                    value: "opt5",
                                    label: "Option 5"
                                }, {
                                    value: "opt6",
                                    label: "Option 6"
                                }]
                            }]
                        }]
                    }]
                }]

            }, { //*************************** Modal Footer START ***************************
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        template: Handlebars.compile('<p aria-hidden="true">(* indicates a required field.)</p>')
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "button",
                            id: "delete-btn",
                            label: "Delete",
                            type: 'button',
                            extraClasses: ["btn-default", "btn-sm"]
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-primary", "btn-sm", "left-margin-xs"],
                            label: "Next",
                            id: "next-btn"
                        }]
                    }]
                }]
            }];

            var F433Fields2 = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluid"],
                    items: [{
                        control: "container",
                        extraClasses: ["row row-subheader"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "alertBanner", //Drug allergy
                                name: "drugAlergyAlertBanner",
                                type: "warning",
                                dismissible: true,
                                title: "DRUG-ALLERGY INTERACTION",
                                icon: "fa-warning"
                            }, {
                                control: "alertBanner", //Patient is taking other drug that may react with this one
                                name: "drugDrugInteractionAlertBanner",
                                type: "warning",
                                dismissible: true,
                                title: "DRUG-DRUG INTERACTION",
                                icon: "fa-warning"
                            }, {
                                control: "alertBanner", //Duplicate order - Dummy text
                                name: "dummyTextAlertBanner",
                                type: "warning",
                                dismissible: true,
                                title: "DUPLICATE ORDER",
                                icon: "fa-warning"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            template: Handlebars.compile('<h3>{{outpatientMed}}</h3>'),
                            modelListeners: ["outpatientMed"]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-4"],
                            items: [{
                                control: "typeahead",
                                name: "dosage",
                                label: "Dosage",
                                required: true,
                                pickList: [{
                                    value: "200mg",
                                    label: "200 mg"
                                }, {
                                    value: "500mg",
                                    label: "500 mg"
                                }, {
                                    value: "2g",
                                    label: "2g"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-4"],
                            items: [{
                                control: "typeahead",
                                name: "route",
                                label: "Route",
                                required: true,
                                pickList: [{
                                    value: "orally",
                                    label: "orally"
                                }, {
                                    value: "nasally",
                                    label: "nasally"
                                }, {
                                    value: "rectally",
                                    label: "rectally"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-3"],
                            items: [{
                                control: "typeahead",
                                name: "schedule",
                                label: "Schedule",
                                required: true,
                                pickList: [{
                                    value: "5XD",
                                    label: "5 times a day"
                                }, {
                                    value: "every other day",
                                    label: "every other day"
                                }, {
                                    value: "before going to sleep",
                                    label: "before going to sleep"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-1"],
                            items: [{
                                control: "checkbox",
                                name: "prn",
                                label: "PRN"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-4"],
                            items: [{
                                control: "input",
                                name: "daySupply",
                                label: "Day Supply",
                                type: "number",
                                required: true
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-4"],
                            items: [{
                                control: "input",
                                name: "quantity",
                                label: "Quantity",
                                type: "number",
                                required: true
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-4"],
                            items: [{
                                control: "input",
                                name: "refill",
                                label: "Refills",
                                type: "number"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-3"],
                            items: [{
                                control: "radio",
                                name: "pickUp",
                                label: "Pick Up",
                                options: [{
                                    value: "Clinic",
                                    label: "Clinic"
                                }, {
                                    value: "Mail",
                                    label: "Mail"
                                }, {
                                    value: "Window",
                                    label: "Window"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-4"],
                            items: [{
                                control: "radio",
                                name: "priority",
                                label: "Priority",
                                options: [{
                                    value: "Asap",
                                    label: "ASAP"
                                }, {
                                    value: "Done",
                                    label: "Done"
                                }, {
                                    value: "Routine",
                                    label: "Routine"
                                }, {
                                    value: "Stat",
                                    label: "Stat"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-6"],
                            items: [{
                                control: "textarea",
                                label: "Comments",
                                name: "comments",
                                rows: 3
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-6"],
                            template: Handlebars.compile('<h6>Patient Instructions</h6>'),
                            items: [{
                                control: "checkbox",
                                srOnlyLabel: true,
                                name: "patientInstructionsCheckbox",
                                extraClasses: ["col-xs-1"]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-11"],
                                template: Handlebars.compile("{{patientInstructionsText}}"),
                                name: "patientInstructionsContainer",
                                modelListeners: ["patientInstructionsText"]
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["order-preview"],
                        template: SummaryTemplate,
                        modelListeners: ["outpatientMed", "dosage", "route", "schedule", "prn", "daySupply", "quantity",
                            "refill", "pickUp", "priority", "comments", "patientInstructionsCheckbox", "patientInstructionsText"
                        ]
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
                        template: Handlebars.compile('<p aria-hidden="true">(* indicates a required field.)</p><p><span id="allergies-saved-at"> {{savedTime}}</span></p>')
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "button",
                            id: "delete-btn",
                            label: "Delete",
                            extraClasses: ["btn-default", "btn-sm"],
                            type: 'button'
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-default", "btn-sm"],
                            label: "Close",
                            id: "close-btn"
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-default", "btn-sm"],
                            label: "Back",
                            id: "back-btn"
                        }, {
                            control: 'dropdown',
                            split: true,
                            label: 'Accept',
                            id: 'dropdown-accept',
                            extraClasses: ["left-margin-xs"],
                            items: [{
                                label: 'Accept',
                                id: 'accept'
                            }, {
                                label: 'Accept & Add Another',
                                id: 'add'
                            }, {
                                label: 'Accept & Sign',
                                id: 'sign'
                            }]
                        }]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    patientInstructionsText: "Lorem ipsum dolor sit amet, consecteur adipsicing elit. Donec quis ex luctus, vehicula metus a, euismod metus",
                    outpatientMed: "",
                    drugDrugInteractionAlertBanner: "",
                    drugAlergyAlertBanner: "",
                    dummyTextAlertBanner: "",
                    dosage: '',
                    route: '',
                    schedule: '',
                    savedTime: "Saved at " + moment().format('HH:mm')
                },
                errorModel: new Backbone.Model(),
                validate: function(attributes, options) {
                    this.errorModel.clear();

                    var daySupply = this.get('daySupply');
                    var quantity = this.get('quantity');
                    var refill = this.get('refill');

                    if (daySupply < 1) {
                        this.errorModel.set({
                            'daySupply': "Must be greater than 0"
                        });
                        console.log("I reached here");
                    }
                    if (quantity < 1) {
                        this.errorModel.set({
                            'quantity': "Must be greater than 0"
                        });
                        console.log("I reached here");
                    }
                    if (refill < 0) {
                        this.errorModel.set({
                            'refill': "Cannot be negative number"
                        });
                        console.log("I reached here");
                    }
                    if (!_.isEmpty(this.errorModel.toJSON())) {
                        return "Validation errors. Please fix.";
                    }
                }
            });

            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you close this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Continue" classes="btn-primary" title="Click button to continue your action!"}}'),
                events: {
                    'click .btn-primary': function() {
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click .btn-default': function() {
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });

            var formView1 = ADK.UI.Form.extend({
                ui: {},
                fields: F433Fields,
                events: {
                    "click #delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #next-btn": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.workflow.goToNext();
                        }
                    }
                },
                resetAll: function() {
                    this.model.unset("dosage");
                    this.model.unset("route");
                    this.model.unset("schedule");
                    this.model.unset("daySupply");
                    this.model.unset("quantity");
                    this.model.unset("refill");
                    this.model.unset("pickUp");
                    this.model.unset("priority");
                    this.model.unset("comments");
                    this.model.unset("patientInstructionsCheckbox");
                    this.model.unset("prn");
                    this.model.unset('drugDrugInteractionAlertBanner');
                    this.model.unset('drugAlergyAlertBanner');
                    this.model.unset('dummyTextAlertBanner');
                },
                modelEvents: {
                    'change:outpatientMed': function(model) {
                        this.resetAll();
                        var med = model.get('outpatientMed');
                        var allergyMessage = 'Patient has known allergy to ' + med;
                        var drugInteractionMessage = 'Patient is currently prescribed Comadin. Using Sodium ' + med + ' and Coumadin together may cause exessive bleeding';
                        var dummyText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry';
                        if (med === 'Azithromycin' || med === 'opt2') {
                            this.model.set('drugDrugInteractionAlertBanner', drugInteractionMessage);
                        } else if (med === 'Hydrocodone' || med === 'opt3') {
                            this.model.set('drugAlergyAlertBanner', allergyMessage);
                        } else if (med === 'Lisinopril' || med === 'opt4') {
                            this.model.set('dummyTextAlertBanner', dummyText);
                        } else if (med === 'Prilosec' || med === 'opt5') {
                            this.model.set('drugDrugInteractionAlertBanner', drugInteractionMessage);
                            this.model.set('drugAlergyAlertBanner', allergyMessage);
                        } else if (med === 'Zocor' || med === 'opt6') {
                            this.model.set('drugDrugInteractionAlertBanner', drugInteractionMessage);
                            this.model.set('drugAlergyAlertBanner', allergyMessage);
                            this.model.set('dummyTextAlertBanner', dummyText);
                        }
                    }
                }
            });

            var formView2 = ADK.UI.Form.extend({
                ui: {
                    "daySupply": ".daySupply",
                    "quantity": ".quantity"
                },
                fields: F433Fields2,
                events: {
                    "click #delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #back-btn": function(e) {
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.workflow.goToPrevious();
                        }
                    },
                    "click #close-btn": function(e) {
                        e.preventDefault();
                        var saveAlertView = new ADK.UI.Notification({
                            title: 'Immunization Saved',
                            message: 'Immunization successfully saved without errors.',
                            type: "success"
                        });
                        saveAlertView.show();
                        ADK.UI.Workflow.hide();
                    },
                    "click #dropdown-accept-accept": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Outpatient Medication Order Submitted',
                                icon: "fa-check",
                                message: 'Outpatient medication order successfully submitted with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    },
                    "click #dropdown-accept-add": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Outpatient Medication Order Submitted',
                                icon: "fa-check",
                                message: 'Outpatient medication order successfully submitted with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    },
                    "click #dropdown-accept-sign": function(e) {
                        console.log("accept and sign");
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Outpatient Medication Order Submitted',
                                icon: "fa-check",
                                message: 'Outpatient medication order successfully submitted with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                modelEvents: {
                    // none
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Enter Task",
                showProgress: true,
                keyboard: true,
                headerOptions: {
                    actionItems: [{
                        label: 'Preview',
                        onClick: function() {
                            // Preview functionality to go here
                        }
                    }, {
                        label: 'Print',
                        onClick: function() {
                            // Print functionality to go here
                        }
                    }]
                },
                steps: [{
                    view: formView1,
                    viewModel: formModel,
                    stepTitle: 'Select a Task'
                }, {
                    view: formView2,
                    viewModel: formModel,
                    stepTitle: 'Enter Order Info'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        }
    };
    return F433;
});