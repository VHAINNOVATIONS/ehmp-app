'use strict';
define(function() {
    var screensManifest = {
        defaultScreen: 'overview',
        logonScreen: 'logon-screen',
        patientSearchScreen: 'patient-search-screen',
        ssoLogonScreen: 'sso'
    };

    var screens = [];

    screens.push({
        routeName: 'logon-screen',
        fileName: 'LogonScreen'
    });
    screens.push({
        routeName: 'patient-search-screen',
        fileName: 'PatientSearch'
    });
    screens.push({
        routeName: 'medication-review',
        fileName: 'MedicationReview'
    });
    screens.push({
        routeName: 'vital-list',
        fileName: 'VitalList'
    });
    screens.push({
        routeName: 'clinical-reminders-full',
        fileName: 'ClinicalRemindersFull'
    });
    screens.push({
        routeName: 'appointments-full',
        fileName: 'AppointmentsFull'
    });
    screens.push({
        routeName: 'immunizations-full',
        fileName: 'ImmunizationsFull'
    });
    screens.push({
        routeName: 'reports-full',
        fileName: 'ReportsFull'
    });
    screens.push({
        routeName: 'lab-results-grid-full',
        fileName: 'LabResultsGridFull'
    });
    screens.push({
        routeName: 'cover-sheet',
        fileName: 'CoverSheet'
    });
    screens.push({
        routeName: 'cover-sheet-gridster',
        fileName: 'CoverSheetGridster'
    });
    screens.push({
        routeName: 'allergy-grid-full',
        fileName: 'AllergyGridFull'
    });
    screens.push({
        routeName: 'documents-list',
        fileName: 'Documents'
    });
    screens.push({
        routeName: 'record-search',
        fileName: 'RecordSearch'
    });
    screens.push({
        routeName: 'problems-full',
        fileName: 'ProblemsGridFull'
    });
    screens.push({
        routeName: 'orders-full',
        fileName: 'OrdersFull'
    });
    screens.push({
        routeName: 'news-feed',
        fileName: 'NewsFeed'
    });
    screens.push({
        routeName: 'vitals-full',
        fileName: 'VitalsFull'
    });
    screens.push({
        routeName: 'visit-select',
        fileName: 'VisitSelection'
    });
    // MODAL TEST CODE
    screens.push({
        routeName: 'modal-test',
        fileName: 'ModalTest'
    });
    screens.push({
        routeName: 'add-nonVA-med',
        fileName: 'AddNonVAMed'
    });
    screens.push({
        routeName: 'add-vitals',
        fileName: 'AddVitals'
    });
    screens.push({
        routeName: 'add-lab-order',
        fileName: 'AddLabOrder'
    });
    screens.push({
        routeName: 'problems-add-edit',
        fileName: 'ProblemsAddEdit'
    });
    screens.push({
        routeName: 'ccd-list-full',
        fileName: 'CCDListFull'
    });
    screens.push({
        routeName: 'add-order',
        fileName: 'AddOrder'
    });
    screens.push({
        routeName: 'overview',
        fileName: 'Overview'
    });
    screens.push({
        routeName: 'cds-advice-full',
        fileName: 'CDSAdviceFull'
    });
    screens.push({
        routeName: 'sso',
        fileName: 'ssoLogonScreen'
    });

    screensManifest.screens = screens;

    return screensManifest;
});
