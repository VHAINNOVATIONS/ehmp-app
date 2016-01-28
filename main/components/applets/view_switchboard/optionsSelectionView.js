define([
    'backbone',
    'jquery',
    'underscore',
    'handlebars',
    'gridster',
    'api/Messaging',
    'api/UserDefinedScreens',
    'main/api/WorkspaceFilters',
    'api/ResourceService',
    'api/SessionStorage',
    'main/components/views/appletViews/TileSortManager'
], function(Backbone, $, _, Handlebars, Gridster, Messaging, UserDefinedScreens, WorkspaceFilters, ResourceService, SessionStorage, TileSortManager) {
    'use strict';

    function saveGridsterAppletsConfig(callback) {
        var $gridsterEl = $(".gridster");
        if ($('#gridster2').length)
            $gridsterEl = $('#gridster2');
        var screen = Messaging.request('get:current:screen').id;
        var appletsConfig = UserDefinedScreens.serializeGridsterScreen($gridsterEl, screen);
        if (callback)
            UserDefinedScreens.saveGridsterConfig(appletsConfig, screen, callback);
        else
            UserDefinedScreens.saveGridsterConfig(appletsConfig, screen);
    }


    function getViewTypeDisplay(type) {
        //'trend' views were originally called 'gist' view.
        //The name displayed in the UI was changed to 'trend' on 2/25/2015
        //However, currently (as of 2/25/2015) all other references are still to the 'gist' view
        if (type === "gist") {
            return "trend";
        } else {
            return type;
        }
    }

    function removeNonStandardViews(collection) {
        var filteredCollection = collection;
        _.each(filteredCollection.models, function(model) {
            if (model.get('type') !== 'gist' && model.get('type') !== 'trend' && model.get('type') !== 'summary' && model.get('type') !== 'expanded') {
                filteredCollection.remove(model);
            }
        });
        return filteredCollection;
    }

    var NoSwitchView = Backbone.Marionette.ItemView;

    var SingleViewType = Backbone.Marionette.ItemView.extend({
        tagName: 'li',
        className: 'viewType-optionsBox col-xs-3',
        initialize: function() {
            var displayType = getViewTypeDisplay(this.model.get('type'));
            this.template = Handlebars.compile('<div id="view-option" class="options-box {{type}}" tabindex="0" data-viewtype="{{type}}"></div><div class="formatButtonText">' + displayType + ' View</div>');

            var offset = this.model.get('paddingOffset');
            if (offset !== 0 && !_.isUndefined(offset)) {
                this.$el.addClass("col-xs-offset-" + offset);
            }
        }
    });
    var OptionsSelectionView = Backbone.Marionette.CollectionView.extend({
        initialize: function(options) {
            this.appletController = options.appletController;

            this.displayRegion = options.region;
            if (options.appletChrome) {
                this.appletChrome = options.appletChrome;
            }
            this.containerRegion = this.options.containerRegion || this.displayRegion;
            this.appletConfig = options.appletConfig;
            this.appletId = options.appletId;
            this.workspaceId = Messaging.request('get:current:screen').config.id;
            this.onChangeView = options.onChangeView;
            if (options.switchOnClick === undefined) {
                this.switchOnClick = true;
            } else {
                this.switchOnClick = options.switchOnClick;
            }
            if (options.appletTitle !== undefined) {
                this.appletTitle = options.appletTitle;
            }

            this.collection = new Backbone.Collection(Messaging.getChannel(this.appletId).request('viewTypes'));
            this.collection = removeNonStandardViews(this.collection);
            this.collection.comparator = function(model) {
                var type = model.get('type');
                var orderNum;
                switch (type.toLowerCase()) {
                    case 'gist':
                        orderNum = 1;
                        break;
                    case 'trend':
                        orderNum = 1;
                        break;
                    case 'summary':
                        orderNum = 2;
                        break;
                    case 'expanded':
                        orderNum = 3;
                        break;
                    default:
                        orderNum = 10;
                }
                return orderNum;
            };
            this.collection.sort();

            switch (this.collection.length) {
                case 1:
                    this.collection.models[0].set('paddingOffset', 3);
                    break;
                case 2:
                    this.collection.models[0].set('paddingOffset', 1);
                    break;
                default:
                    this.collection.models[0].set('paddingOffset', 0);
            }
        },
        events: {
            'click .viewType-optionsBox': 'changeView',
            'click .remove-applet-option-box': 'removeApplet'
        },
        removeApplet: function() {
            var self = this;
            var gridster = this.returnGridster();

            this.$el.parent().html('');

            var removeAllGraphs = function() {

                //if no stacked graph for this applet, do nothing
                if (!UserDefinedScreens.hasStackedGraphForApplet(self.workspaceId, self.appletConfig.instanceId))
                    return;
                var fetchOptions = {
                    resourceTitle: 'user-defined-stack-all',
                    fetchType: 'DELETE',
                    criteria: {
                        id: self.workspaceId,
                        instanceId: self.appletConfig.instanceId
                    }
                };
                ResourceService.fetchCollection(fetchOptions);
                ADK.UserDefinedScreens.removeAllStackedGraphFromSession(self.workspaceId, self.appletConfig.instanceId);
            };

            //remove region from gridster
            if (gridster !== null && gridster !== undefined) { //this if is just for the screens that aren't gridster
                gridster.remove_widget($(this.containerRegion.el), function() {
                    saveGridsterAppletsConfig(function() {
                        //Remove persisted graphed items from JDS for stack graph applet
                        if (self.appletConfig.id === 'stackedGraph') {
                            removeAllGraphs();
                        } else {
                            var instanceId = self.appletConfig.instanceId + '_' + self.appletId;
                            TileSortManager.removeSort(instanceId, function() {
                                WorkspaceFilters.removeAllFiltersFromApplet(self.workspaceId, self.appletConfig.instanceId);
                            });
                        }
                    });
                });
            }
            if (this.onChangeView) {
                this.onChangeView();
            }


            SessionStorage.clearAppletStorageModel(this.appletConfig.instanceId);
            SessionStorage.clearAppletStorageModel(this.appletConfig.id);


        },
        returnGridster: function() {
            if (this.switchOnClick) {
                return $('.gridster').data('gridster');
            }
            return $('#gridster2 ul').gridster().data('gridster');
        },
        changeView: function(e) {
            var gridster = this.returnGridster();
            var self = this;
            var viewType = $(e.currentTarget).find(".options-box").attr('data-viewtype');
            var model = this.collection.find(function(model) {
                return model.get('type') == viewType;
            });
            if (this.switchOnClick) {
                this.appletController.changeView(viewType);
                $(this.displayRegion.el).attr('data-view-type', viewType);
            } else {
                var displayType = getViewTypeDisplay(model.get('type'));
                var appletHtml = '<div class="edit-applet fa fa-cog"></div><br><div class="formatButtonText"><p class="applet-title">' + this.appletTitle + '</p>' + displayType + '</div>';
                appletHtml += '<span class="gs-resize-handle gs-resize-handle-both"></span><span class="gs-resize-handle gs-resize-handle-both"></span>';
                NoSwitchView = NoSwitchView.extend({
                    template: _.template(appletHtml)
                });
                this.displayRegion.show(new NoSwitchView());
                this.displayRegion.$el.removeClass('bringToFront');
            }
            var callback = function() {
                if (self.onChangeView) {
                    self.onChangeView();
                }
                saveGridsterAppletsConfig();
            };
            $(this.containerRegion.el).attr('data-view-type', viewType);
            var regularMaxSize = [8, 12];
            if (viewType === "summary") {
                gridster.resize_widget($(this.containerRegion.el), 4, 4, callback);
                gridster.set_widget_max_size($(this.containerRegion.el), regularMaxSize);
            } else if (viewType === "expanded") {
                var expandedMaxSize = [12, 12];
                gridster.resize_widget($(this.containerRegion.el), 8, 6, callback);
                gridster.set_widget_max_size($(this.containerRegion.el), expandedMaxSize);
            } else if (viewType === "gist") {
                gridster.resize_widget($(this.containerRegion.el), 4, 3, callback);
                gridster.set_widget_max_size($(this.containerRegion.el), regularMaxSize);
            }
        },
        addLi: function(collectionView, buffer, options) {
            collectionView.$el.append(buffer).append('<li class="col-xs-' + options.width + ' ' + options.divClass + '-box"><div tabstop="0" tabindex="0" role="button" class="options-box ' + options.divClass + '" data-viewtype="' + options.dataViewType + '"><i class="' + options.iconClass + '"></i><span class="sr-only">' + options.buttonText + '</span></div><div class="formatButtonText">' + options.buttonText + '</div></li>');
        },
        attachBuffer: function(collectionView, buffer) {
            this.addLi(collectionView, buffer, {
                width: 2,
                divClass: 'remove-applet-option',
                dataViewType: 'removeApplet',
                iconClass: 'fa fa-trash-o',
                buttonText: 'Remove'
            });
        },
        tagName: 'ul',
        className: 'options-panel col-xs-12',
        onRender: function() {},
        childView: SingleViewType
    });

    Messaging.reply('switchboard : display', function(options) {
        return new OptionsSelectionView(options);
    });
    return OptionsSelectionView;

});