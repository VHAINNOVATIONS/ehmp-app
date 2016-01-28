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

    var F170 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        createForm: function() {
            var vitalsChecklistCollection = {
                control: 'checklist',
                name: 'vitalsChecklist',
                label: 'Vitals entered in error checklist',
                itemTemplate: "<strong>{{label}}</strong>{{#if itemEIEValue}}<span class='time-taken'>{{itemEIEValue}}</span>{{/if}}",
                extraClasses: ["split-checklist bottom-margin-no all-padding-no"],
                attributeMapping: {
                    unique: 'itemName',
                    value: 'itemValue',
                    eIEValue: 'itemEIEValue',
                    label: 'itemLabel'
                },
                collection: new Backbone.Collection([{
                    itemName: 'item1',
                    itemValue: false,
                    itemLabel: 'Blood Pressure',
                    itemEIEValue: '143/73 mm[HG]'
                }, {
                    itemName: 'item2',
                    itemValue: false,
                    itemLabel: 'Temperature',
                    itemEIEValue: '98.7 F (73.1 C)'
                }, {
                    itemName: 'item3',
                    itemValue: false,
                    itemLabel: 'Pulse',
                    itemEIEValue: '67 /min'
                }, {
                    itemName: 'item4',
                    itemValue: false,
                    itemLabel: 'Respiration',
                    itemEIEValue: '10 /min'
                }, {
                    itemName: 'item5',
                    itemValue: false,
                    itemLabel: 'Pulse Oximetry',
                    itemEIEValue: '92 %'
                }, {
                    itemName: 'item6',
                    itemValue: false,
                    itemLabel: 'Height',
                    itemEIEValue: '68 in (172.72 cm)'
                }, {
                    itemName: 'item7',
                    itemValue: false,
                    itemLabel: 'Weight',
                    itemEIEValue: '167 Ib (75.91 kg)'
                }, {
                    itemName: 'item8',
                    itemValue: false,
                    itemLabel: 'Pain',
                    itemEIEValue: '0'
                }, {
                    itemName: 'item9',
                    itemValue: false,
                    itemLabel: 'Circumference/Girth',
                    itemEIEValue: 'unavailable'
                }]),
                srOnlyLabel: true
            };

            var vitalsChecklistRegion = {
                control: "container",
                extraClasses: "panel panel-default bottom-margin-sm",
                items: [{
                    control: "container",
                    extraClasses: "panel-body all-padding-sm",
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "button",
                                extraClasses: ["btn-default btn-block btn-sm btn-check-all-checklist"],
                                label: "Check All",
                                name: "checkAll",
                                title: "Press enter to check all checklist options for vitals entered in error.",
                                type: "button"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: "row",
                        items: [{
                            control: "container",
                            template: Handlebars.compile('<span class="sr-only">Name and result header for Vitals entered in error checklist</span>')
                        }, {
                            control: "container",
                            extraClasses: "col-xs-6",
                            template: Handlebars.compile('<strong class="left-margin-lg" aria-hidden="true">Name</strong>')
                        }, {
                            control: "container",
                            extraClasses: "col-xs-6",
                            template: Handlebars.compile('<strong aria-hidden="true">Result</strong>')
                        }, {
                            control: "container",
                            template: Handlebars.compile('<hr class="left-margin-sm right-margin-sm bottom-margin-no" aria-hidden="true" />'),
                        }]
                    }, {
                        control: "container",
                        extraClasses: "row",
                        items: [{
                            control: "container",
                            extraClasses: "col-xs-12",
                            items: [vitalsChecklistCollection]
                        }]
                    }]
                }]
            };

            var vitalsNoteRegion = {
                control: "container",
                extraClasses: "well well-sm bottom-margin-sm",
                template: Handlebars.compile('<span>NOTE: To mark CLIO records as "Enter in Error" use the Flowsheet application.</span>')
            };

            var vitalsRadioCollection = {
                control: "radio",
                label: "Reason",
                name: "vitalsRadioCollection",
                extraClasses: ["radio-col-2 all-padding-no"],
                options: [{
                    label: "Incorrect Date/Time",
                    value: "opt1",
                    title: "Incorrect Date/Time"
                }, {
                    label: "Incorrect Patient",
                    value: "opt2",
                    title: "Incorrect Patient"
                }, {
                    label: "Incorrect Reading",
                    value: "opt3",
                    title: "Incorrect Reading"
                }, {
                    label: "Invalid Record",
                    value: "opt4",
                    title: "Invalid Record"
                }]
            };

            var vitalsRadioRegion = {
                control: "container",
                extraClasses: "panel panel-default bottom-margin-sm",
                items: [{
                    control: "container",
                    extraClasses: "panel-body all-padding-sm",
                    items: [vitalsRadioCollection]
                }]
            };



            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var connectionAndDisabilitiesInfo = {
                control: "container",
                extraClasses: ["col-xs-12"],
                modelListeners: ["connectionPercent", "ratedDisabilities"],
                template: Handlebars.compile('<h6>Service Connection &amp; Rated Disabilities</h6><p>Service Connected: {{connectionPercent}}%</p><p>Rated Disabilities: {{ratedDisabilities}}</p>'),
                items: []
            };

            var F170Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [{
                        control: "container",
                        extraClasses: "row left-padding-md right-padding-md",
                        items: [{
                            control: "container",
                            extraClasses: "col-xs-12",
                            items: [vitalsChecklistRegion]
                        }]
                    }, {
                        control: "container",
                        extraClasses: "row left-padding-md right-padding-md",
                        items: [{
                            control: "container",
                            extraClasses: "col-xs-12",
                            items: [vitalsNoteRegion]
                        }]
                    }, {
                        control: "container",
                        extraClasses: "row left-padding-md right-padding-md",
                        items: [{
                            control: "container",
                            extraClasses: "col-xs-12",
                            items: [vitalsRadioRegion]
                        }]
                    }]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "button",
                            extraClasses: ["btn-default btn-sm"],
                            label: "Cancel",
                            name: "cancel",
                            title: "Press enter to cancel.",
                            type: "button"
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary btn-sm"],
                            label: "Enter in error",
                            name: 'enterInError',
                            title: "Press enter to submit vitals enter in error form."
                        }]
                    }]
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                // TODO
            });
            // *********************************************** END OF MODEL *********************************************

            // *********************************************** VIEWS **********************************************

            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
                tagName: 'p'
            });

            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" id="alert-cancel-btn" classes="btn-default btn-sm" title="Click button to cancel your action!"}}{{ui-button "Continue" id="alert-continue-btn" classes="btn-primary btn-sm" title="Click button to continue your action!"}}'),
                events: {
                    'click #alert-continue-btn': function() {
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click #alert-cancel-btn': function() {
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });

            var isTrue = false;

            var formView = ADK.UI.Form.extend({
                ui: {
                    "formSignBtn": ".button-control.sign"
                },
                fields: F170Fields,
                events: {
                    "click .button-control.checkAll button": function(e) {
                        e.preventDefault();
                        // clean up code
                        // conditional to toggle check all button
                        if (!isTrue) {
                            isTrue = !isTrue;
                        } else {
                            isTrue = !isTrue;
                        }

                        $('.checklist-control.vitalsChecklist').trigger('control:item:value', {booleanValue:isTrue});
                    },
                    "click .button-control.cancel button": function(e) {
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
                                title: 'Vitals entered in error Submitted',
                                icon: 'fa-check',
                                message: 'Vitals entered in error items submitted with no errors.',
                                type: "success"

                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                modelEvents: {
                    // todo
                }
            });
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel();

            var workflowOptions = {
                size: "small",
                title: "Vitals - Entered In Error",
                showProgress: false,
                keyboard: true,
                headerOptions: {},
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
    return F170;
});