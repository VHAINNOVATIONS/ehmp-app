define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
], function(Backbone, Marionette, $, Handlebars) {

    var F423 = {
        createForm: function() {
            var rowSubheader = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-4"],
                        items: [{
                            control: "datepicker",
                            name: "dateTaken",
                            title: "Please enter in a date in the following format, MM/DD/YYYY",
                            label: "Date Taken",
                            required: true
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-3"],
                        items: [{
                            control: "timepicker",
                            name: "time-taken",
                            title: "Please enter in a time in the following format,HH:MM",
                            label: "Time Taken"
                        }]

                    }, {
                        control: "container",
                        extraClasses: ["col-xs-3"],
                        items: [{
                            control: "button",
                            title: "Press enter to pass",
                            type: "button",
                            name: "facility-name-pass-po",
                            label: "Pass",
                            extraClasses: ["btn-primary", "btn-sm", "top-margin-lg"]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-2"],
                        items: [{
                            control: 'button',
                            type: 'button',
                            label: 'Expand All',
                            name: 'expandCollapseAll',
                            extraClasses: ["btn-default", "btn-sm", "top-margin-lg", "left-margin-md"],
                            title: "Press enter to expand all vitals"
                        }]
                    }, {
                        control: "spacer"
                    }]
                }]
            };


            var bloodPressureBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "bp-location-po",
                    label: "Location",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-3"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    name: "bp-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-3"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    label: "Cuff Size",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    name: "bp-cuff-size-po",
                    extraClasses: ["col-xs-3"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    name: "bp-position-po",
                    extraClasses: ["col-xs-3"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }]
            };

            var bloodPressureSection = {
                control: 'collapsibleContainer',
                name: 'bpSection',
                headerItems: [{
                    control: "container",
                    extraClasses: ["col-xs-6", "bpInput"],
                    items: [{
                        control: "input",
                        name: "bp-value-po",
                        label: "Blood Pressure",
                        title: "Please enter in a numeric value",
                        extraClasses: ["vitalInput"],
                        units: "mmHg"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-6"],
                    items: [{
                        control: "radio",
                        name: "bp-radio-po",
                        label: "Blood Pressure Vital Unavailable or Refused Radio",
                        srOnlyLabel: true,
                        extraClasses: ["top-margin-md"],
                        options: [{
                            value: "bp-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "bp-refused",
                            label: "Refused"
                        }]
                    }]
                }],
                collapseItems: [bloodPressureBody]
            };

            var temperatureHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "input",
                        name: "temperature-value-po",
                        label: "Temperature",
                        title: "Please enter in a numeric value",
                        extraClasses: ["vitalInput"],
                        units: [{
                            label: "F",
                            value: "f",
                            title: "fahrenheit"
                        }, {
                            label: "C",
                            value: "c",
                            title: "celcius"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "radio",
                        name: "temperature-radio-po",
                        label: "Temperature Vital Unavailable or Refused Radio",
                        srOnlyLabel: true,
                        extraClasses: ["top-margin-md"],
                        options: [{
                            value: "temperature-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "temperature-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var temperatureBody = {
                control: "container",
                extraClasses: ["col-xs-6"],
                items: [{
                    control: "select",
                    label: "Location",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    name: "temperature-location-po",
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }]
            };

            var temperatureSection = {
                control: 'collapsibleContainer',
                name: 'temperatureSection',
                headerItems: [temperatureHeader],
                collapseItems: [temperatureBody]
            };

            var pulseHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "input",
                        label: "Pulse",
                        name: "pulse-value-po",
                        units: "/min",
                        extraClasses: ["vitalInput"],
                        title: "Please enter in a numeric value"
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "radio",
                        name: "pulse-radio-po",
                        label: "Pulse Vital Unavailable or Refused Radio",
                        srOnlyLabel: true,
                        extraClasses: ["top-margin-md"],
                        options: [{
                            value: "pulse-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "pulse-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var pulseBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "pulse-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-3"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    name: "pulse-position-po",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-3"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    name: "pulse-site-po",
                    label: "Site",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-3"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    name: "pulse-location-po",
                    label: "Location",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-3"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }]
            };

            var pulseSection = {
                control: 'collapsibleContainer',
                name: 'pulseSection',
                headerItems: [pulseHeader],
                collapseItems: [pulseBody]
            };

            var respirationHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "input",
                        label: "Respiration",
                        units: "/min",
                        extraClasses: ["vitalInput"],
                        title: "Please enter in a numeric value",
                        name: "respiration-measurement-po"
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "radio",
                        name: "respiration-radio-po",
                        label: "Respiration Vital Unavailable or Refused Radio",
                        srOnlyLabel: true,
                        extraClasses: ["top-margin-md"],
                        options: [{
                            value: "respiration-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "respiration-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var respirationBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "respiration-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    name: "respiration-position-po",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }]
            };

            var respirationSection = {
                control: 'collapsibleContainer',
                name: 'respirationSection',
                headerItems: [respirationHeader],
                collapseItems: [respirationBody]
            };

            var pulseOximetryHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "input",
                        name: "po-concentration-po",
                        label: "Pulse Oximetry",
                        title: "Please enter in a numeric value",
                        units: "%",
                        extraClasses: ["vitalInput"]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "radio",
                        name: "po-radio-po",
                        label: "Pulse Oximetry Vital Unavailable or Refused Radio",
                        srOnlyLabel: true,
                        extraClasses: ["top-margin-md"],
                        options: [{
                            value: "po-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "po-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var pulseOximetryBody = {
                control: "container",
                items: [{
                    control: "input",
                    label: "Supplimental Oxygen Flow Rate",
                    name: "po-measurement-po",
                    units: "(liters/minute)",
                    title: "Please enter in a numeric value",
                    extraClasses: ["col-xs-6"],
                    disabled: true
                }, {
                    control: "select",
                    label: "Method",
                    name: "po-method-po",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }]
            };

            var pulseOximetrySection = {
                control: 'collapsibleContainer',
                name: 'poSection',
                headerItems: [pulseOximetryHeader],
                collapseItems: [pulseOximetryBody]
            };

            var heightHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "input",
                        name: "height-value-po",
                        label: "Height",
                        title: "Please enter in a numeric value",
                        extraClasses: ["vitalInput"],
                        units: [{
                            label: "in",
                            value: "in",
                            title: "inches"
                        }, {
                            label: "cm",
                            value: "cm",
                            title: "centimeters"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "radio",
                        name: "height-radio-po",
                        label: "Height Vital Unavailable or Refused Radio",
                        srOnlyLabel: true,
                        extraClasses: ["top-margin-md"],
                        options: [{
                            value: "height-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "height-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var heightBody = {
                control: "container",
                extraClasses: ["col-xs-6"],
                items: [{
                    control: "select",
                    label: "Quality",
                    name: "height-quality-po",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }]
            };

            var heightSection = {
                control: 'collapsibleContainer',
                name: 'heightSection',
                headerItems: [heightHeader],
                collapseItems: [heightBody]
            };

            var weightHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "input",
                        name: "weight-value-po",
                        label: "Weight",
                        title: "Please enter in a numeric value",
                        extraClasses: ["vitalInput"],
                        units: [{
                            label: "lb",
                            value: "lb",
                            title: "lb Units"
                        }, {
                            label: "kg",
                            value: "kg",
                            title: "kg Units"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "radio",
                        name: "weight-radio-po",
                        label: "Weight Vital Unavailable or Refused Radio",
                        srOnlyLabel: true,
                        extraClasses: ["top-margin-md"],
                        options: [{
                            value: "weight-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "weight-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var weightBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "weight-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    name: "weight-quality-po",
                    label: "Quality",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }]
            };

            var weightSection = {
                control: 'collapsibleContainer',
                name: 'weightSection',
                headerItems: [weightHeader],
                collapseItems: [weightBody]
            };

            var painHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-2", "left-padding-no"],
                        items: [{
                            control: "input",
                            name: "pain-value-po",
                            label: "Pain",
                            extraClasses: ["vitalInput"],
                            placeholder: "0-10",
                            title: "Please enter in a numeric value for pain from 0 to 10, 0 being no pain and 10 being the greatest amount of pain"
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-4"],
                        items: [{
                            control: "checkbox",
                            label: "Unable to Respond",
                            name: "pain-checkbox-po",
                            extraClasses: ["top-margin-lg"],
                            title: "To select this checkbox, press the spacebar"
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6", "right-padding-no"],
                        items: [{
                            control: "radio",
                            name: "pain-radio-po",
                            label: "Pain Vital Unavailable or Refused Radio",
                            srOnlyLabel: true,
                            extraClasses: ["top-margin-md"],
                            options: [{
                                value: "pain-unavailable",
                                label: "Unavailable"
                            }, {
                                value: "pain-refused",
                                label: "Refused"
                            }]
                        }]
                    }]
                }]
            };

            var painSection = {
                control: 'collapsibleContainer',
                name: 'painSection',
                headerItems: [painHeader]
            };

            var circumferenceHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "input",
                        label: "Circumference/Girth",
                        name: "cg-value-po",
                        title: "Please enter in a numeric value",
                        extraClasses: ["vitalInput"],
                        units: [{
                            label: "in",
                            value: "in",
                            title: "in Units"
                        }, {
                            label: "cm",
                            value: "cm",
                            title: "cm Units"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-6'],
                    items: [{
                        control: "radio",
                        name: "cg-radio-po",
                        label: "Circumference / Girth Vital Unavailable or Refused Radio",
                        srOnlyLabel: true,
                        extraClasses: ["top-margin-md"],
                        options: [{
                            value: "cg-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "cg-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var circumferenceBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "cg-site-po",
                    label: "Site",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }, {
                    control: "select",
                    label: "Location",
                    name: "cg-location-po",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    disabled: true,
                    pickList: [{
                        label: "Option 1",
                        value: "opt1"
                    }, {
                        label: "Option 2",
                        value: "opt2"
                    }, {
                        label: "Option 3",
                        value: "opt3"
                    }]
                }]
            };

            var circumferenceSection = {
                control: 'collapsibleContainer',
                name: 'cgSection',
                headerItems: [circumferenceHeader],
                collapseItems: [circumferenceBody]
            };

            var F423Fields = [{
                //*************************** Modal Body START ***************************
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluid"],
                    items: [rowSubheader, bloodPressureSection, temperatureSection, pulseSection,
                        respirationSection, pulseOximetrySection, heightSection, weightSection, painSection, circumferenceSection
                    ]
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
                        template: Handlebars.compile('<p aria-hidden="true">(* indicates a required field.)</p>{{#if savedTime}}<p><span id="vitals-saved-at">Saved at: {{savedTime}}</span></p>{{/if}}')
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "button",
                            id: 'form-delete-btn',
                            extraClasses: ["btn-default", "btn-sm", "left-margin-xs"],
                            type: "button",
                            label: "Delete",
                            title: "Press enter to delete"
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm", "left-margin-xs"],
                            label: "Add",
                            type: "button",
                            id: "form-add-btn",
                            title: "Press enter to add"
                        }]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    facilityName: 'D.C. VA Hospital',
                    labOrderDate: '5/5/2015',
                    labOrderTime: '14:40',
                    dateTaken: moment().format('MM/DD/YYYY'),
                    //savedTime: moment().format('HH:mm')
                },
                errorModel: new Backbone.Model(),
                validate: function(attributes, options) {
                    this.errorModel.clear();

                    var painValue = this.get("pain-value-po");
                    var bpValue = this.get("bp-value-po");
                    var tempValue = this.get("temperature-value-po");
                    var pulseValue = this.get("pulse-value-po");
                    var respValue = this.get("respiration-measurement-po");
                    var poValue = this.get("po-concentration-po");
                    var heightValue = this.get("height-value-po");
                    var weightValue = this.get("weight-value-po");
                    var cgValue = this.get("cg-value-po");

                    if (tempValue !== undefined) {
                        tempValue = tempValue.substring(0, tempValue.length - 1);
                    }
                    if (heightValue !== undefined) {
                        heightValue = heightValue.substring(0, heightValue.length - 2);
                    }
                    if (weightValue !== undefined) {
                        weightValue = weightValue.substring(0, weightValue.length - 2);
                    }
                    if (cgValue !== undefined) {
                        cgValue = cgValue.substring(0, cgValue.length - 2);
                    }

                    var self = this;
                    var nanFunc = function(vitalName) {
                        self.errorModel.set(vitalName, "Not a number!");
                    };

                    if (isNaN(bpValue) && bpValue !== undefined) {
                        nanFunc("bp-value-po");
                    }
                    if (isNaN(tempValue) && tempValue !== undefined) {
                        nanFunc("temperature-value-po");
                    }
                    if (isNaN(pulseValue) && pulseValue !== undefined) {
                        nanFunc("pulse-value-po");
                    }
                    if (isNaN(respValue) && respValue !== undefined) {
                        nanFunc("respiration-measurement-po");
                    }
                    if (isNaN(poValue) && poValue !== undefined) {
                        nanFunc("po-concentration-po");
                    }
                    if (isNaN(heightValue) && heightValue !== undefined) {
                        nanFunc("height-value-po");
                    }
                    if (isNaN(weightValue) && weightValue !== undefined) {
                        nanFunc("weight-value-po");
                    }
                    if (isNaN(painValue) && painValue !== undefined) {
                        nanFunc("pain-value-po");
                    } else if (painValue < 0 || painValue > 10) {
                        this.errorModel.set({
                            'pain-value-po': "Must be from 0 to 10"
                        });
                    }
                    if (isNaN(cgValue) && cgValue !== undefined) {
                        nanFunc("cg-value-po");
                    }
                    if (!_.isEmpty(this.errorModel.toJSON())) {
                        return "Validation errors. Please fix.";
                    }
                }
            });

            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this lab order. Would you like to proceed?'),
                tagName: 'p'
            });

            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you close this lab order. Would you like to proceed?'),
                tagName: 'p'
            });
            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" classes="btn-default btn-sm" title="Click button to cancel your action!"}}{{ui-button "Continue" classes="btn-primary btn-sm" title="Click button to continue your action!"}}'),
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

            var toggleBooleanExpandCollapse = false;
            var toggleBooleanPassBtn = true;

            var formView = ADK.UI.Form.extend({
                ui: {
                    "bpInput": ".bpInput",
                    "tempLocation": ".temperature-location-po",
                    "heightQuality": ".height-quality-po",
                    "bpFields": ".bp-location-po, .bp-method-po, .bp-cuff-size-po, .bp-position-po",
                    "pulseFields": ".pulse-location-po, .pulse-method-po, .pulse-position-po, .pulse-site-po",
                    "respirationFields": ".respiration-method-po, .respiration-position-po",
                    "poFields": ".po-measurement-po, .po-method-po",
                    "weightFields": ".weight-quality-po, .weight-method-po",
                    "cgFields": ".cg-site-po, .cg-location-po",
                    "ExpandCollapseAllButton": ".expandCollapseAll button",
                    "ExpandCollapseAllControl": ".expandCollapseAll",
                    "PassButton": ".facility-name-pass-po button",
                    "AllCollapsibleContainers": ".bpSection, .temperatureSection, .pulseSection, .respirationSection, .poSection, .heightSection, .weightSection, .cgSection"
                },
                fields: F423Fields,
                getNextVitalInput: function(current) {
                    var inputs = this.$('.header-content .vitalInput input:not(:radio)');
                    var currentIndex = _.lastIndexOf(inputs, current);
                    return inputs[currentIndex + 1];
                },
                allFields: ["bp-value-po", "bp-radio-po", "temperature-value-po", "temperature-radio-po",
                    "pulse-value-po", "pulse-radio-po", "respiration-measurement-po", "respiration-radio-po", "po-concentration-po", "po-radio-po",
                    "height-value-po", "height-radio-po", "weight-value-po", "weight-radio-po",
                    "pain-value-po", "pain-checkbox-po", "pain-radio-po",
                    "cg-value-po", "cg-radio-po"
                ],
                events: {
                    'click @ui.PassButton': function(e) {
                        e.preventDefault();
                        this.ui.PassButton.toggleClass('active');
                        this.allFields.forEach(function(field) {
                            if (this.model.get(field)) {
                                this.model.unset(field);
                            }
                            if (($('.' + field + ':disabled').length < 1)) {
                                $('.' + field).trigger("control:disabled", toggleBooleanPassBtn);
                            }
                        }, this);
                        toggleBooleanPassBtn = !toggleBooleanPassBtn;
                    },
                    "keyup .header-content .vitalInput:not(:last) input:not(:radio):focus": function(e) {
                        if (e.which == 13) {
                            if (this.getNextVitalInput(e.currentTarget)) {
                                this.getNextVitalInput(e.currentTarget).focus();
                            }
                        }
                    },
                    "click @ui.ExpandCollapseAllButton": function(e) {
                        e.preventDefault();
                        this.ui.AllCollapsibleContainers.trigger("control:collapsed", toggleBooleanExpandCollapse);

                        if (toggleBooleanExpandCollapse) {
                            this.ui.ExpandCollapseAllControl.trigger("control:label", 'Expand All').trigger("control:title", 'Press enter to expand all vitals');
                        } else {
                            this.ui.ExpandCollapseAllControl.trigger("control:label", 'Collapse All').trigger("control:title", 'Press enter to collapse all vitals');
                        }
                        this.ui.ExpandCollapseAllControl.find('button').focus();
                        toggleBooleanExpandCollapse = !toggleBooleanExpandCollapse;
                    },
                    "click #form-delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #form-close-btn": function(e) {
                        e.preventDefault();
                        var closeAlertView = new ADK.UI.Notification({
                            title: 'Vitals Submitted',
                            icon: 'fa-check',
                            message: 'Vitals successfully saved without errors.',
                            type: "success"
                        });
                        closeAlertView.show();
                        ADK.UI.Workflow.hide();
                    },
                    "click #form-add-btn": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: this.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Vitals Submitted',
                                icon: 'fa-check',
                                message: 'Vitals successfully submitted without errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                vitalsMapping: {
                    bloodPressure: {
                        input: "bp-value-po",
                        radio: "bp-radio-po",
                        fields: "bpFields"
                    },
                    temperature: {
                        input: "temperature-value-po",
                        radio: "temperature-radio-po",
                        fields: "tempLocation"
                    },
                    pulse: {
                        input: "pulse-value-po",
                        radio: "pulse-radio-po",
                        fields: "pulseFields"
                    },
                    respiration: {
                        input: "respiration-measurement-po",
                        radio: "respiration-radio-po",
                        fields: "respirationFields"
                    },
                    pulseOximetry: {
                        input: "po-concentration-po",
                        radio: "po-radio-po",
                        fields: "poFields"
                    },
                    height: {
                        input: "height-value-po",
                        radio: "height-radio-po",
                        fields: "heightQuality"
                    },
                    weight: {
                        input: "weight-value-po",
                        radio: "weight-radio-po",
                        fields: "weightFields"
                    },
                    circumferenceGirth: {
                        input: "cg-value-po",
                        radio: "cg-radio-po",
                        fields: "cgFields"
                    }
                },
                inputDisableHandler: function(vitalName) {
                    var val = this.model.get(this.vitalsMapping[vitalName].input);

                    if (val) {
                        this.ui[this.vitalsMapping[vitalName].fields].trigger("control:disabled", false);
                        this.model.unset(this.vitalsMapping[vitalName].radio);
                        $('.' + this.vitalsMapping[vitalName].radio).trigger("control:disabled", true);
                    } else {
                        this.ui[this.vitalsMapping[vitalName].fields].trigger("control:disabled", true);
                        $('.' + this.vitalsMapping[vitalName].radio).trigger("control:disabled", false);
                    }
                },
                radioDisableHandler: function(vitalName) {
                    var val = this.model.get(this.vitalsMapping[vitalName].radio);

                    if (val) {
                        this.ui[this.vitalsMapping[vitalName].fields].trigger("control:disabled", true);
                    }
                },
                modelEvents: {
                    'change:bp-value-po': function() {
                        this.inputDisableHandler("bloodPressure");
                    },
                    'change:bp-radio-po': function() {
                        this.radioDisableHandler("bloodPressure");
                    },
                    'change:temperature-value-po': function() {
                        this.inputDisableHandler("temperature");
                    },
                    'change:temperature-radio-po': function() {
                        this.radioDisableHandler("temperature");
                    },
                    'change:pulse-value-po': function() {
                        this.inputDisableHandler("pulse");
                    },
                    'change:pulse-radio-po': function() {
                        this.radioDisableHandler("pulse");
                    },
                    'change:respiration-measurement-po': function() {
                        this.inputDisableHandler("respiration");
                    },
                    'change:respiration-radio-po': function() {
                        this.radioDisableHandler("respiration");
                    },
                    'change:po-concentration-po': function() {
                        this.inputDisableHandler("pulseOximetry");
                    },
                    'change:po-radio-po': function() {
                        this.radioDisableHandler("pulseOximetry");
                    },
                    'change:height-value-po': function() {
                        this.inputDisableHandler("height");
                    },
                    'change:height-radio-po': function() {
                        this.radioDisableHandler("height");
                    },
                    'change:weight-value-po': function() {
                        this.inputDisableHandler("weight");
                    },
                    'change:weight-radio-po': function() {
                        this.radioDisableHandler("weight");
                    },
                    'change:pain-value-po': function() {
                        var val = this.model.get('pain-value-po');

                        if (val) {
                            this.model.unset('pain-radio-po');
                            $('.pain-radio-po').trigger("control:disabled", true);
                            this.model.unset('pain-checkbox-po');
                        } else {
                            if (!this.model.get('pain-checkbox-po')) {
                                $('.pain-radio-po').trigger("control:disabled", false);
                            }
                        }
                    },
                    'change:pain-checkbox-po': function() {
                        var val = this.model.get('pain-checkbox-po');

                        if (val) {
                            this.model.unset('pain-radio-po');
                            $('.pain-radio-po').trigger("control:disabled", true);
                            this.model.unset('pain-value-po');
                        } else {
                            if (!this.model.get('pain-value-po')) {
                                $('.pain-radio-po').trigger("control:disabled", false);
                            }
                        }
                    },
                    'change:pain-radio-po': function() {
                        var val = this.model.get('pain-radio-po');

                        if (val) {
                            $('.pain-radio-po').trigger("control:disabled", false);
                            this.model.unset('pain-value-po');
                            this.model.unset('pain-checkbox-po');
                        }
                    },
                    'change:cg-value-po': function() {
                        this.inputDisableHandler("circumferenceGirth");
                    },
                    'change:cg-radio-po': function() {
                        this.radioDisableHandler("circumferenceGirth");
                    }
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                title: "Enter Vitals",
                showProgress: false,
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
                    view: formView,
                    viewModel: formModel,
                    stepTitle: 'Step 1'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        }
    };
    return F423;
});