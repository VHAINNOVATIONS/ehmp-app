var dependencies = [
    "jquery",
    "underscore",
    "main/ADK",
    "backbone",
    "hbs!main/components/views/gists/vitalsView/vitalsGistLayout",
    "hbs!main/components/views/gists/vitalsView/vitalsGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging"


];
define(dependencies, onResolveDependencies);

function onResolveDependencies($, _, ADK, Backbone, vitalsGistLayoutTemplate, vitalsGistChildTemplate, PopoverTemplate, ResourceService, Messaging) {
    'use strict';
    var VitalsGistItem = Backbone.Marionette.ItemView.extend({
        template: vitalsGistChildTemplate,
        className: 'gistItem col-sm-12',
        events: {
            'click button#closeGist': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                $(this.el).find('.sub-elements').hide();
            },
            'click button.groupItem': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            },
            'hover div.gistItem': function(event) {
                var gistID = $(event.target).attr('id');
                $('#' + gistID).blur();
            },
            'focus div.gistItem': function(event) {
                var gistItem = $(document.activeElement);
                gistItem.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        gistItem.trigger('click');
                    }
                });
            },
            'click div.gistItem': function(event) {
                $('[data-toggle=popover]').popover('hide');
                //$(this.el).find('[data-toggle="tooltip"]').tooltip('hide');
                //console.log(this.collection);
                event.preventDefault();
                event.stopImmediatePropagation();
                var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                var channelObject = {
                    collection: this.collection,
                    model: this.model,
                    uid: this.model.get("uid"),
                    patient: {
                        icn: currentPatient.attributes.icn,
                        pid: currentPatient.attributes.pid
                    }
                };
                Messaging.getChannel(this.AppletID).trigger('getDetailView', channelObject);
            }

        },
        initialize: function(options) {
            this.AppletID = options.AppletID;
        },
        setPopover: function() {
            var PopoverView = Backbone.Marionette.ItemView.extend({
                template: PopoverTemplate
            });
            this.$el.find('[data-toggle=popover]').popover({
                trigger: 'hover',
                html: 'true',
                container: 'body',
                template: (new PopoverView().template()),
                placement: 'bottom',
            }).hover(function() {
                $('[data-toggle=popover]').not(this).popover('hide');
            });
        },
        disableNoRecordClick: function() {
            var gistItem = this.$el;
            if (gistItem.find('.no-record').length > 0) {
                //remove the selectable class if no-record
                gistItem.find('.selectable').removeClass('selectable');
                //remove the click handler if no-record
                gistItem.off('click', '');
            }

        },
        onRender: function() {
            this.setPopover();
            this.disableNoRecordClick();
        }
    });
    var VitalsGist = Backbone.Marionette.CompositeView.extend({
        template: vitalsGistLayoutTemplate,
        childView: VitalsGistItem,
        initialize: function(options) {
            this._super = Backbone.Marionette.CompositeView.prototype;
            var appletID = getAppletId(options);
            this.childViewOptions = {
                AppletID: appletID,
                collection: options.collection
            };
            this.gistModel = options.gistModel;
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };

            this.collection = options.collection;

            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model();
            this.model.set('appletID', appletID);
            this.childViewContainer = "#" + appletID + "-vitals" + "-gist-items";
            this._super = Backbone.Marionette.CompositeView.prototype;
        },
        onBeforeRender: function() {
            this.collection.reset(this.collectionParser(this.collection).models);
            _.each(this.collection.models, function(item) {

                _.each(this.gistModel, function(object) {
                    var id = object.id;
                    item.set(object.id, item.get(object.field));
                });
            }, this);
        },
        render: function() {
            this._super.render.apply(this, arguments);
        },
        onStop: function() {
            $('.vitalsPopover').popover('hide');
        },
        onRender: function() {
            if (this.collection.length === 0) {
                this.$el.find('.gistList')
                    .after('<div class="emptyGistList">No Records Found</div>');
            }
        }
    });

    function getAppletId(options) {
        return options.appletConfig.id;
    }

    var VitalsGistView = {
        create: function(options) {
            var vitalsGistView = new VitalsGist(options);
            return vitalsGistView;
        },
        getView: function() {
            return VitalsGist;
        }
    };

    return VitalsGistView;
}