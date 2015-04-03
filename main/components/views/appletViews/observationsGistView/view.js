var dependencies = [
    'jquery',
    'underscore',
    'main/components/applets/baseDisplayApplet/view',
    'main/components/views/appletViews/observationsGistView/views/observationsGistView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies($, _, BaseDisplayApplet, ObservationsGist) {
    'use strict';

    // this.appletOptions = {
    //      filterFields
    //      filterDateRangeField
    //      collection
    //      onClickAdd              : method
    //
    //      refresh                 : method (optional overwrite)
    //      appletConfig            : {id, instanceId, fullscreen}
    // }

    var baseDisplayApplet = BaseDisplayApplet;

    var ObservationsGistView = BaseDisplayApplet.extend({
        initialize: function(options) {
            console.log("ObservationsGistView Initialize");
            this._base = baseDisplayApplet.prototype;
            if (!this.options.appletConfig) {
                this.options.appletConfig = {};
                this.options.appletConfig.id = this.appletOptions.appletConfig.id;
                this.options.appletConfig.instanceId = this.appletOptions.appletConfig.instanceId;
                this.options.appletConfig.fullScreen = false;
                this.appletConfig = this.options.appletConfig;
            }

            var appletOptions = this.appletOptions || {}; //Set in extending view
            this.appletOptions = appletOptions;
            this.appletOptions.appletConfig = this.options.appletConfig;

            this.appletOptions.AppletView = ObservationsGist.getView();
            this._base.initialize.apply(this, arguments);
        }
    });

    return ObservationsGistView;
}
