define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {
    'use strict';

    var CollapsibleContainer = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile([
            '<div class="row">',
                '<div class="well well-collapse">',
                    '<div class="collapsibleContainerHeader">',
                        '<div class="col-xs-11 collapsibleContainerHeaderRegion">',
                            '<div class="header-content"></div>',
                        '</div>',
                        '<div class="col-xs-1">',
                            '{{#if collapse}}',
                                '<button id="collapsibleContainerTrigger" class="btn btn-sm btn-icon collapsed left-margin-md top-margin-md" title="Press enter to expand or collapse" type="button" data-collapse-button="true"></button>',
                            '{{/if}}',
                        '</div>',
                    '</div>',
                    '<div class="collapsibleContainerCollapseRegion">',
                        '<div class="col-xs-12 collapse-content collapse"></div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('\n')),
        className: 'collapsible-container-component',
        events: {
            'click @ui.CollapsibleTrigger':function(e){
                e.preventDefault();
                this.ui.CollapseRegionContainer.collapse('toggle');
                this.ui.ToggleButton.toggleClass('collapsed');
            }
        },
        ui: {
            'HeaderRegionContainer': '.collapsibleContainerHeaderRegion > .header-content',
            'CollapseRegionContainer': '.collapsibleContainerCollapseRegion > .collapse-content',
            'CollapsibleTrigger': '#collapsibleContainerTrigger',
            'ToggleButton': 'button#collapsibleContainerTrigger'
        },
        regions: {
            'HeaderRegion': '@ui.HeaderRegionContainer',
            'CollapseRegion': '@ui.CollapseRegionContainer'
        },
        initialize: function(options) {
            this.collapsibleContainerHeaderOptions = options.headerItems;
            this.collapsibleContainerCollapseOptions = options.collapseItems;
            this.name = options.name || '';

            this.uid = this.name.replace(/[^A-Z0-9]+/ig, "-");
        },
        onRender: function(){
            this.bindUIElements();
        },
        onBeforeShow: function() {
            this.headerView = this.collapsibleContainerHeaderOptions.view;
            if (!_.isFunction(this.headerView.initialize)) {
                this.headerView = new this.headerView();
            }

            this.collapseView = this.collapsibleContainerCollapseOptions.view;
            if (!_.isFunction(this.collapseView.initialize)) {
                this.collapseView = new this.collapseView();
            }

            this.$el.find('#collapsibleContainerTrigger').attr('data-target', '#collapsibleContainerCollapseRegion-' + this.uid);

            this.$el.find('.collapsibleContainerCollapseRegion').attr('id', 'collapsibleContainerCollapseRegion-' + this.uid);

            this.showChildView('HeaderRegion', this.headerView);
            this.showChildView('CollapseRegion', this.collapseView);
        },
        serializeData: function() {
            var data = {
                collapse: true
            };
            if (!(_.isFunction(this.collapsibleContainerCollapseOptions.view))) {
                data.collapse = (this.collapsibleContainerCollapseOptions.view.collection.length > 0) ? true : false;
            }
            return data;
        }
    });

    return CollapsibleContainer;
});
