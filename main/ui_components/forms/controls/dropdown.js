/**
 * Created by alexluong on 6/25/15.
 */

define([
    'backbone',
    'puppetForm',
    'handlebars'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var DropdownPrototype = {
        defaults: {
            split: false,
            label: '',
            icon: '',
            id: '',
            type: 'button',
            extraClasses: [],
            items: []
        },
        requiredFields: ['split', 'label', 'items'],
        template: Handlebars.compile('{{ui-dropdown label split=split icon=icon id=id type=type items=items srOnlyLabel=srOnlyLabel}}'),
        events: _.defaults({
            'click a': function(e) {
                e.preventDefault();
            }
        }, PuppetForm.CommonPrototype.events)
    };

    var Dropdown = PuppetForm.DropdownControl = PuppetForm.Control.extend(DropdownPrototype);

    return Dropdown;
});