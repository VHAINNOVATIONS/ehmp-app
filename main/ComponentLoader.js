var dependencies = [
    "backbone",
    "marionette",
    "main/AppletBuilder",
    "main/components/patient/patientSearchView",
    "main/components/patient/patientHeaderView",
    "main/components/navigation/navigationView",
    "main/components/nav/navView",
    "main/components/adk_nav/navView",
    "main/components/applet-tester-nav/navView",
    "main/components/blankNav/navView",
    "main/components/footer/footerView",
    "main/components/navSearch/navView",
    "main/components/applet_header/navView",
    "main/components/patient/patientSidebarInfoView",
    "api/UserDefinedScreens"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, AppletBuilder, PatientSearchView, PatientHeaderView, NavigationView,
                               NavView, AdkNavView, TesterNavView, BlankNavView, FooterView, NavSearchView, AppletNavigationView, PatientSidebarInfoView,
                               UserDefinedScreens) {

    var ComponentLoader = {};

    ComponentLoader.load = function(marionetteApp, TopRegionView, CenterRegionView, screenConfig, patient) {

        var region;
        var screenConfigModel = new Backbone.Model(screenConfig);

        //Load Top Region
        region = TopRegionView.header_region;
        if (screenConfig.appHeader == "nav") {
            loadComponent(region, NavView);
        } else if (screenConfig.appHeader == "adkNav") {
            loadComponent(region, AdkNavView);
        } else if (screenConfig.appHeader == "searchNav") {
            loadComponent(region, NavSearchView);
        } else if (screenConfig.appHeader == "appletTesterNav") {
            loadComponent(region, TesterNavView);
        } else if (screenConfig.appHeader == "blankNav") {
            loadComponent(region, BlankNavView);
        } else if (screenConfig.appHeader == "none") {
            region.empty();
        } else {
            loadComponent(region, NavView);
        }

        if (screenConfig.patientRequired === true) {
            region = TopRegionView.patientDemographic_region;
            if (region.currentView === undefined || !(region.currentView instanceof PatientHeaderView)) {
                region.show(new PatientHeaderView({
                    model: patient
                }));
            }
            
            if (TopRegionView.navigation_region.currentView === undefined ||
                !(TopRegionView.navigation_region.currentView instanceof AppletNavigationView)) {

                UserDefinedScreens.getScreensConfig().done(function(screenConfig){
                    var showGlobalDatepicker = (typeof screenConfig.globalDatepicker === "undefined" ? true : screenConfig.globalDatepicker);
                    screenConfigModel.set("screens", screenConfig.screens);
                    TopRegionView.navigation_region.show(new AppletNavigationView({
                        model: screenConfigModel,
                        globalDatepicker: showGlobalDatepicker
                    }));
                });
            }
        }

        //Load Bottom Region
        region = marionetteApp.bottomRegion;
        if (screenConfig.appFooter == "footer") {
            loadComponent(region, FooterView.getView());
        } else if (screenConfig.appHeader == "none") {
            region.empty();
        } else {
            loadComponent(region, FooterView.getView());
        }

        //Load Left Region
        if (screenConfig.content_left && screenConfig.content_left != "none" && screenConfig.contentRegionLayout === 'fixed_left') {
            region = CenterRegionView.content_sidebarLeft_region;

            if (screenConfig.appLeft == "patientSearch") {
                loadComponent(region, PatientSearchView);
            } else if (screenConfig.appLeft == "patientInfo") {
                if (region.currentView === undefined || !(region.currentView instanceof PatientSidebarInfoView)) {
                    region.show(new PatientSidebarInfoView({
                        model: patient
                    }));
                }
            } else {
                if (region.currentView === undefined || !(region.currentView instanceof PatientSidebarInfoView)) {
                    region.show(new PatientSidebarInfoView({
                        model: patient
                    }));
                }
            }
        }

    };

    function loadComponent(region, View) {
        if (region.currentView === undefined || !(region.currentView instanceof View)) {
            region.show(new View());
        }
    }

    return ComponentLoader;
}