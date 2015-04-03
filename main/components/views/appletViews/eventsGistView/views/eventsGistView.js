var dependencies = [
    "jquery",
    "underscore",
    "main/Utils",
    "main/ADK",
    "backbone",
    "highcharts",
    "main/components/views/appletViews/eventsGistView/views/eventsBarGraphConfiguration",
    "hbs!main/components/views/appletViews/eventsGistView/templates/eventsGistLayout",
    "hbs!main/components/views/appletViews/eventsGistView/templates/eventsGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging",
    "main/components/appletToolbar/toolbarView"
];
define(dependencies, onResolveDependencies);

/**
 *
 * An Events Gist defining characteristic is its bar graph that shows events related to a particular group of items.
 *
 * For example:
 *
 * For the problems applet, we want an Events Gist that groups all the problems by their description.  Each grouping will
 * have a graph that shows the number of Encounters related to that particular problem over time.
 *
 *
 * Name     acuity    comment Indicator     document Indicator   #of Items in Graph      Bar Graph      age of most recent Item
 *
 *
 *
 * The following options can be used to influence the behavior of the view:
 *
 *
 * gistHeaders[] - Defaults to [Description, Acuity,'','','','', Age].  Changing this changes the column headers of the Gist View.
 *
 *
 */
function onResolveDependencies($, _, Utils, ADK, Backbone, highcharts, EventGistGraph, eventsGistLayoutTemplate, eventsGistChildTemplate, PopoverTemplate, ResourceService, Messaging, ToolbarView) {
    'use strict';
    var AppletID = null;
    var CurrentPopover = null;


    var EventGistItem = Backbone.Marionette.ItemView.extend({
        template: eventsGistChildTemplate,
        className: 'gistItem',
        chartPointer: null,
        events: {
            'click button.groupItem': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            },
            'click .highcharts-container': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.$el.find('[data-toggle=popover]').trigger('click');
            },
            'click .quickviewOverlay': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.$el.find('[data-toggle=popover]').trigger('click');
            },
            'click .info-display': function(event) {
                $('[data-toggle=popover]').popover('hide');
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        },
        showPopover: function(evt, popoverElement) {
            console.log("clicked");
            evt.stopPropagation();
            $('[data-toggle=popover]').not(popoverElement).popover('hide');
            popoverElement.popover('toggle');
            var selectedGistItem = $(this.el);
            var widthAdjust = selectedGistItem.width() * 0.75;
            var leftAdjust = selectedGistItem.offset().left;
            var widthPxDiff = selectedGistItem.width() - widthAdjust;
            var offsetLeftToCenter = selectedGistItem.offset().left + (widthPxDiff * 0.5);
            $('.gistPopover').css('left', offsetLeftToCenter.toString() + "px");
            $('.gistPopover').width(widthAdjust);


        },
        createPopover: function() {
            var self = this;
            var PopoverView = Backbone.Marionette.ItemView.extend({
                template: PopoverTemplate
            });
            this.$el.find('[data-toggle=popover]').popover({
                trigger: 'manual',
                html: 'true',
                container: 'body',
                template: (new PopoverView().template()),
                placement: 'bottom'
            }).click(function(evt) {
                self.showPopover(evt, $(this));
            }).focus(function(evt) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
                $(this).keyup(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (e.keyCode === 13 || e.keyCode === 32) {
                        self.showPopover(evt, $(this));
                    }
                });

            });
        },
        onDomRefresh: function() {
            //highcharts can't be rendered without the dom being completely loaded.
            //render highcharts
            var config = this.options.binningOptions;
            var chartConfig = new EventGistGraph(this.model.get('graphData'));
            this.chartPointer = $('#graph_' + this.model.get('id'));
            if (config) {
                config.chartWidth = (this.chartPointer).width();
                chartConfig.series[0].data = Utils.chartDataBinning(this.model.get('graphData'), config);
            }
            this.chartPointer.highcharts(chartConfig);
            this.createPopover();
        },
        onBeforeDestroy: function() {
            if (this.chartPointer && this.chartPointer.length > 0) {
                var chart = this.chartPointer.highcharts();
                if (chart) {
                    chart.destroy();
                }
            }
        },
        initialize: function() {
            //this.toolbar = new ToolbarView({targetElement:this});
            //this.toolbar.render();
        },
        onRender: function() {
            this.toolbar = new ToolbarView({
                targetElement: this
            });
        }
    });

    var EventGist = Backbone.Marionette.CompositeView.extend({
        template: eventsGistLayoutTemplate,
        childView: EventGistItem,
        emptyView: Backbone.Marionette.ItemView.extend({
            template: _.template('<div class="emptyGistList">No Records Found</div>')
        }),
        events: {
            'click .header': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                $('[data-toggle=popover]').popover('hide');
                this.sortCollection($(event.target));
            },
            'focus .header': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                $('[data-toggle=popover]').popover('hide');
                var currentHeaderFocus = $(event.target);
                var self = this;
                currentHeaderFocus.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        console.log("key pressed");
                        self.sortCollection(currentHeaderFocus);
                    }
                });
            },
        },
        initialize: function(options) {
            this._super = Backbone.Marionette.CompositeView.prototype;
            AppletID = getAppletId(options);
            this.childViewOptions = {
                AppletID: AppletID,
                binningOptions: options.binningOptions
            };
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };
            this.collection = options.collection;
            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model();
            this.model.set('gistHeaders', options.gistHeaders || {
                name: '',
                description: '',
                grapic: 'Dose',
                age: 'Age',
                count: 'Count'
            });
            this.gistModel = options.gistModel;
            this.model.set('appletID', AppletID);
            this.childViewContainer = "#" + AppletID + "-event" + "-gist-items";
            /*this.collection.on("reset", function() {
                    console.log("Gist ----->> Collection reset -->>GistView");
                    console.log(this.collection);
            }, this);*/
            //render the toolbar view

        },
        sortCollection: function(headerElement) {
            /* clear existing collection comparator to allow collection to rerender after sort */
            this.collection.comparator = null;
            if (headerElement.attr("sortable") === "true") {
                var nextSortOrder = '';
                switch (headerElement.attr("sortDirection")) {
                    case 'asc':
                        nextSortOrder = 'desc';
                        break;
                    case 'desc':
                        nextSortOrder = 'none';
                        break;
                    case 'none':
                        nextSortOrder = 'asc';
                        break;
                }
                this.$el.find('.header').attr("sortDirection", 'none');
                headerElement.attr("sortDirection", nextSortOrder);
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-up');
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-down');

                if (nextSortOrder === "asc") {
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').addClass('fa-caret-up');
                } else if (nextSortOrder === "desc") {
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').addClass('fa-caret-down');
                }

                if (nextSortOrder === 'none') {
                    Utils.CollectionTools.resetSort(this.collection);
                } else {
                    var sortType = headerElement.attr("sortType");
                    var key = headerElement.attr("sortKey");
                    Utils.CollectionTools.sort(this.collection, key, nextSortOrder, sortType);
                }
            }


        },
        onBeforeRender: function() {
            this.collection.reset(this.collectionParser(this.collection).models);
            _.each(this.collection.models, function(item) {
                _.each(this.gistModel, function(object) {
                    var id = object.id;
                    item.set(object.id, item.get(object.field));
                });
            }, this);
        },
        render: function() {
            this._super.render.apply(this, arguments);
        }
    });

    function getAppletId(options) {
        if (_.isUndefined(options.appletConfig.instanceId)) {
            if (_.isUndefined(options.appletConfig.gistSubName)) {
                return options.appletConfig.id;
            } else {
                return options.appletConfig.id + options.appletConfig.gistSubName;
            }
        } else {
            if (_.isUndefined(options.appletConfig.gistSubName)) {
                return options.appletConfig.instanceId;
            } else {
                return options.appletConfig.instanceId + options.appletConfig.gistSubName;
            }
        }
    }

    var EventGistView = {
        create: function(options) {
            var eventGistView = new EventGist(options);
            return eventGistView;
        },
        getView: function() {
            return EventGist;
        }
    };

    return EventGistView;
}