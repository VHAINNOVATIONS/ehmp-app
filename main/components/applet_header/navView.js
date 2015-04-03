var dependencies = [
    'api/Navigation',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'main/ADK',
    'hbs!main/components/applet_header/navTemplate',
    'hbs!main/components/global_datepicker/template/gdrHeaderMinimizedTemplate',
    'hbs!main/components/global_datepicker/template/gdrHeaderExtendedTemplate',
    'main/components/global_datepicker/view/gdrSelectorView',
    'main/components/global_datepicker/view/spikeLineView',
    'main/components/global_datepicker/view/trendHistoryView',
    'main/components/text_search/textSearchInputView'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Navigation, Backbone, Marionette, _, hand, ADK, navTemplate, GdrMinimizedHeader, GdrExtendedHeader, GdrSelector, SpikeLineView, TrendHistoryView, TextSearchInputView) {
    'use strict';
    var timelineSummaryHasBeenInitialized = false;

    var GdrMinimizedHeaderView = Backbone.Marionette.ItemView.extend({
        template: GdrMinimizedHeader,
        modelEvents: {
            'change': 'render'
        },
        initialize: function() {
            var sessionGlobalDate = ADK.SessionStorage.getModel_SessionStoragePreference('globalDate');
            this.model = sessionGlobalDate;
        }
    });
    var navLayoutView = Backbone.Marionette.LayoutView.extend({
        template: navTemplate,
        className: 'applet-nav',
        regions: {
            gdrSpikeline: '#gdr-spikeline',
            globalDateRegion: '#globalDate-region',
            dateRegionMinimized: '#date-region-minimized',
            textSearchInput: '#text-search-input'
        },
        events: {
            'click #applet-nav a': 'navigate',
            'click #event-nav button': 'navigate',
            'click .dropdown-menu a': 'navigate',
            'click .globalDatePickerButton': 'togglePopover',
            'click #gdr-spikeline': 'togglePopover',
            'click #plus-button': 'addApplets',
            'keydown #globalDatePicker-compact': 'handleEnterOrSpaceBar',
            'keydown #gdr-spikeline': 'handleEnterOrSpaceBar',
            'click #workspace-manager-button': 'workspaceManager'
        },
        initialize: function() {
            timelineSummaryHasBeenInitialized = false;
        },
        onRender: function() {
            var screenId = ADK.ADKApp.currentScreen.id;
            $(this.el.getElementsByClassName(screenId + '-button')).addClass('active');
            var clickedText = $(this.el).find('.active').text().trim();
            this.updateNavButton(clickedText, screenId, this.model);
            
            if (this.options.globalDatepicker) {
                this.globalDatePickerFlag = true;
                this.globalDatePicker = new GdrSelector();
                this.gdrMinimizedHeader = new GdrMinimizedHeaderView({
                    dateModel: this.globalDatePicker.model
                });
                this.spikeLineView = new SpikeLineView({
                    navView: this
                });
            } else {
                this.globalDatePickerFlag = false;
            }
            this.textSearchInputView = new TextSearchInputView();

            if (this.globalDatePickerFlag) {
                this.dateRegionMinimized.show(this.gdrMinimizedHeader);
                this.globalDateRegion.show(this.globalDatePicker);
                this.gdrSpikeline.show(this.spikeLineView);
            } else {
                this.$el.find('#date-region-minimized').addClass('hidden');
            }
            this.textSearchInput.show(this.textSearchInputView, {
                preventDestroy: true
            });

            if (ADK.ADKApp.currentScreen.config.userDefinedScreen) {
                this.$el.find('#plus-button').show();
            } else {
                this.$el.find('#plus-button').hide();
            }
        },
        navigate: function(event) {
            var href;
            $('.dropdown-menu li.active').removeClass('active');
            if ($(event.currentTarget).attr('href')) {
                href = $(event.currentTarget).attr('href');
            } else {
                href = $(event.currentTarget).attr('class');
            }
            Navigation.navigate(href);
        },
        handleEnterOrSpaceBar: function(event) {
            var keyCode = event ? (event.which ? event.which : event.keyCode) : event.keyCode;

            if (keyCode == 13 || keyCode == 32) {
                // e.preventDefault();
                this.togglePopover();
            }
        },
        togglePopover: function() {
            // if (!timelineSummaryHasBeenInitialized) {
            //     this.globalDatePicker.getTimelineSummaryView();
            //     timelineSummaryHasBeenInitialized = true;
            // }

            $('#hiddenDiv').toggleClass('hidden');

            if ($('#hiddenDiv').hasClass('hidden')) {
                $('.cover-sheet .datepicker').hide();
                this.$el.find('#navigation-dateButton').focus();
            } else {
                if (this.globalDatePicker !== undefined && this.globalDatePicker !== null) {
                    this.globalDatePicker.resetToCurrentGlbalDate();
                }
                this.$el.find('#filter-from-date-global').focus();
            }

            $('#navigation-dateButton').toggleClass('active');

            $('body').on('mousedown', function(evt) {
                if ($('#mainModal').length === 0) {
                    if (!($('#hiddenDiv').hasClass('hidden'))) {
                        // var datepicker = $(evt.target).closest('.datepicker');

                        // if (datepicker === undefined || datepicker === null) {
                            $('#hiddenDiv').toggleClass('hidden');
                            $('#navigation-dateButton').toggleClass('active');
                            $('body').off('mousedown');
                        // }
                    }
                }
            });

            $('#hiddenDiv').on('mousedown', function(evt) {
                var globalFromDate = $('.input-group.date#custom-date-from-global');
                var globalToDate = $('.input-group.date#custom-date-to-global');

                if (globalFromDate !== undefined && globalFromDate !== null) {
                    globalFromDate.datepicker('hide');
                }

                if (globalToDate !== undefined && globalToDate !== null) {
                    globalToDate.datepicker('hide');
                }

                evt.stopPropagation();
            });

            // this.globalDateRegion.on('mousedown', function(evt) {
            //     evt.stopPropagation();
            // });
        },
        updateNavButton: function(clickedText, screenId, model) {
            if (clickedText !== "") {
                $(this.el).find("#screenName").text(clickedText);
            } else if (screenId === "record-search") {
                $(this.el).find("#screenName").text("Search Record");
            } else if (screenId.indexOf("-full") > -1) {
                $(this.el).find("#screenName").text(model.attributes.applets[0].title);
            }
        },
        addApplets: function(event) {
            var channel = ADK.Messaging.getChannel('addAppletsChannel');
            channel.trigger('addApplets');
        },
        workspaceManager: function(event) {
            // ADK.showFullscreenOverlay();
            var channel = ADK.Messaging.getChannel('workspaceManagerChannel');
            channel.trigger('workspaceManager');
        }
    });

    return navLayoutView;
}