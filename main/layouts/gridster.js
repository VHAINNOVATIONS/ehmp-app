var dependencies = [
    "main/ADK",
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/gridster",
    "gridster",
    "api/UserDefinedScreens"
];

define(dependencies, onResolveDependencies);


function onResolveDependencies(ADK, Backbone, Marionette, _, Template, Gridster, UserDefinedScreens) {

    Gridster.prototype.resize_widget_dimensions = function(options) {

        if (options.widget_margins) {
            this.options.widget_margins = options.widget_margins;
        }

        if (options.widget_base_dimensions) {
            this.options.widget_base_dimensions = options.widget_base_dimensions;
        }

        this.min_widget_width = (this.options.widget_margins[0] * 2) + this.options.widget_base_dimensions[0];
        this.min_widget_height = (this.options.widget_margins[1] * 2) + this.options.widget_base_dimensions[1];

        try {
            var serializedGrid = this.serialize();
            this.$widgets.each($.proxy(function(i, widget) {
                var $widget = $(widget);
                var data = serializedGrid[i];
                this.resize_widget($widget, data.sizex, data.sizey);
                // this.resize_widget($widget, $widget.attr('data-sizex'), $widget.attr('data-sizey'));
            }, this));
        } catch (e) {
            //console.log('error!');
            //console.log(e);
        }
        this.generate_grid_and_stylesheet();
        this.get_widgets_from_DOM();
        this.set_dom_grid_height();
        if (options.callBack) {
            options.callBack();
        }
        return false;
    };

    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        className: "contentPadding",
        saveThrottleProperties: {
            lastSave: {
                time: 0,
                numMoves: 0
            }
        },
        initialize: function(options) {
            // load configs from app.json
            var appConfig = new Backbone.Model();
            appConfig.fetch({
                url: 'app.json',
                async: false
            });
            this.saveThrottleProperties.maxMoves = appConfig.get("numMovesBeforeSaveUDSConfig");
            this.saveThrottleProperties.gracePeriod = appConfig.get("saveUDSConfigTimeout");
            if (typeof this.saveThrottleProperties.maxMoves != 'number') {
                this.saveThrottleProperties.maxMoves = 10;
            } else {
                // double the number of maxMoves because of the number of times saveGridsterAppletsConfig gets called
                this.saveThrottleProperties.maxMoves *= 2;
            }
            if (typeof this.saveThrottleProperties.gracePeriod != 'number') {
                this.saveThrottleProperties.gracePeriod = 15000;
            }


        },
        onDomRefresh: function() {
            var self = this;
            var gridster;
            var $gridsterEl = this.$el.find(".gridster");
            var global = Function('return this')();

            function getXSize() {
                if($(window).width()<=1024){
                    return (1024 - 2 * $gridsterEl.offset().left - 150) / 12;
                } else {
                    return ($(window).width() - 2 * $gridsterEl.offset().left - 150) / 12;
                }
            }

            function getYSize() {
                return ($(window).height() - $gridsterEl.offset().top - 160) / 12;
            }

            function saveGridsterAppletsConfig(overrideThrottle) {
                var screen = ADK.ADKApp.currentScreen.id;
                var appletsConfig = UserDefinedScreens.serializeGridsterScreen($gridsterEl, screen);


//                if (!self.saveThrottleProperties.lastSave) {
//                    self.saveThrottleProperties.lastSave = {
//                        time: getSaveTime(),
//                        numMoves: 0
//                    };
//                }
                // check if anything changed from last save
                if (self.saveThrottleProperties.lastSave.currentScreenModule && UserDefinedScreens.getGridsterTemplate(self.saveThrottleProperties.lastSave.currentScreenModule) === UserDefinedScreens.getGridsterTemplate(appletsConfig)) {
                    // console.log("  nothing changed since last save, skipping save check and save");
                    self.saveThrottleProperties.lastSave.numMoves = 0;
                    clearSaveGridsterAppletsConfigOnTimeout();
                    return;
                }

                // save to the session
                UserDefinedScreens.saveGridsterConfigToSession(appletsConfig, screen);

                var currentTime = getSaveTime();
                var timeDiff = currentTime - self.saveThrottleProperties.lastSave.time;
                self.saveThrottleProperties.lastSave.numMoves++;
                // console.log("in gridster.js.saveGridsterAppletConfig: time since last save = " + (timeDiff/1000) + ", moveNumber: " + saveThrottleProperties.lastSave.numMoves);
                if (self.saveThrottleProperties.lastSave.numMoves === 1 && !overrideThrottle) {
                    // This is the first move so let's start a "timer"
                    // console.log("  first move not saving, setting reference time");
                    self.saveThrottleProperties.lastSave.time = currentTime;
                    
                    // start a timer for
                } else if (overrideThrottle || timeDiff > self.saveThrottleProperties.gracePeriod || self.saveThrottleProperties.lastSave.numMoves >= self.saveThrottleProperties.maxMoves ) {
                    // Force save, elapsed time longer than grace perieod, or more than enough moves to do the save
                    // so svae and reset the counters/"timer"
                    console.log("  saving GridsterConfig screen: " + screen);

                    UserDefinedScreens.saveGridsterConfig(appletsConfig, screen);
                    self.saveThrottleProperties.lastSave.time = currentTime;
                    self.saveThrottleProperties.lastSave.numMoves = 0;
                    self.saveThrottleProperties.lastSave.currentScreenModule = appletsConfig;
                } else {
                    // console.log("  not saving config");
                }

                // reset the timeout to save in case this save is not called again
                clearSaveGridsterAppletsConfigOnTimeout();
                saveGridsterAppletsConfigOnTimeout(appletsConfig, screen);

            };

            function saveGridsterAppletsConfigOnTimeout(configuration, screen) {
                global.saveGridsterConfigTimeout = setTimeout(function() {
                    UserDefinedScreens.saveGridsterConfig(configuration, screen);
                    self.saveThrottleProperties.lastSave.time = getSaveTime();
                    self.saveThrottleProperties.lastSave.numMoves = 0;
                }, self.saveThrottleProperties.gracePeriod);
            }

            function clearSaveGridsterAppletsConfigOnTimeout() {
                clearTimeout(global.saveGridsterConfigTimeout);
            }

            function getSaveTime() {
                var d = new Date();
                return d.getTime();
            }


            var xSize = getXSize();
            var ySize = getYSize();
            var maxCol = 1;
            this.$el.find('.gridster div[data-col]').each(function(){
                var col = parseInt($(this).attr('data-col'));
                if(col > maxCol) maxCol = col;
            });
            gridster = $gridsterEl.gridster({
                widget_selector: "div",
                avoid_overlapped_widgets: true,
                widget_margins: [5, 5],
                widget_base_dimensions: [xSize, ySize],
                autogrow_cols: true,
                min_cols: maxCol + 10,
                resize: {
                    enabled: true,
                    handle_append_to: '',
                    resize: function(e, ui, $widget) {
                        var appletHeight = ui.pointer.diff_top + $widget.height();
                        $widget.find('.panel-body').height(appletHeight - 35);
                    },
                    stop: function(e, ui, $widget) {
                        var appletHeight = $widget.height();
                        $widget.find('.panel-body').height(appletHeight - 35);
                        saveGridsterAppletsConfig();
                    }
                },
                draggable: {
                    handle: "span.center-block.text-center.panel-title",
                    stop: function(e, ui, $widget) {
                        saveGridsterAppletsConfig();
                    }
                }
            }).data('gridster');

            function resetGridsterBase(callBack) {
                var xSize = getXSize();
                var ySize = getYSize();
                gridster.resize_widget_dimensions({
                    widget_base_dimensions: [xSize, ySize],
                    callBack: callBack
                });

                setGridsterContainerHeight();
            }

            function setGridsterContainerHeight() {
                $gridsterEl.height($(window).height() - $gridsterEl.offset().top - 20);
            }

            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            function randomId() {
                return S4() + S4() + S4();
            }            

            $(window).resize(function() {
                resetGridsterBase();
            });
            //resetbase is needed to fix some issues that for some browsers the drag's not work properly when page first loads
            //resetGridsterBase(ADK.utils.resizedw);
            //call resizedw to set panel height correctly
            setGridsterContainerHeight();

            //adjust applet panel body to have grid height - 35
            setTimeout(function(){
                    gridster.$widgets.each(function(idx, w){
                        var $w = $(w);
                        $w.find('.panel-body').height($w.height() - 35);
                    });
            }, 1000);

            ADK.Messaging.on('user:beginSessionEnd', function() {
                clearSaveGridsterAppletsConfigOnTimeout();
                saveGridsterAppletsConfig(true);
            });
        
        }

    });

    return layoutView;
}
