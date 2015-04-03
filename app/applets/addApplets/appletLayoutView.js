var dependencies = [
    'underscore',
    'main/ADK',
    'backbone',
    'marionette',
    'hbs!app/applets/addApplets/list/appletEditor',
    'app/applets/addApplets/list/appletSelectionSlider',
    'app/applets/addApplets/list/switchboardLayoutView',
    'gridster',
    'api/UserDefinedScreens'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(_, ADK, Backbone, Marionette, appletEditor, AppletSelectionSlider, SwitchboardLayout, gridster, UserDefinedScreens) {

    'use strict';

    var isSwitchboardDisplayed = function() {
        var switchboardDiv = $('#gridster2').find($('.view-switchboard'));
        if (switchboardDiv.is(':visible')) {
            //flash the box!!
            for (var i = 0; i < 2; i++) {
                $(switchboardDiv).fadeTo(225, 0.5).fadeTo(225, 1.0);
            }
            return true;
        } else {
            return false;
        }
    };    

    var Switchboard = Backbone.Marionette.CollectionView;

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        template: appletEditor,
        appletUnderSwitchboard: '',
        initialize: function() {
            this.gridster = {};
            var self = this;

            // load configs from app.json
            var appConfig = new Backbone.Model();
            appConfig.fetch({
                url: 'app.json',
                async: false
            });
            this.maxMoves = appConfig.get("numMovesBeforeSaveUDSConfig");
            this.gracePeriod = appConfig.get("saveUDSConfigTimeout");
            if (typeof this.maxMoves != 'number') {
                this.maxMoves = 6;
            }
            if (typeof this.gracePeriod != 'number') {
                this.gracePeriod = 5000;
            }

            this.model = new Backbone.Model();
            var screenModule = ADK.ADKApp[Backbone.history.fragment];
            this.lastSave.currentScreenModule = screenModule;
            var screensConfigPromise = UserDefinedScreens.getScreensConfig();
            screensConfigPromise.done(function(screensConfig) {
                self.screenConfig = _.findWhere(screensConfig.screens, {
                    id: screenModule.moduleName
                });
            });
            screenModule.buildPromise.done(function() {
                var deferred = UserDefinedScreens.getGridsterTemplateForEditor(screenModule);
                deferred.done(function(template) {
                    self.model.set('gridsterTemplate', template);
                    self.render();
                });
            });

            var addAppletsChannel = ADK.Messaging.getChannel('addApplets');
            addAppletsChannel.reply('addAppletToGridster', function(params) {
                var appletId = params.appletId;
                var appletTitle = params.appletTitle;
                var regionId = self.getNextAppletId();
                var appletHtml = '<li class="new" data-appletid="' + appletId + '" data-instanceid="' + regionId + '" id="' + regionId + '" data-view-type="summary" data-min-sizex="4" data-min-sizey="3" data-max-sizex="8" data-max-sizey="12"><div class="edit-applet fa fa-cog"></div><br>' + appletTitle + '</li>';
                if (!isSwitchboardDisplayed()) {
                    setTimeout(function() {
                        var x = params.xPos;
                        var y = params.yPos;
                        var gridsterDimen = self.getGridsterDimension();
                        var col = Math.ceil((x - Math.floor(x / (gridsterDimen[0] * 4 + 10)) * 5) / (gridsterDimen[0] + 10));
                        if (col < 1) col = 1;
                        var row = Math.ceil(y / 25);
                        if (row < 1) row = 1;

                        self.gridster.add_widget(appletHtml, params.sizeX, params.sizeY, col, row);
                        self.displaySwitchboard(appletId, regionId, appletTitle, function() {
                            self.gridster.arrange_widgets_no_vertical_clipping(self.gridster.$widgets.toArray());
                            setTimeout(function() {
                                self.setGridsterBaseDimension();
                            }, 300);
                        });
                    }, 0);
                    if (!isSwitchboardDisplayed()) {
                        self.gridster.arrange_widgets_no_vertical_clipping(self.gridster.$widgets.toArray());
                        setTimeout(function() {
                            self.setGridsterBaseDimension();
                        }, 300);
                    }
                }
            });

            $(window).resize(function() {
                self.setGridsterBaseDimension();
            });
        },
        getNextAppletId: function() {
            var nextId = 0;
            this.$el.find('.gridsterContainer ul li').each(function() {
                var idStr = $(this).attr('id');
                var index = idStr.indexOf('applet-');
                if (index === 0) {
                    var id = parseInt(idStr.substring(7, idStr.length));
                    if (nextId < id)
                        nextId = id;
                }

            });
            ++nextId;
            return 'applet-' + nextId;
        },
        regions: {
            appletSlider: '.applet-tray'
        },
        events: {
            'keyup #searchApplets': 'filterApplets',
            'click #doneEditing': 'hideOverlay',
            'click .edit-applet': 'editClicked',
            'click .applet-exit-options-button': 'closeSwitchboard',
            'keydown .applet-thumbnail': function(evt) {
                if (evt.which === 13) {
                    var $el = $(evt.currentTarget);
                    var addAppletsChannel = ADK.Messaging.getChannel('addApplets');
                    var d = addAppletsChannel.request('addAppletToGridster', {
                        appletId: $el.attr('data-appletid'),
                        appletTitle: $el.text(), //when appletConfig is figured out, this should be removed
                        sizeX: 4,
                        sizeY: 4,
                        col: 4,
                        row: 4
                    });
                }
            }
        },
        hideOverlay: function() {
            this.saveGridsterAppletsConfig(true);
            ADK.hideFullscreenOverlay();
            ADK.Navigation.navigate(Backbone.history.fragment);
        },
        onRender: function() {
            if (this.screenConfig) {
                $(this.el).find('#screen-title').text(this.screenConfig.title);
            }
            this.appletSlider.show(new AppletSelectionSlider());
            this.initGridster();
        },
        getSwitchboard: function(appletId, region, appletTitle, onChangeView, currentView) {
            var switchboardOptions = {
                region: region,
                appletId: appletId,
                switchOnClick: false,
                appletTitle: appletTitle
            };
            if (onChangeView) {
                switchboardOptions.onChangeView = onChangeView;
            }
            if (currentView) {
                switchboardOptions.currentView = currentView;
            }
            var SwitchboardView = new SwitchboardLayout(switchboardOptions);
            return SwitchboardView;
        },
        editClicked: function(e) {
            var self = this;
            if (isSwitchboardDisplayed()) {
                return;
            } else {
                var gridsterContainer;
                if ($(e.target).parent().attr('data-appletid') !== undefined) {
                    gridsterContainer = $(e.target).parent();
                } else {
                    gridsterContainer = $(e.target).parent().parent();
                }

                var appletId = gridsterContainer.attr('data-appletid');
                var regionId = gridsterContainer.attr('id');
                var appletTitle = gridsterContainer.find('.applet-title').text();
                var currentView = gridsterContainer.attr('data-view-type');
                gridsterContainer.addClass("bringToFront");

                this.addRegions({
                    appletRegion: '#' + regionId
                });

                Switchboard = this.getSwitchboard(appletId, this.appletRegion, appletTitle, function() {
                    self.gridster.arrange_widgets_no_vertical_clipping(self.gridster.$widgets.toArray());
                    self.setGridsterBaseDimension();
                }, currentView);
                this.appletRegion.show(Switchboard);
                this.fixSwitchbordPosition();
                $('.view-switchboard').find('.applet-exit-options-button').removeClass('hide');
            }
        },
        displaySwitchboard: function(newAppletId, newRegionId, newAppletTitle, onChangeView) {
            this.addRegions({
                appletRegion: '#' + newRegionId
            });

            Switchboard = this.getSwitchboard(newAppletId, this.appletRegion, newAppletTitle, onChangeView);

            this.appletRegion.show(Switchboard);
            $('#' + newRegionId).addClass("bringToFront");

            this.fixSwitchbordPosition();

        },
        fixSwitchbordPosition: function() {
            var $switchboard = $('div.view-switchboard');
            var offset = $switchboard.offset();
            var windowWidth = $(window).width();
            var switchboardWidth = $switchboard.width();
            if (offset.left < 0) {
                offset.left = 0;
            } else if (offset.left + switchboardWidth > windowWidth) {
                offset.left = windowWidth - switchboardWidth + 10;
            }
            var $gridster2 = $('#gridster2');
            var gridster2Bottom = $gridster2.height() + $gridster2.offset().top;
            var switchboardBottom = offset.top + $switchboard.height();
            if (switchboardBottom > gridster2Bottom) {
                offset.top = gridster2Bottom - $switchboard.height() - 10;
            }
            $switchboard.offset(offset);
        },
        closeSwitchboard: function(e) {
            // $(this.appletRegion.el).removeClass('bringToFront');
        },
        saveGridsterAppletsConfig: function(overrideThrottle) {
            var screen = ADK.ADKApp.currentScreen.id;
            var $gridsterEl = this.$el.find(".gridsterContainer");
            var appletsConfig = UserDefinedScreens.serializeGridsterScreen($gridsterEl, screen);

            //check if anything changed from last save
            if (UserDefinedScreens.getGridsterTemplate(this.lastSave.currentScreenModule) === UserDefinedScreens.getGridsterTemplate(appletsConfig)) {
                // nothing changed since last save, reset number of moves, skip save check
                // console.log("  notthing changed, not saved, resetting moveCount");
                this.lastSave.numMoves = 0;
                return;
            }

            // save to the session
            UserDefinedScreens.saveGridsterConfigToSession(appletsConfig, screen);

            var currentTime = this.getSaveTime();
            var timeDiff = currentTime - this.lastSave.time;
            this.lastSave.numMoves++;
            if (this.lastSave.numMoves === 1 && !overrideThrottle) {
                // This is the first move so let's start a "timer"
                // console.log("  first, not saved, start timer");
                this.lastSave.time = currentTime;
            } else if (overrideThrottle || timeDiff > this.gracePeriod || this.lastSave.numMoves >= this.maxMoves) {
                // Force save, elapsed time longer than grace perieod, or more than enough moves to do the save
                // so svae and reset the counters/"timer"
                console.log("  saving GridsterConfig screen: " + screen);
                UserDefinedScreens.saveGridsterConfig(appletsConfig, screen);
                this.lastSave.time = currentTime;
                this.lastSave.numMoves = 0;
                this.lastSave.currentScreenModule = appletsConfig;
            } else {
                // console.log("  not saved");
            }
            // else don't save
        },
        getGridsterDimension: function() {
            var windowWidth = $(window).width();
            var hightestCol = this.gridster.get_highest_occupied_cell().col;
            if (hightestCol < 1) {
                return [40, 20];
            }
            var x = Math.floor(windowWidth / hightestCol) - 10;
            if (x > 40) x = 40;
            return [x, 20];
        },
        setGridsterBaseDimension: function() {
            this.gridster.resize_widget_dimensions({
                widget_base_dimensions: this.getGridsterDimension()
            });
        },
        initGridster: function() {
            var self = this;

            this.gridster = this.$el.find(".gridsterContainer ul").gridster({
                namespace: '#gridster2',
                widget_selector: "li",
                widget_base_dimensions: [40, 20],
                widget_margins: [5, 5],
                helper: 'clone',
                avoid_overlapped_widgets: true,
                autogrow_cols: true,
                min_cols: 100,
                resize: {
                    enabled: true,
                    stop: function(e, ui) {
                        self.setGridsterBaseDimension();
                        self.saveGridsterAppletsConfig();
                    }
                },
                draggable: {
                    stop: function(e, ui) {
                        self.setGridsterBaseDimension();
                        self.saveGridsterAppletsConfig();
                    }
                }
            }).data('gridster');
            if (this.gridster) {
                this.setGridsterBaseDimension();
                this.$el.find('.gridsterContainer #gridster2').height('380px');
            }

        },
        filterApplets: function() {
            var filterText = this.$el.find('#searchApplets').val();
            this.appletSlider.currentView.filterApplets(filterText);
        },
        lastSave: {
            time: 0,
            numMoves: 0
        },
        getSaveTime: function() {
            var d = new Date();
            return d.getTime();
        }

    });

    return AppletLayoutView;
}