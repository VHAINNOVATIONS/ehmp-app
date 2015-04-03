var dependencies = [
    "jquery",
    "underscore",
    "main/ADK",
    "backbone",
    "hbs!main/components/views/gists/labresultsView/labresultsGistLayout",
    "hbs!main/components/views/gists/labresultsView/labresultsGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging"


];
define(dependencies, onResolveDependencies);

function onResolveDependencies($, _, ADK, Backbone, labresultsGistLayoutTemplate, labresultsGistChildTemplate, PopoverTemplate, ResourceService, Messaging) {
    'use strict';
    var LabresultsGistItem = Backbone.Marionette.ItemView.extend({
        template: labresultsGistChildTemplate,
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
        onRender: function() {
            this.setPopover();
        }
    });
    var LabresultsGist = Backbone.Marionette.CompositeView.extend({
        template: labresultsGistLayoutTemplate,
        emptyView: Backbone.Marionette.ItemView.extend({
            template: _.template('<div class="emptyGistList">No Records Found</div>')
        }),
        childView: LabresultsGistItem,
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
            this.model.set('gistHeaders', options.gistHeaders);
            this.model.set('appletID', appletID);
            this.childViewContainer = "#" + appletID + "-labresults" + "-gist-items";
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
            $('.labresultsPopover').popover('hide');
        },
        onRender: function() {
        }
    });

    function getAppletId(options) {
        return options.appletConfig.id;
    }

    var LabresultsGistView = {
        create: function(options) {
            var labresultsGistView = new LabresultsGist(options);
            return labresultsGistView;
        },
        getView: function() {
            return LabresultsGist;
        }
    };

    return LabresultsGistView;
}