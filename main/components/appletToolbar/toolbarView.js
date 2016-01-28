/*
==========================
DEPRECATED:  TO BE REMOVED
see appletToolbarView.js
==========================
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "api/Messaging",
    "api/ResourceService",
    'hbs!main/components/appletToolbar/toolbarTemplate',
    'main/components/appletToolbar/factory/buttonFactory'
], function($, _, Backbone, Marionette, Messaging, ResourceService, toolbarTemplate, ButtonClass) {

    var ToolbarView = Backbone.Marionette.ItemView.extend({
        template: toolbarTemplate,
        className: 'mainAppletToolbar',
        initialize: function(options) {
            this.options = options;
            this.targetElement = options.targetElement;
            this.buttonFactory = new ButtonClass();
            this.buttons = [];
            _.each(options.buttonTypes, function(buttontype) {
                this.buttons.push(this.buttonFactory.createButton(this.options, buttontype));
            }, this);
        },
        onDestroy: function() {
            $('body').off('click.mainAppletToolbar');
            this.buttons.forEach(function(button) {
                var $button = $(button.btn);
                var tooltipToggle = $button.is('[data-toggle="tooltip"]') ? $button : $button.find('[data-toggle="tooltip"]');
                tooltipToggle.tooltip('destroy');
            });
        },
        onBeforeDestroy: function() {
            $('body').off('click.mainAppletToolbar');
            _.each(this.$el.find('.fa-eye'), function(item) {
                $(item).parent().off('click');
            });
            _.each(this.$el.find('.fa-search'), function(item) {
                $(item).parent().off('click');
            });
            _.each(this.$el.find('.btn'), function(item) {
                $(item).off('focus');
            });
            _.each(this.clickHandlers, function(obj) {
                obj.toggler.off(obj.toggleEvent);
            });
        },
        onRender: function() {
            var that = this;
            $('body').append(this.$el);

            _.each(this.buttons, function(button) {
                this.$el.find('.btn-group').append(button.btn);
            }, this);

            this.setPositionToParent();
        },
        onShow: function() {
            this.$el.find('.btn').first().focus();
        },
        setPositionToParent: function() {
            var targetElemOffset = this.targetElement.offset();
            this.$el.offset({ top: targetElemOffset.top, left: targetElemOffset.left });
        },
        getBodyElement: function() {
            return this.$el.find('.toolbarPopover');
        }
    });

    var ToolbarManager = function(options) {

        function create() {
            this.options = options;
            this.targetElement = options.targetElement;

            var self = this;
            $(this.targetElement).attr('hasAppletToolbar', 'true');
            this.targetElement.on('click keydown', function(e) {
                if (e.type === 'click' || ((e.type === 'keydown') && (e.which === 13 || e.which === 32))) {
                    if (!self.targetElement.hasClass('toolbarActive')) {
                        self.showToolbar();
                    }
                }
            });

            return {
                showToolbar: _.bind(this.showToolbar, this),
                hideToolbar: _.bind(this.hideToolbar, this),
                destroy: _.bind(this.destroy, this)
            };
        }

        this.onGlobalClick = _.bind(function(event) {
            if (this.isDismissable(event)) {
                this.hideToolbar();
                this.targetElement.find('[data-toggle=popover]').popover('hide');
            }
        }, this);

        this.onGlobalResize = _.throttle(_.bind(function(event) {
            var self = this;
            setTimeout(function() {
                self.toolbarView.setPositionToParent();
            }, 500);
        }, this), 100, { leading: false });

        this.onContainerScroll = _.throttle(_.bind(function(event) {
            this.toolbarView.setPositionToParent();

            // if the toolbar has scrolled out of view, hide it
            var scrollParentTop = this.scrollParent.offset().top;
            var scrollParentBottom = scrollParentTop + this.scrollParent.height();
            var toolbarHeight = this.toolbarView.getBodyElement().outerHeight();
            var toolbarTop = this.toolbarView.getBodyElement().offset().top;
            var toolbarBottom = toolbarTop + toolbarHeight;
            var targetElementTop = this.targetElement.offset().top;
            var targetElementBottom = targetElementTop + this.targetElement.outerHeight();
            if (targetElementTop > scrollParentTop && targetElementTop < scrollParentBottom) {
                this.toolbarView.getBodyElement().show();
            } else {
                this.toolbarView.getBodyElement().hide();
            }

        }, this), 50, { leading: false });

        this.onKeydown = _.bind(function(event) {
            if (event.keyCode === 27) { //escape key
                this.hideToolbar();
                this.targetElement.focus();
                event.preventDefault();
                event.stopPropagation();
            }
        }, this);

        this.attachGlobalListeners = function() {
            this.scrollParent = this.getScrollParent(this.targetElement, false);

            // attach listeners:
            this.scrollParent.on('scroll', this.onContainerScroll);
            $('body').on('mousedown', this.onGlobalClick);
            $(window).on('resize', this.onGlobalResize);
            this.toolbarView.$el.on('keydown', this.onKeydown);
        };

        this.removeGlobalListeners = function() {
            if (this.scrollParent) {
                this.scrollParent.off('scroll', self.onContainerScroll);
            }
            $('body').off('mousedown', this.onGlobalClick);
            $(window).off('resize', this.onGlobalResize);
            this.toolbarView.$el.off('keydown', this.onKeydown);
        };

        this.showToolbar = function() {
            if (this.toolbarView) {
                this.hideToolbar();
            }
            this.toolbarView = new ToolbarView(this.options);
            this.toolbarView.render();
            $('body').append(this.toolbarView.$el);
            this.toolbarView.$el.fadeIn(100);
            this.toolbarView.onShow();
            this.targetElement.addClass('toolbarActive');
            this.attachGlobalListeners();
        };

        this.hideToolbar = function() {
            if (this.toolbarView) {
                this.removeGlobalListeners();
                this.toolbarView.destroy();
                this.targetElement.removeClass('toolbarActive');
                this.toolbarView = null;
            }
        };

        this.destroy = function() {
            this.hideToolbar();
        };

        this.getScrollParent = function($elem, includeHidden) {
            // this method copied from jqueryui 1.11.2
            var position = $elem.css( "position" ),
                excludeStaticParent = position === "absolute",
                overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                scrollParent = $elem.parents().filter( function() {
                   var parent = $( this );
                   if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
                      return false;
                   }
                   return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
                   // var overflowY = parent.css("overflow-y");
                   // return overflowRegex.test(overflowY) ? true : overflowRegex.test(parent.css('overflow'));
                }).eq( 0 );

            return position === "fixed" || !scrollParent.length ? $( $elem[ 0 ].ownerDocument || document ) : scrollParent;
        };

        this.isDismissable = function(e) {
            var isInsideToolbar = ($(e.target).parents('div.toolbarActive').length > 0),
                isInsideTargetElement = ($(e.target).parents('.mainAppletToolbar').length > 0),
                isInsideModal = ($(e.target).parents('#modal-region').length > 0),
                isInsidePopover = ($(e.target).parents('.popover').length > 0);

            return (!isInsideToolbar && !isInsideTargetElement && !isInsideModal && !isInsidePopover);
        };

        return create.apply(this, arguments);
    };

    return ToolbarManager;
});