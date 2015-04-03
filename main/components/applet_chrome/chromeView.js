var dependencies = [
    'jquery',
    'underscore',
    'api/Messaging',
    'main/Utils',
    'api/Navigation',
    'api/ResourceService',
    'api/SessionStorage',
    'hbs!main/components/applet_chrome/templates/containerTemplate',
    'main/components/applet_chrome/views/addButtonView',
    'main/components/applet_chrome/views/exitOptionsButtonView',
    'main/components/applet_chrome/views/optionsButtonView',
    'main/components/applet_chrome/views/refreshButtonView',
    'main/components/applet_chrome/views/resizeView',
    'main/components/applet_chrome/views/filterButtonView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies($, _, Messaging, Utils, Navigation, ResourceService, SessionStorage, containerTemplate, AddButtonView, ExitOptionsButtonView, OptionsButtonView, RefreshButtonView, ResizeView, FilterButtonView) {
    'use strict';

    /*
     * options: {appletScreenConfig, AppletView, AppletController(optional)}
     */
    var ChromeLayoutView = Backbone.Marionette.LayoutView.extend({
        initialize: function(options) {
            if (this.appletScreenConfig.id === "")
                console.log(containerTemplate);
            this.appletScreenConfig = this.appletScreenConfig || options.appletScreenConfig;
            this.model = new Backbone.Model(this.appletScreenConfig);
            this.AppletView = this.AppletView || options.AppletView;

            if (this.AppletController) {
                this.viewToDisplay = new this.AppletController(options);
                this.appletView = this.viewToDisplay.currentView;
            } else {
                this.viewToDisplay = new this.AppletView(options);
                this.appletView = this.viewToDisplay;
            }

            if (this.appletView.eventMapper) {
                this.eventMapper = this.appletView.eventMapper;
            }

            //Create Resize Button View
            // - when applet has a maximizeScreen specified in the screen config
            if (this.model.has('maximizeScreen') || (this.model.has('fullScreen') && this.model.get('fullScreen') === true)) {
                this.resizeView = new ResizeView({
                    model: this.model
                });
            }

            //Create Filter Button View
            // - when the view being displayed has a filterDateRangeView or filterView
            if (this.appletView.hasOwnProperty('filterDateRangeView') || this.appletView.hasOwnProperty('filterView')) {
                this.filterButtonView = new FilterButtonView({
                    model: this.model
                });
            }

            //Create Add Button View
            // - if the view being displayed has a onClickAdd method
            if (this.appletView.hasOwnProperty('onClickAdd')) {
                this.addButtonView = new AddButtonView();
            }

            //Create the cog icon Options Button View
            // - don't show if on a fullScreen view or not a user defined workspace
            if ((!this.model.has('fullScreen') && ($('.gridster').length > 0)) && this.AppletController) {
                this.optionsButtonView = new OptionsButtonView();
                this.exitOptionsButtonView = new ExitOptionsButtonView();
            }

            //Create Refresh Button View
            if (this.refreshEnabled()) {
                this.refreshButtonView = new RefreshButtonView();
            }
        },
        onRender: function() {
            window.scrollTo(0, 0);
            this.appletDiv.show(this.viewToDisplay);

            if (this.filterButtonView) {
                this.chromeFilterButton.show(this.filterButtonView);
                this.addFilterOpenClass();
            }
            if (this.optionsButtonView) {
                this.chromeOptionsButton.show(this.optionsButtonView);
            }
            if (this.resizeView) {
                this.chromeResize.show(this.resizeView);
            }
            if (this.addButtonView) {
                this.chromeAddButton.show(this.addButtonView);
            }
            if (this.refreshButtonView) {
                this.chromeRefreshButton.show(this.refreshButtonView);
            }
        },
        template: containerTemplate,
        regions: {
            appletDiv: '.appletDiv_ChromeContainer',
            chromeContainer: '.chrome-container',
            chromeResize: '.grid-resize',
            chromeAddButton: '.grid-add-button',
            chromeOptionsButton: '.grid-options-button',
            chromeFilterButton: '.grid-filter-button',
            chromeRefreshButton: '.grid-refresh-button',
            chromeFooter: '.grid-footer',
            switchboardContainer: '.switchboard-container'
        },
        events: {
            'click .applet-maximize-button': 'expandApplet',
            'click .applet-minimize-button': 'minimizeApplet',
            'click .applet-refresh-button': function(event) {
                this.onClickButton("refresh", event);
            },
            'click .applet-add-button': function(event) {
                this.onClickButton("add", event);
            },
            'click .applet-options-button': 'displaySwitchboard',
            'click .applet-exit-options-button': 'closeSwitchboard'
        },
        refreshEnabled: function() {
            if (this.eventMapper && this.eventMapper.refresh) {
                var eventMethod = this.eventMapper.refresh;
                if (_.isFunction(this.appletView[eventMethod])) {
                    return true;
                }
            }
            return false;
        },
        expandApplet: function(event) {
            /* Remove any popover elements on the screen before expanding an applet bug fix*/
            $('.popover').popover('hide');

            Navigation.navigate(this.model.get('maximizeScreen'));
        },
        minimizeApplet: function(event) {
            Backbone.history.history.back();
        },
        onClickButton: function(type, event) {
            if (this.eventMapper && this.eventMapper[type] && type !== null) {
                var eventMethod = this.eventMapper[type];
                this.appletView[eventMethod](event);
            }
        },
        toggleClasses_SwitchBoard_show_hide: function() {
            this.$el.find(".grid-applet-heading").toggleClass("optionsPanelStyle panel-heading");
            this.$el.find(".grid-resize, .grid-filter, .grid-toolbar, .grid-add-button, .grid-filter-button, .grid-refresh-button").toggleClass("hide");

            if (this.$el.find(".panel-title").text().indexOf("- Select a View") > -1) {
                this.$el.find(".panel-title").text(this.model.attributes.title);
            } else {
                this.$el.find(".panel-title").text(this.model.attributes.title + " - Select a View");
            }
        },
        displaySwitchboard: function(event) {
            var switchboardOptions = {
                region: this.viewToDisplay.appletRegion,
                containerRegion: this.options.region,
                appletId: this.appletScreenConfig.id,
                appletConfig: this.options.appletConfig,
                switchOnClick: true,
                appletChrome: this
            };
            var SwitchboardView = Messaging.request('switchboard : display', switchboardOptions);

            this.switchboardContainer.show(SwitchboardView);
            this.chromeOptionsButton.show(this.exitOptionsButtonView, {
                preventDestroy: true
            });
            this.$el.find(".appletDiv_ChromeContainer").addClass("hide");
            this.$el.find(".switchboard-container").removeClass("hide");
            this.toggleClasses_SwitchBoard_show_hide();
        },
        closeSwitchboard: function() {
            this.chromeOptionsButton.show(this.optionsButtonView, {
                preventDestroy: true
            });
            this.switchboardContainer.reset();
            this.$el.find(".appletDiv_ChromeContainer").removeClass("hide");
            this.$el.find(".switchboard-container").addClass("hide");
            this.toggleClasses_SwitchBoard_show_hide();
        },
        addFilterOpenClass: function() {
            if (this.$el.find('#grid-filter-' + this.appletScreenConfig.id + ':not(.collapse)').length > 0) {
                this.filterButtonView.$el.find('button').addClass("filterOpen");
            }
        }
    });

    return ChromeLayoutView;
}