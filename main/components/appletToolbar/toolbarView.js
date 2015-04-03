var dependencies = [
    "jquery",
    "underscore",
    "main/ADK",
    "backbone",
    "marionette",
    "api/Messaging",
    "api/ResourceService",
    'hbs!main/components/appletToolbar/toolbarTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies($, _, ADK, Backbone, Marionette, Messaging, ResourceService, toolbarTemplate) {

    var toolbarView = Backbone.Marionette.ItemView.extend({
        template: toolbarTemplate,
        className: 'appletToolbar',
        initialize: function(options) {
            this._super = Backbone.Marionette.ItemView.prototype;
            this.targetElement = options.targetElement;
            var that = this;
            this.setClickHandlers();
            this.render();
        },
        setClickHandlers: function() {
            var that = this;
            this.clickHandlers = {
                showDetailView: {
                    identifier: 'searchClick',
                    callback: function(event) {
                        //this.targetElement.$el.find('.info-display').click();
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                        var channelObject = {
                            model: that.targetElement.model,
                            uid: that.targetElement.model.get("uid"),
                            patient: {
                                icn: currentPatient.attributes.icn,
                                pid: currentPatient.attributes.pid
                            }
                        };
                        $('[data-toggle=popover]').popover('hide');
                        Messaging.getChannel(that.targetElement.model.get("applet_id")).trigger('detailView', channelObject);
                    },
                    toggler: that.targetElement.$el.find('.info-display'),
                    toggleEvent: 'click'
                },
                togglePopover: {
                    identifier: 'infoClick',
                    callback: function(event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        that.targetElement.$el.find('[data-toggle=popover]').click();

                    },
                    toggler: that.targetElement.$el.find('[data-toggle=popover],.right-side'),
                    toggleEvent: 'click'
                }

            };
        },
        create: function() {
            var obj = this.targetElement;
            var el = obj.$el,
                clickHandlers = this.clickHandlers,
                that = this;
            this.toolbarPopover = el.find('.appletToolbar');
            _.each(clickHandlers, function(clickHandler) {
                that.processHandlers(clickHandler, el);
            });
            el.attr('tabindex', '0');
            el.attr('hasAppletToolbar', 'true');
            this.onCreate(el, this.toolbarPopover);
            var toolbarButtons = this.toolbarPopover.find('.btn-group');
            el.on('focusin', function() {
                
                if (!el.hasClass('toolbarActive')) {
                    $('[data-toggle=popover]').popover('hide');
                    that.removeExisting();
                    that.toolbarPopover.fadeIn(100);
                    el.addClass('toolbarActive');  
                }
            });
            toolbarButtons.find('.btn').on('click', function(){
                toolbarButtons.find('.btn').removeClass('toolbar-btn-hover');
            });
        },
        onCreate: function(el, toolbarPopover) {
            var that = this;
            $('body').on('click.appletToolbar', function(e) {
                var isInsideEl = ($(e.target).parents('toolbarActive').length > 0),
                    isInsideModal = ($(e.target).parents('#modal-region').length > 0),
                    isInsidePopover = ($(e.target).parents('.popover').length > 0);

                if (!isInsideEl && !isInsideModal && !isInsidePopover) {
                    that.removeExisting();
                }
            });
        },
        onDestroy: function() {
            console.log('toolbar destroyed');
            $('body').off('click.appletToolbar');
        },
        render: function() {
            this._super.render.apply(this, arguments);
        },
        onRender: function() {
            this.targetElement.$el.prepend(this.$el);
            this.create();
        },
        processHandlers: function(bttnObj, el) {
            var icon,
                toolbarPopover = el.find('div.toolbarPopover');
            switch (bttnObj.identifier) {
                case 'searchClick':
                    icon = toolbarPopover.find('.fa-eye').parent();
                    break;
                case 'infoClick':
                    icon = toolbarPopover.find('.fa-search').parent();
                    break;
            }
            icon.on('click', function(e) {
                bttnObj.callback(e);
            });


            if (bttnObj.toggler) {
                bttnObj.toggler.on(bttnObj.toggleEvent, function() {
                    toolbarPopover.find('.btn').removeClass('toolbar-btn-hover');
                    icon.addClass('toolbar-btn-hover');
                });
            }

        },
        removeExisting: function() {
            var existingToolbars = $('[hasAppletToolbar=true]');
            if (existingToolbars.length > 0) {
                existingToolbars.find('.appletToolbar').hide();
                existingToolbars.removeClass('toolbarActive');
            }
        }

    });
    return toolbarView;
}