'use strict';
var dependencies = [
    'backbone',
    'main/ADK',
    'jquery',
    'underscore',
    'gridster',
    'api/UserDefinedScreens'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, ADK, $, _, Gridster, UserDefinedScreens) {

    function saveGridsterAppletsConfig() {
        var $gridsterEl = $(".gridster");
        var screen = ADK.ADKApp.currentScreen.id;
        var appletsConfig = UserDefinedScreens.serializeGridsterScreen($gridsterEl, screen);
        UserDefinedScreens.saveGridsterConfig(appletsConfig, screen);
    }
    function getViewTypeDisplay(type){
        //'trend' views were originally called 'gist' view.
        //The name displayed in the UI was changed to 'trend' on 2/25/2015
        //However, currently (as of 2/25/2015) all other references are still to the 'gist' view
        if(type === "gist"){
            return "trend";
        } else {
            return type;
        }
    }
    function removeNonStandardViews(collection){
    	var filteredCollection = collection;
    	_.each(filteredCollection.models, function (model){
    		if(model.get('type') !== 'gist' && model.get('type') !== 'trend'  && model.get('type') !== 'summary'  && model.get('type') !== 'expanded' ){
    			filteredCollection.remove(model);
    		}
    	});
    	return filteredCollection;
    }

    var NoSwitchView = Backbone.Marionette.ItemView;

    var SingleViewType = Backbone.Marionette.ItemView.extend({
        tagName: 'li',
        className: 'viewType-optionsBox col-xs-3',
        initialize: function(){
            var displayType = getViewTypeDisplay(this.model.get('type'));
            this.template = _.template('<div class="options-box <%= type %>" data-viewtype="<%= type %>"></div><div class="formatButtonText">' + displayType + ' View</div>');
            var offset = this.model.get('paddingOffset');
            if(offset!==0 && !_.isUndefined(offset)){
                this.$el.addClass("col-xs-offset-" + offset);
            }
        }
    });
    var OptionsSelectionView = Backbone.Marionette.CollectionView.extend({
        initialize: function(options) {
            this.displayRegion = options.region;
            if (options.appletChrome){this.appletChrome = options.appletChrome;}
            this.containerRegion = this.options.containerRegion || this.displayRegion;
            this.appletConfig = options.appletConfig;
            this.appletId = options.appletId;
            this.onChangeView = options.onChangeView;
            if (options.switchOnClick === undefined) {
                this.switchOnClick = true;
            } else {
                this.switchOnClick = options.switchOnClick;
            }

            if (options.appletTitle !== undefined) {
                this.appletTitle = options.appletTitle;
            }

            this.collection = new Backbone.Collection(ADK.Messaging.getChannel(this.appletId).request('viewTypes'));
            this.collection = removeNonStandardViews(this.collection);
            this.collection.comparator = function(model) {
                var type = model.get('type');
                var orderNum;
                switch (type.toLowerCase()){
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

            switch(this.collection.length){
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
            'click .viewType-optionsBox': 'changeView'
        },
        changeView: function(e) {
            var gridster;
            var self = this;
            if (this.switchOnClick) {
                gridster = $('.gridster').gridster().data('gridster');
            } else {
                gridster = $('#gridster2 ul').gridster().data('gridster');
            }
            var viewType = $(e.currentTarget).find(".options-box").attr('data-viewtype');
            if (viewType === 'removeApplet') {
                $('.options-list').html('');
                //remove region from gridster
                if (gridster !== null && gridster !== undefined) { //this if is just for the screens that aren't gridster
                    gridster.remove_widget($(this.containerRegion.el), saveGridsterAppletsConfig);
                }
                if (self.onChangeView) {
                    self.onChangeView();
                }
                saveGridsterAppletsConfig();

            } else {
                var model = this.collection.find(function(model) {
                    return model.get('type') == viewType;
                });
                var AppletViewObject = model.get('view');

                if (this.switchOnClick) {
                    AppletViewObject = AppletViewObject.extend({
                        attributes: {
                            'data-appletid': this.appletConfig.id,
                            'data-instanceId': this.appletConfig.instanceId
                        }
                    });

                    this.appletConfig.region = this.displayRegion;
                    var newOptions = {
                        region: this.displayRegion,
                        appletConfig: this.appletConfig
                    };
                    this.displayRegion.show(new AppletViewObject(newOptions), {
                        preventDestroy: true
                    });
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

                if (this.appletChrome){
                    this.appletChrome.closeSwitchboard();
                }

                if (viewType === "summary") {
                    gridster.resize_widget($(this.containerRegion.el), 4, 4, callback);
                    $(this.displayRegion.el).attr('data-view-type', 'summary');
                } else if (viewType === "expanded") {
                    gridster.resize_widget($(this.containerRegion.el), 8, 6, callback);
                    $(this.displayRegion.el).attr('data-view-type', 'expanded');
                } else if (viewType === "gist") {
                    gridster.resize_widget($(this.containerRegion.el), 4, 3, callback);
                    $(this.displayRegion.el).attr('data-view-type', 'gist');
                }


            }
        },
        attachBuffer: function(collectionView, buffer) {
            collectionView.$el.append(buffer).append('<li class="viewType-optionsBox col-xs-3"><div class="options-box remove-applet-option" data-viewtype="removeApplet"><i class="fa fa-trash-o"></i></div><div class="formatButtonText">Remove</div></li>');
        },
        tagName: 'ul',
        className: 'options-panel col-xs-12',
        onRender: function() {},
        childView: SingleViewType
    });

    ADK.Messaging.reply('switchboard : display', function(options) {
        return new OptionsSelectionView(options);
    });
    return OptionsSelectionView;

}