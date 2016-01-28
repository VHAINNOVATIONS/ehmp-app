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

    var F457 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        createForm: function() {
            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var F457Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluid"],
                    items: [{
                        control: "container",
                        extraClasses: ["row", "top-padding-lg"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-2"],
                            items: [{
                                control: "container",
                                title: "Image of the user",
                                template: '<img src="{{userImage}}" alt="image of user" />'
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-10", "left-padding-xs"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-12", "left-padding-no"],
                                template: '<h2 class="no-padding top-margin-none bold uppercase">{{firstName}} {{lastName}}</h2>'
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12", "bottom-padding-sm"],
                            items: [{
                                control: "container",
                                template: '<p class="border-bottom bold top-padding-lg bottom-padding-no">User Information</p>',
                            }, {
                                control: "spacer",
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-6", "bottom-margin-sm"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs", "text-muted"],
                                template: 'First Name'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs"],
                                template: '{{firstName}}'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs", "text-muted"],
                                template: 'Last Name'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs"],
                                template: '{{lastName}}'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs", "text-muted"],
                                template: 'Role'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-5", "bottom-padding-xs"],
                                template: '{{role}}'
                            }, {
                                control: 'popover',
                                srOnlyLabel: "Edit Roles",
                                label: "",
                                name: "add-visit-modifiers-popover",
                                title: "Press enter to edit role",
                                icon: "fa-pencil",
                                extraClasses: ["col-xs-1", "bottom-padding-xs", "btn-icon", "pull-right", "all-padding-no"],
                                options: {
                                    placement: 'bottom'
                                },
                                items: [{
                                    control: "container",
                                    extraClasses: ["row", "section-add-modifiers"],
                                    items: [{
                                        control: "container",
                                        extraClasses: ["col-xs-12"],
                                        items: [{
                                            control: "multiselectSideBySide",
                                            name: "availableVistModifiers",
                                            label: "Modifiers",
                                            size: "small"
                                        }]
                                    }, {
                                        control: "container",
                                        extraClasses: ["col-xs-12"],
                                        items: [{
                                            control: "container",
                                            extraClasses: ["bottom-padding-xs"],
                                            items: [{
                                                control: "button",
                                                type: "button",
                                                label: "Done",
                                                extraClasses: ["btn-primary", "btn-sm"],
                                                title: "Press enter to close.",
                                                id: "add-visit-modifiers-close-btn"
                                            }]
                                        }]
                                    }]
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs", "text-muted"],
                                template: 'Facility'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs"],
                                template: '{{facility}}'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs", "text-muted"],
                                template: 'Phone 1'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs"],
                                template: '{{phone1}}'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs", "text-muted"],
                                template: 'Phone 2'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs"],
                                template: '{{phone2}}'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs", "text-muted"],
                                template: 'Email Address'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs"],
                                template: '<a href="mailto:{{email1}}">{{email1}}</a>'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs", "text-muted"],
                                template: 'Email Address 2'
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6", "bottom-padding-xs"],
                                template: '<a href="mailto:{{email2}}">{{email2}}</a>'
                            }]
                        }]
                    }]
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                defaults: {
                    userImage: "demo_files/feature_forms/supporting_files/user-image.jpg",
                    firstName: "Clark",
                    lastName: "Bravo",
                    role: "none",
                    facility: "TST01 - Las Vegas",
                    phone1: "(702) 321-4567",
                    phone2: "none",
                    email1: "clark.bravo@va.gov",
                    email2: "clark.bravo@asmr.com"
                }
            });
            // *********************************************** END OF MODEL *********************************************

            // *********************************************** VIEWS **********************************************
            // Okay to copy and paste - WITH 1 EXCEPTION (see below)

            var formView = ADK.UI.Form.extend({
                ui: {
                    'AddVisitModifiersPopover': '.add-visit-modifiers-popover',
                    'ClosAddVisitModifiers': '.add-visit-modifiers-popover #add-visit-modifiers-close-btn',
                },
                fields: F457Fields,
                events: {
                    "click #form-close-btn": function(e) {
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Note Submitted',
                                icon: 'fa-check',
                                message: 'Note successfully saved with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                    },
                    "submit": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");

                            // ********************* Go to signature form here *********************

                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                modelEvents: {
                    // none
                },
                events: {
                    "click @ui.ClosAddVisitModifiers": function(e) {
                        e.preventDefault();
                        this.$(this.ui["AddVisitModifiersPopover"]).trigger('control:popover:hidden', true);
                    }
                }
            });
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel();

            var workflowOptions = {
                size: "medium",
                title: "Users",
                showProgress: false,
                keyboard: true,
                steps: [{
                    view: formView,
                    viewModel: formModel,
                    stepTitle: 'Step 1'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
            // *********************************************** END OF MODEL AND WORKFLOW INSTANCE ***********************
        }
    };
    return F457;
});