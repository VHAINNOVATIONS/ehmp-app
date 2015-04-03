(function ( root, doc, factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery" ], function ( $ ) {
            factory( $, root, doc );
            return $.mobile;
        });
    } else {
        // Browser globals
        factory( root.jQuery, root, doc );
    }
}( this, document, function ( jQuery, window, document, undefined ) {
    (function ($) {
        $(window.document).on("mobileinit", function () {
            var flatWidgets = [
                    // containers
                    'page', 'dialog', 'popup',
                    // widgets, alphabetical
                    'button',
                    'checkboxradio',
                    'collapsible',
                    'collapsibleset',
                    'controlgroup',
                    'listview',
                    'selectmenu',
                    // slider is special case
                    'textinput'
                ];
            // Navigation
            //$.mobile.ajaxEnabled = false;
            $.mobile.linkBindingEnabled = false;
            $.mobile.hashListeningEnabled = false;
            $.mobile.pushStateEnabled = false;
            $.mobile.changePage.defaults.changeHash = false;

            // Corners
            flatWidgets.forEach( function (widget) {
                $.mobile[widget].prototype.options.corners = false;
                $.mobile[widget].prototype.options.shadow = false;
            });
            // Page
            $.mobile.page.prototype.options.headerTheme  = "b";
            $.mobile.page.prototype.options.contentTheme = "b";
            $.mobile.page.prototype.options.footerTheme  = "b";

            // Panel
            $.mobile.panel.prototype.options.theme  = "d";

            // Dialog
            $.mobile.dialog.prototype.options.overlayTheme  = "a";

            // Button
            $.mobile.button.prototype.options.iconshadow = false;

            // Collapsible
            $.mobile.collapsible.prototype.options.iconpos  = "right";
            $.mobile.collapsible.prototype.options.collapsedIcon  = "arrow-r";
            $.mobile.collapsible.prototype.options.expandedIcon  = "arrow-d";

            $.mobile.button.prototype.options.iconshadow = false;

            // Listview
            $.mobile.listview.prototype.options.theme        = "d";
            $.mobile.listview.prototype.options.filterTheme  = "b";
            $.mobile.listview.prototype.options.dividerTheme = "b";

            $.mobile.listview.prototype.options.splitTheme   = "d";
            $.mobile.listview.prototype.options.countTheme   = "d";

            // Slider
            $.mobile.slider.prototype.options.trackCorners = false;
            $.mobile.slider.prototype.options.sliderCorners = false;
            $.mobile.slider.prototype.options.handleCorners = false; // always true for track type
            $.mobile.slider.prototype.options.handleShadow = false;

            // Textinput
            $.mobile.textinput.prototype.options.clearBtnCorners = false;
            $.mobile.textinput.prototype.options.clearBtnShadow = false;

            // Popup, without going through Backbone router
            $(document).on('keydown tap', 'a[data-rel="popup"]:not([aria-owns$="-menu"]), a:jqmData(rel="popup"):not([aria-owns$="-menu"])', function(e) {
                var $anchor = $(e.currentTarget);
 
                // custom "selectmenu" handled below
                if ( $anchor.parent().find('select').length > 0 || (e.type ==='keydown' && e.which !== 13) ) { return; }
 
                e.preventDefault();
 
                $($anchor.attr('href')).popup('open', {
                    positionTo: $anchor.jqmData('positionTo') || $anchor.attr('data-position-to') || $anchor,
                    transition: $anchor.jqmData('transition') || $anchor.attr('data-transition') || "none"
                });
            });
        });
    }( jQuery, this ));
}));