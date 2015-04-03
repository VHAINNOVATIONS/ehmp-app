var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "main/components/applet_chrome/chromeView",
    "main/Utils"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, ChromeView, Utils) {
    'use strict';
    var AppletControllerView = Backbone.Marionette.LayoutView.extend({
        template: _.template('<div class="gridContainer"><div>'),
        regions: {
            appletRegion: '.gridContainer'
        },
        initialize: function(options) {
            var self = this;
            this.options = options;
            this.setView(this.viewType);
        },
        onShow: function() {
            //this.showViewType(this.viewType);
            this.showView();
        },
        /**
         *  Grabbing the config for the specified view type from the applet's viewType array
         *  example config:
         *      {type: 'gist', view: AppletGistView ...}
         *  creating a new instance of the viewType's 'view' and showing it inside 'appletRegion'
         *
         *  @param {String} viewType   (ex: 'gist')
         */
        showViewType: function(viewType) {
            var viewConfig = Utils.appletViewTypes.getViewTypeConfig(this.options, viewType);
            if (!_.isUndefined(viewConfig)){
                this.appletRegion.show(new viewConfig.view(this.options));
            } else if (this.options.defaultView){ //REMOVE
                this.appletRegion.show(new this.options.defaultView(this.options));
            } else {
                console.log("View Type: '" + viewType + "' is not available for the " + this.options.appletConfig.id + " applet.");
            }
        },
        showView: function(viewType) {
            this.appletRegion.show(this.currentView);
        },
        setView: function(viewType) {
            var viewConfig = Utils.appletViewTypes.getViewTypeConfig(this.options, viewType);
            if (!_.isUndefined(viewConfig)){
                this.currentView = new viewConfig.view(this.options);
            } else if (this.options.defaultView){ //REMOVE
                this.currentView = new this.options.defaultView(this.options);
            } else {
                console.log("View Type: '" + viewType + "' is not available for the " + this.options.appletConfig.id + " applet.");
            }
        }
    });

    return AppletControllerView;
}