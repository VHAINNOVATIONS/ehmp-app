define([
    "backbone",
    "jquery",
    "_assets/js/tooltipMappings",
    "api/Messaging"
], function(Backbone, $, tooltipMappings, Messaging) {
    'use strict';

    var tooltipUtils = {};

    tooltipUtils.initTooltip = function(event) {
        var eventTarget = $(event.target);

        if (eventTarget.data('bs.tooltip')) return;

        //does it have the attribute?
        if (!eventTarget.attr('tooltip-data-key')) {
            eventTarget = eventTarget.closest('[tooltip-data-key]');
            if (!eventTarget) {
                return true;
            }
        }

        //init
        var tooltipDataKey = eventTarget.attr('tooltip-data-key');
        if (!tooltipDataKey) {
            return true; //???
        }

        //get the mapping
        var tooltipData = tooltipMappings[tooltipDataKey];
        if (tooltipData === undefined) {
            //if no mapping exists, get his own value
            tooltipData = eventTarget.attr('tooltip-data-key');
            //console.log('Tooltip mapping undefined: ' + tooltipDataKey);
            if (tooltipData === undefined) {
                return true;
            }
        }

        //tooltip placement
        var tooltipPlacement = eventTarget.attr('tooltip-data-placement');
        if (tooltipPlacement) {
            eventTarget.removeAttr('tooltip-data-placement');
        } else {
            tooltipPlacement = 'auto top';
        }

        //delete tooltip marker
        eventTarget.removeAttr('tooltip-data-key');

        //inject/set attributes
        eventTarget.attr({                            
            'data-toggle': 'tooltip',
            'data-placement': tooltipPlacement,
            'data-original-title': tooltipData,
            'data-container': 'body'                                         
        }).tooltip({
            'delay': {
                'show': 500,
            },
            'trigger': 'hover focus'
        }).mouseover();

        return true;
    };

    $(document).on('mouseenter focus', '[tooltip-data-key]', tooltipUtils.initTooltip);

    Messaging.on('screen:navigate', function() {
        $('[data-toggle=tooltip]').tooltip('destroy');
    });

	return tooltipUtils;
});