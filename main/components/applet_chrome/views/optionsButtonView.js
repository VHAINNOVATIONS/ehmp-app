var dependencies = [
    'jquery',
    'underscore',
    'hbs!main/components/applet_chrome/templates/optionsButtonTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies($, _, optionsButtonTemplate) {
    'use strict';
    var OptionsButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: optionsButtonTemplate
        // getTemplate: function() {
        //     //if you are on full screen or a non-gridster screen, dont show the cog
        //     if (this.model.attributes.appletConfig.fullScreen || ($('.gridster').length === 0)) {
        //         return _.template('');
        //     } else {
        //         return optionsButtonTemplate;
        //     }
        // }
    });
    return OptionsButtonView;
}