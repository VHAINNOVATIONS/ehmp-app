var dependencies = ["backbone"];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone) {

    var ResizeUtils = {};

    //Adding margin to top of contentRegion to allow topRegion to have fixed position
    //On resize of the window, re-calulate the height of topRegion
    ResizeUtils.centerRegion = function(centerRegion_layoutView, topRegion_layoutView, ADKApp) {
        //getting the height of the topRegion to calaculate the margin-top for the centerRegion
        centerRegion_layoutView.$el.parent().css('margin-top', topRegion_layoutView.$el.height() + 'px');
        centerRegion_layoutView.$el.parent().css('height', $(window).height() - topRegion_layoutView.$el.height() - ADKApp.bottomRegion.$el.children().height() + 'px');
    };

    ResizeUtils.dw = function() {
        var contentRegion = $('#content-region');
        var navbarHeaderHeight = $('.navbar-fixed-top').height();
        var footerHeight = $('.navbar-fixed-bottom').height();
        var windowHeight = $(window).height();
        var applet = $('.panel.panel-primary', contentRegion);
        var appletHeader = parseInt($('.grid-applet-heading', applet).css('height'), 10);
        var appletHeaderPadding = parseInt($('.grid-applet-heading', applet).css('padding-top'), 10);
        var appletFooter = parseInt($('.grid-footer', applet).css('height'), 10);
        var appletPadding = parseInt($(applet).css('margin-bottom'), 10);
        var rows = $('> .contentPadding > .row', contentRegion);
        var rowHeight = 0;
        if (rows.length > 1) {
            rowHeight = $(rows).eq(0).height();
        }

        // var firstColumn = $('div', rows).eq(0);
        // this was changed because there were graps that were nested inside the 0 row, so it didn't always target a collapsible panel
        var firstColumn = $('.grid-applet-panel:eq(0)').closest('.row'),
            appletCount = $('> div', firstColumn),
            fixedApplet = $('.app-size', contentRegion),
            fixedAppletHeight = parseInt($('.panel-body.grid-applet-panel', fixedApplet).eq(0).css('max-height'), 10);

        _.each(appletCount, function(applet) {
            if (_.isNull(applet.firstChild)) {
                appletCount = _.without(appletCount, applet);
            }
        });

        var appletChrome = appletCount.length * (appletHeader + appletHeaderPadding + appletFooter + appletPadding),
            workingSpace = windowHeight - ((navbarHeaderHeight + footerHeight + appletChrome)) - rowHeight,
            appletHeightPercentage = (100 / appletCount.length) / 100,
            appletHeight = workingSpace * appletHeightPercentage,
            fixedAppletPercentage = fixedAppletHeight / workingSpace,
            appletGrid = $('.grid-applet-panel .data-grid').eq(0),
            fixedColumnAppletHeight = workingSpace * (1 - fixedAppletPercentage) / (appletCount.length - 1);

        // first i get the adequate applet id by targeting the dataset of the html object with jquery
        // i also had to make sure we were targeting the adequate applet within the first row that had an actual filtering button
        var appletId = $('div[data-appletid]', firstColumn).data('appletid'),
            filterArea = $('#grid-filter-' + appletId);

        if (appletCount.length > 1) {
            $('#content-region .panel-body').css('height', appletHeight + 'px');
        } else {
            // outer height is better because of padding instead of regular height.
            // var filterHeight = $('.grid-applet-panel .grid-filter').eq(0).outerHeight(); //this was commented to take the approach declared next.
            var filterHeight = 0;
            // get sibling elements other than the actual grid that are visible
            var siblingElements = $('.grid-applet-panel').children(':visible').not('.grid-container');
            // sum of their heights
            siblingElements.each(function() {
                filterHeight += $(this).outerHeight();
            });
            // define viewport height
            appletHeight = appletHeight - filterHeight;
            $('#content-region .panel-body .data-grid, #content-region .panel-body #doc-detail-wrapper').css('height', appletHeight + 'px');
        }
        $('#content-region .app-size-2 .panel-body ').css('height', (fixedColumnAppletHeight) + 'px');
        // Second assignment is to account for fixed applet heights.

        // Resize Global Daterange Timeline extended overflow view
        var globalDatePickerCompactHeight = $('#globalDatePicker-compact').height();
        var navigationRegion = $('#navigation-region').height();
        var globalDaterangeTimelineHeight = windowHeight - navbarHeaderHeight + (navigationRegion - globalDatePickerCompactHeight);
        $('#navigation-region #navigationPanel #navigation-date .globalDatePicker-popupRegion .panel-body').css('height', (globalDaterangeTimelineHeight - 375));
    };

    return ResizeUtils;
}