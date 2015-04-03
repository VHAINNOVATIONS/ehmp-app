define(function() {
    'use strict';
    var screenConfig = {
        id: 'clinical-reminders-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'clinical_reminders',
            title: 'Clinical Reminders',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        patientRequired: true
    };

    return screenConfig;
});
