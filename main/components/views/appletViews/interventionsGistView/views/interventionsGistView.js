var dependencies = [
    "jquery",
    "underscore",
    "main/Utils",
    "backbone",
    "hbs!main/components/views/appletViews/interventionsGistView/templates/interventionsGistLayout",
    "hbs!main/components/views/appletViews/interventionsGistView/templates/interventionsGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging"


];
define(dependencies, onResolveDependencies);

function onResolveDependencies($, _, Utils, Backbone, interventionsGistLayoutTemplate, interventionsGistChildTemplate, PopoverTemplate, ResourceService, Messaging) {
    'use strict';
    var InterventionsGistItem = Backbone.Marionette.ItemView.extend({
        template: interventionsGistChildTemplate,
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
            'hover #gist-main-info': function(event) {
                var gistID = $(event.target).attr('id');
                $('#' + gistID).blur();
            },
            'focus #gist-main-info': function(event) {
                var gistItem = $(event.target);
                gistItem.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        gistItem.trigger('click');
                    }
                });
            },
            'click #gist-main-info': function(event) {

                $('.gistPopover').popover('hide');
                //$(this.el).find('[data-toggle="tooltip"]').tooltip('hide');
                event.preventDefault();
                event.stopImmediatePropagation();
                var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                var channelObject = {
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
        getGistItemGraphicClass: function(gistGraphicType) {
            switch (gistGraphicType.toUpperCase()) {
                case 'NONE':
                    return 'noChange';
                case 'UPARROW':
                    return 'fa fa-caret-up changeArrow';
                case 'DOWNARROW':
                    return 'fa fa-caret-down changeArrow';
                case 'EXCLAMATION-CIRCLE':
                    return 'fa fa-exclamation-circle discontinuedMed';
                case 'EXPIRED':
                    return 'expiredMed';
                case 'NEW':
                    return 'newMed';
                default:
                    return 'noChange';
            }
        },
        getInterventionSeverityClass: function(interventionCount) {
            switch (interventionCount.toUpperCase()) {
                case '0':
                    return 'label label-danger labelSizeCorrection';
                case '1':
                    return 'label label-warning labelSizeCorrection';
                case 'EXP':
                    return 'expiredMedWarning';
                default:
                    return 'lineCorrection';
            }
        },
        onRender: function() {
            var severityCheck = $(this.el).find('div[count]');
            var graphic = $(this.el).find('div[graphic]');
            var severity = (this.getInterventionSeverityClass(severityCheck.text()));
            severityCheck.addClass(severity);
            var graphicClass = this.getGistItemGraphicClass(graphic.attr('graphic'));
            var changeText = '';
            switch (graphicClass) {
                case 'expiredMed':
                    graphic.text('Exp');
                    changeText = 'Expired';
                    break;
                case 'newMed':
                    graphic.text('New');
                    changeText = 'New';
                    break;
                case 'fa fa-caret-down changeArrow':
                    changeText = 'Decreased';
                    break;
                case 'fa fa-exclamation-circle discontinuedMed':
                    changeText = 'Discontinued';
                    break;
                case 'fa fa-caret-up changeArrow':
                    changeText = 'Increased';
                    break;
                case 'noChange':
                    graphic.text('--');
                    changeText = 'No Change';
                    break;
            }
            graphic.addClass(graphicClass);
            var countText = $(this.el).find('#count').text();
            if (countText === '-1') {
                countText = 'Unknown';
                $(this.el).find('#count').text('NA');
            }
            var infoText = countText + ' refills left. Change: ' + changeText + ', Age: ' + $(this.el).find('#age').attr('title');
            $(this.el).find('.quickDraw').attr('aria-label', infoText);
            this.setPopover();
        },
        showPopover: function(evt, popoverElement) {
            evt.stopPropagation();
            $('[data-toggle=popover]').not(popoverElement).popover('hide');
            popoverElement.popover('toggle');
            var selectedGistItem = $(this.el);
            var leftAdjust = selectedGistItem.offset().left;
            var widthAdjust = selectedGistItem.width() * 0.75;
            $('.gistPopover').css('left', leftAdjust.toString() +"px");
            $('.gistPopover').width(widthAdjust);
        },
        setPopover: function() {
            var self = this;
            var PopoverView = Backbone.Marionette.ItemView.extend({
                template: PopoverTemplate
            });
            this.$el.find('[data-toggle=popover]').popover({
                trigger: 'manual',
                html: 'true',
                container: 'body',
                template: (new PopoverView().template()),
                placement: 'bottom',
            }).click(function(evt) {
                self.showPopover(evt, $(this));
            }).focus(function(evt) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
                $(this).keyup(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (e.keyCode === 13 || e.keyCode === 32) {
                        self.showPopover(evt, $(this));
                    }
                });

            });
        },
    });
    var InterventionsGist = Backbone.Marionette.CompositeView.extend({
        template: interventionsGistLayoutTemplate,
        childView: InterventionsGistItem,
        emptyView: Backbone.Marionette.ItemView.extend({
            template: _.template('<div class="emptyGistList">No Records Found</div>')
        }),
        events: {
            'click .header': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                $('[data-toggle=popover]').popover('hide');
                this.sortCollection($(event.target));
            },
            'focus .header': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                $('[data-toggle=popover]').popover('hide');
                var currentHeaderFocus = $(event.target);
                var self = this;
                currentHeaderFocus.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        console.log("key pressed");
                        self.sortCollection(currentHeaderFocus);
                    }
                });
            },
        },
        initialize: function(options) {
            this._super = Backbone.Marionette.CompositeView.prototype;
            var appletID = getAppletId(options);
            this.childViewOptions = {
                AppletID: appletID,
            };
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };
            this.collection.on("filterDone", function() {
            }, this);
            this.collection = options.collection;
            this.gistModel = options.gistModel;

            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model({

            });
            this.model.set('gistHeaders', options.gistHeaders || {
                name: 'Medication',
                description: '',
                graphic: 'Change',
                age: 'Age',
                count: 'Refills'
            });
            this.model.set('appletID', appletID);
            this.childViewContainer = "#" + appletID + "-interventions" + "-gist-items";
            //this._super.initialize.apply(this, arguments);
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
        sortCollection: function(headerElement) {
            /* clear existing collection comparator to allow collection to rerender after sort */
            this.collection.comparator = null;
            if (headerElement.attr("sortable") === "true") {
                var nextSortOrder = '';
                switch (headerElement.attr("sortDirection")) {
                    case 'asc':
                        nextSortOrder = 'desc';
                        break;
                    case 'desc':
                        nextSortOrder = 'none';
                        break;
                    case 'none':
                        nextSortOrder = 'asc';
                        break;
                }
                this.$el.find('.header').attr("sortDirection", 'none');
                headerElement.attr("sortDirection", nextSortOrder);
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-up');
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-down');

                if (nextSortOrder === "asc") {
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').addClass('fa-caret-up');
                } else if (nextSortOrder === "desc") {
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').addClass('fa-caret-down');
                }

                if (nextSortOrder === 'none') {
                    Utils.CollectionTools.resetSort(this.collection);
                } else {
                    var sortType = headerElement.attr("sortType");
                    var key = headerElement.attr("sortKey");
                    Utils.CollectionTools.sort(this.collection, key, nextSortOrder, sortType);
                }
            }


        },
        onStop: function() {
            $('.gistPopover').popover('hide');
        }
    });

    function getAppletId(options) {
        if (_.isUndefined(options.appletConfig.instanceId)) {
            return options.appletConfig.id;
        } else {
            return options.appletConfig.instanceId;
        }
    }

    var InterventionsGistView = {
        create: function(options) {
            var interventionsGistView = new InterventionsGist(options);
            return interventionsGistView;
        },
        getView: function() {
            return InterventionsGist;
        }
    };

    return InterventionsGistView;
}