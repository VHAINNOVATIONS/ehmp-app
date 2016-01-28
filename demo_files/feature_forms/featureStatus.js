define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {

    return [{
        featureNumber: 226,
        title: "Enter and Review Fee Text Progress Notes",
        wireframe: "http://wakirc.axshare.com/#p=v1_-_free_text_progress_note_-_from_applet_pop-out",
        workflowPath: "http://10.1.1.150/ui-components/docs/workflow/psi8/workflow-notes.pdf",
        workflowSize: "1.2MB",
        useCaseScenarioPath: "http://10.1.1.150/ui-components/docs/use-case/psi8/f226-use-case-enter-plain-text-progress-notes.pdf",
        useCaseScenarioSize: "86KB",
        controls: ['timepicker','select_filtering','textarea','button','datepicker'],
        components: ['workflow','alert','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 413,
        title: "Encounters Workflow",
        wireframe: "http://wakirc.axshare.com/#p=v5_-_encounter_workflow__single_form_",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-encounters.pdf",
        workflowSize: "591KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/%20f413-use-case-encounters.pdf",
        useCaseScenarioSize: "152KB",
        controls: ['multiselectSideBySide','popover','checklist','select_filtering','nestedCommentBox', 'button', 'checkbox', 'select_showMultiple', 'input', 'fieldset', 'container_showingModelData', 'drilldownChecklist'],
        components: ['workflow','modal'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 423,
        title: "Enter & Store a Vital Tray",
        wireframe: "http://wakirc.axshare.com/#p=v3__enter___store_a_vital",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-enter-and-store-a-vital.pdf",
        workflowSize: "833KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/f423-use-case-%C2%ADenter-store-a-simple-vitals.pdf",
        useCaseScenarioSize: "140KB",
        controls: ['datepicker','timepicker','typeahead','collapsableContainer','select', 'button', 'radio', 'input_showUnit','input_chooseUnitRadio', 'fieldset', 'container_showingModelData'],
        components: ['workflow','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 432,
        title: "Enter & Store a Simple Lab Order Tray",
        wireframe: "http://wakirc.axshare.com/#p=v2__enter___store_a_simple_lab_order",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-enter-and-store-a-simple-lab-order.pdf",
        workflowSize: "601KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/f432-use-case-enter-and-store-simple-lab-order.pdf",
        useCaseScenarioSize: "167KB",
        controls: ['datepicker','timepicker','typeahead', 'select', 'button', 'radio', 'textarea', 'input', 'alertBanner', 'fieldset', 'container_showingModelData'],
        components: ['workflow','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 513,
        title: "Visit Management",
        wireframe: "http://wakirc.axshare.com/#p=v1_-_visit_management",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-visit-management.pdf",
        workflowSize: "338KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/f513-use-case-visit-management.pdf",
        useCaseScenarioSize: "194KB",
        controls: ['datepicker','timepicker','typeahead','tableSelectableRows','tabs', 'button', 'checkbox', 'fieldset', 'container_showingModelData'],
        components: ['workflow','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 360,
        title: "Enter and Store Immunizations",
        wireframe: "http://wakirc.axshare.com/#p=v4_1_-_enter_and_store_immunizations",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-enter-and-store-immunizations.pdf",
        workflowSize: "374KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/f360-use-case-enter-and-store-immunizations.pdf",
        useCaseScenarioSize: "154KB",
        controls: ['radio','select_filtering','select','button','datepicker','typeahead','input','container_showingModelData','select_selectMultiple','input_chooseUnitDropdown'],
        components: ['workflow','workflow_showProgressbar','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 414,
        title: "Record and Review Problem List",
        wireframe: "http://wakirc.axshare.com/#p=v4_-_record_and_review_problem_list",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-record-and-review-problem-list.pdf",
        workflowSize: "958KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/f414-use-case-enter-record-review-problem-list.pdf",
        useCaseScenarioSize: "151KB",
        controls: ['checkbox','input_showCharacterCount','alertBanner','radio','yesNoChecklist','commentBox','select','button','datepicker','select_dynamicFetching','input','container_showingModelData'],
        components: ['workflow','workflow_showProgressbar','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 420,
        title: "Enter and Store Allergies",
        wireframe: "http://wakirc.axshare.com/#p=v3_-_enter_and_store_allergies",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-allergies.pdf",
        workflowSize: "727KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/f420-use-case-%C2%ADenter-store-allergies.pdf",
        useCaseScenarioSize: "152KB",
        controls: ['radio','timepicker','select_filtering','multiselectSideBySide','button','textarea','datepicker','select'],
        components: ['workflow','growlNotifications','alert'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 433,
        title: "Enter and Store Pharmacy (Medication) Orders",
        wireframe: "http://wakirc.axshare.com/#p=v3_-_enter_and_store_pharmacy__medication__orders",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-pharmacy-orders.pdf",
        workflowSize: "635KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/f433-use-case-enter-and-store-pharmacy-orders.pdf",
        useCaseScenarioSize: "107KB",
        controls: ['radio','checkbox','select','textarea','typeahead','select_filtering','button','dropdown','container_showingModelData','alertBanner','input'],
        components: ['workflow','workflow_showProgressbar','alert','growlNotifications'],
        notes: "Alert Needs to support multiple alerts shown at once.",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 568,
        title: "eSignature Modal",
        wireframe: "http://wakirc.axshare.com/#p=v2_-_esignature_modal",
        workflowPath: "http://10.1.1.150/UI-Components/docs/workflow/psi8/workflow-e-signature-modal.pdf",
        workflowSize: "465KB",
        useCaseScenarioPath: "http://10.1.1.150/UI-Components/docs/use-case/psi8/f568-use-case-%C2%ADeSignature-modal.pdf",
        useCaseScenarioSize: "118KB",
        controls: ['input','checklist','toggleOptionsChecklist','button','container_showingModelData'],
        components: ['workflow','alert'],
        notes: "This is only a temporary example",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 170,
        title: "Vitals - Entered In Error",
        wireframe: "http://h352jh.axshare.com/#p=f170_vitals_-_entered_in_error_v_2",
        workflowPath: "tbd",
        workflowSize: "tbd",
        useCaseScenarioPath: "tbd",
        useCaseScenarioSize: "tbd",
        controls: ['input','checklist','toggleOptionsChecklist','button','container_showingModelData'],
        components: ['workflow','alert'],
        notes: "This is only a temporary example",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 431,
        title: "",
        wireframe: "",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['textarea','checkbox','select','timepicker','datepicker','textarea','select_filtering','button','commentBox','container_showingModelData','alertBanner','select_selectMultiple'],
        components: ['workflow'],
        notes: "",
        exampleForm: false,
        handOff: {
            trifecta: false,
            dev: false
        }
    }, {
        featureNumber: 457,
        title: "User Management Applet",
        wireframe: "http://h352jh.axshare.com/#p=user_management_applet",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['input','button','container_showingModelData', 'popover'],
        components: ['workflow'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: false,
            dev: false
        }
    }];
});
