define([
    'backbone',
    'puppetForm',
    'handlebars',
    'underscore'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';
    var HeaderColumnView = Backbone.Marionette.ItemView.extend({
        className: 'toc-table-header-btn',
        template: Handlebars.compile([
            '<a class="btn btn-primary btn-sm center-block {{id}}" title="{{title}}" aria-hidden="true">{{label}}</button>',
        ].join('\n')),
        events: {
            'click': 'controlTOCHeaderClick',
            'control:TOC:header:click': 'controlTOCHeaderClick'
        },
        initialize: function() {
            this._columnIterationValue = true;
        },
        'controlTOCHeaderClick': function(event) {
            this.triggerMethod('control:TOC:header:click');
            this.next();
        },
        next: function() {
            this._columnIterationValue = !this._columnIterationValue;
        }
    });

    var HeaderCollectionView = Backbone.Marionette.CollectionView.extend({
        className: 'toc-table-header',
        initialize: function(options) {
            this.controlView = options.controlView;
            this.collection = options.collection;
        },
        childView: HeaderColumnView,
        childEvents: {
            'control:TOC:header:click': function(child) {
                this.controlView.toggleRadioButtonsInColumn(child._columnIterationValue, child.model.get('id'));
            }
        }
    });

    var BodyRowColumnView = Backbone.Marionette.ItemView.extend({
        className: 'toc-option',
        getTemplate: function() {
            if (this.model.has(this.attributeMapping.columnItemName)) {
                return Handlebars.compile([
                    '<div class="control form-group {{columnId}}-radio-group">',
                    '<div class="radio{{#if disabled}} disabled{{/if}}">',
                    '<label for="row-{{rowIndex}}-{{columnId}}-yes">',
                    '<input{{yesCheckedValue}}{{#if disabled}} disabled{{/if}} type="radio" class="{{columnId}}" name="row-{{rowIndex}}-{{columnId}}" id="row-{{rowIndex}}-{{columnId}}-yes" value="yes" title="Press tab to view options. Press spacebar to select yes for {{title}}">' +
                    ' Yes',
                    '</label>',
                    '<label for="row-{{rowIndex}}-{{columnId}}-no">',
                    '<input{{noCheckedValue}}{{#if disabled}} disabled{{/if}} type="radio" class="{{columnId}}" name="row-{{rowIndex}}-{{columnId}}" id="row-{{rowIndex}}-{{columnId}}-no" value="no" title="Press tab to view options. Press spacebar to select no for {{title}}">' +
                    ' No',
                    '</label>',
                    '</div>',
                    '</div>',
                ].join('\n'));
            }
            return false;
        },
        templateHelpers: function() {
            return {
                yesCheckedValue: function() {
                    return _.isBoolean(this.value) && this.value ? ' checked' : '';
                },
                noCheckedValue: function() {
                    return _.isBoolean(this.value) && !this.value ? ' checked' : '';
                }
            };
        },
        events: {
            'change input:radio': 'updateModelValue'
        },
        initialize: function(options) {
            this.attributeMapping = options.attributeMapping;
            this._privateAttributes = options._privateAttributes;
            this.listenTo(this._privateAttributes, 'change:disabled', this.render);
        },
        serializeModel: function(model) {
            return _.defaults(model.toJSON(), this._privateAttributes.toJSON());
        },
        updateModelValue: function(e) {
            this.model.set(this.attributeMapping.columnItemValue, this.$el.find("input:checked").val() === "yes");
            this.trigger('row:radio:click');
        }
    });

    var BodyRowCompositeView = Backbone.Marionette.CompositeView.extend({
        tagName: 'fieldset',
        className: function() {
            var className = "toc-row";
            if (this.model.get('disabled')) {
                className += ' row-disabled';
            }
            return className;
        },
        events: {
            'change input:checkbox': 'checkbox:value:change',
            'control:TOC:checkbox:disable': 'disableCheckbox'
        },
        'checkbox:value:change': function(event) {
            this.model.set('value', this.$(event.currentTarget).is(":checked"));
        },
        template: Handlebars.compile([
            '<legend class="sr-only">{{label}}</legend>',
            '<div class="toc-flex">',
            '<div class="toc-row-title-region">',
            '<div class="toc-row-title">',
            '<div class="control form-group checkbox-control">',
            '<div class="checkbox">',
            '<label for={{clean-for-id id}} class="sr-only">{{label}}</label>',
            '<input type="checkbox" id={{clean-for-id id}} name="{{id}}"' +
            '{{#if value}} checked {{/if}}>',
            '</div>',
            '</div>',
            '<p class="faux-legend">{{label}}</p>',
            '</div>',
            '</div>',
            '<div class="toc-row-options"></div>',
            '</div>'
        ].join('\n')),
        ui: {
            'RowColumnRegionSelector': '.toc-row-options'
        },
        // COME BACK TO
        // events: {
        //     'control:TOC:row:disable': function(e, booleanValue) {
        //         this.model.set('disabled', booleanValue);
        //         if (!_.isUndefined(booleanValue)) {
        //             if (booleanValue) {
        //                 this.$el.addClass('row-disabled');
        //             } else {
        //                 this.$el.removeClass('row-disabled');
        //             }
        //             this.titleView.disableCheckbox(e, booleanValue);
        //             this.radiosView.disableRadioGroupCollection(e, booleanValue);
        //         }
        //     }
        // },
        childViewContainer: '@ui.RowColumnRegionSelector',
        childView: BodyRowColumnView,
        childViewOptions: function(model, index) {
            return {
                model: this.model.get(this.attributeMapping.columnCollection).find(function(item) {
                    return item.get(this.attributeMapping.columnItemName) == model.get('id');
                }, this) || new Backbone.Model(),
                _privateAttributes: new Backbone.Model({
                    columnId: model.get('id'),
                    title: model.get('title'),
                    disabled: !this.model.get(this.attributeMapping.value),
                    rowIndex: this.rowIndex,
                    columnIndex: index
                }),
                attributeMapping: this.attributeMapping
            };
        },
        childEvents: {
            'row:radio:click': function() {
                this.model.trigger('change');
            }
        },
        modelEvents: {},
        serializeModel: function(model) {
            return {
                id: model.get(this.attributeMapping.id),
                label: model.get(this.attributeMapping.label),
                value: model.get(this.attributeMapping.value) || false
            };
        },
        updateColumnsDisabledStatus: function(model) {
            this.children.each(function(view) {
                //silent true because the item view is listing for change of disabled on its _privateAttributes model
                // view.model.set(this.attributeMapping.columnItemValue, null, {
                //    silent: true
                // });
                view._privateAttributes.set('disabled', !this.model.get(this.attributeMapping.value));
            }, this);
        },
        initialize: function(options) {
            this.attributeMapping = options.attributeMapping;
            this.rowIndex = options.rowIndex;
            this.modelEvents['change:' + this.attributeMapping.value] = 'updateColumnsDisabledStatus';
            this.delegateEvents();
            var columnCollection = this.model.get(this.attributeMapping.columnCollection);
            if (!_.isUndefined(columnCollection)) {
                if (!(columnCollection instanceof Backbone.Collection)) {
                    if (_.isArray(columnCollection)) {
                        this.setColumnCollectionOnModel(columnCollection);
                    } else {
                        console.error('Type Error: expecting array or Backbone collection for ToggleOptionsChecklist control\'s columnCollection \n model:', this.model);
                        this.setColumnCollectionOnModel([]);
                    }
                }
            } else {
                this.setColumnCollectionOnModel([]);
            }
        },
        setColumnCollectionOnModel: function(array) {
            this.model.set(this.attributeMapping.columnCollection, new Backbone.Collection(array), {
                silent: true
            });
        }
    });

    var BodyCollectionView = Backbone.Marionette.CollectionView.extend({
        className: 'toc-table-body',
        initialize: function(options) {
            this.attributeMapping = options.attributeMapping;
            this.columnHeaders = options.columnHeaders;
        },
        childView: BodyRowCompositeView,
        childViewOptions: function(model, index) {
            return {
                rowIndex: index,
                collection: this.columnHeaders,
                attributeMapping: this.attributeMapping
            };
        }
    });

    var ToggleOptionsChecklistPrototype = {
        className: 'control form-group toc row',
        template: Handlebars.compile([
            '<div class="toc-description">',
            '<p><strong>{{label}}</strong></p>',
            '</div>',
            '<div class="toc-table">',
            '<div class="toc-table-header-region"/>',
            '<div class="toc-table-body-region"/>',
            '</div>'
        ].join('\n')),
        ui: {
            'HeaderRegionSelector': '.toc-table-header-region',
            'BodyRegionSelector': '.toc-table-body-region'
        },
        regions: {
            'HeaderRegion': '@ui.HeaderRegionSelector',
            'BodyRegion': '@ui.BodyRegionSelector'
        },
        attributeMappingDefaults: {
            id: 'id',
            value: 'value',
            label: 'label',
            columnCollection: 'columnCollection',
            columnItemName: 'name',
            columnItemValue: 'value'
        },
        events: {
            'control:TOC:header:click': function(e, headerTag) {
                this.HeaderRegion.currentView.trigger('control:TOC:header:click');
            },
            'control:TOC:header:add': function(e, buttonDefinition) {
                this.columnHeaders.add(buttonDefinition);
            },
            'control:TOC:header:remove': function(e, buttonDefinition) {
                this.columnHeaders.remove(this.columnHeaders.where(buttonDefinition));
            },
            'control:TOC:header:update': function(e, buttonDefinitions) {
                this.columnHeaders.reset(buttonDefinitions);
            },
            // 'control:TOC:rows:add': function(e, rowDefinition) {
            //     _.defaults(rowDefinition, this.rowDefinitionDefault);
            //     this.collection.add(rowDefinition);
            // },
            // 'control:TOC:rows:remove': function(e, rowDefinition) {
            //     var models = this.collection.where(rowDefinition);
            //     this.collection.remove(models);
            // },
            // 'control:TOC:rows:update': function(e, rowDefinitions) {
            //     this.collection.reset(rowDefinitions);
            // }
        },
        initialize: function(options) {
            this.initOptions(options);
            this.hasAllRequiredOptionsDefined();
            this.setAttributeMapping();
            this.setFormatter();
            this.listenToFieldName();
            this.listenToFieldOptions();
            this.setExtraClasses();
            this.initCollection('collection');
            this.selectedCountName = this.field.get('selectedCountName') || null;

            this.initColumnHeaderCollection(this.field.get('columnHeaders'));
            this.label = options.field.get('label') || '';

            var self = this;
            if (this.selectedCountName) {
                this.listenTo(this.collection, 'change', function() {
                    self.updateCount();
                    self.model.trigger('change');
                });
                this.updateCount();
            } else {
                this.listenTo(this.collection, 'change', function() {
                    self.model.trigger('change');
                });
            }

            this.stopListening(this.model, 'change:' + this.modelName, function() {
                this.render();
            });
            this.model.set(this.modelName, this.collection);
            this.listenTo(this.model, 'change:' + this.modelName, function() {
                this.render();
            });
        },
        onShow: function() {
            this.showChildView('HeaderRegion', new HeaderCollectionView({
                collection: this.columnHeaders,
                controlView: this
            }));
            this.showChildView('BodyRegion', new BodyCollectionView({
                collection: this.model.get(this.modelName),
                attributeMapping: this.attributeMapping,
                columnHeaders: this.columnHeaders
            }));
        },
        serializeModel: function() {
            return {
                label: new Handlebars.SafeString(this.label)
            };
        },
        updateCount: function() {
            var passedAttributes = {};
            passedAttributes[this.attributeMapping.value] = true;
            this.model.set(this.selectedCountName, this.collection.where(passedAttributes).length);
        },
        initColumnHeaderCollection: function(columnHeaders) {
            if (!_.isUndefined(columnHeaders)) {
                if (columnHeaders instanceof Backbone.Collection) {
                    this.columnHeaders = columnHeaders;
                } else {
                    //not already in the form of a collection
                    this.columnHeaders = new Backbone.Collection(columnHeaders);
                }
            } else {
                this.columnHeaders = new Backbone.Collection();
            }
        },
        toggleRadioButtonsInColumn: function(bool, id) {
            // CLEAN UP
            this.BodyRegion.currentView.$('input[type="radio"]:enabled[value=' + (bool ? 'yes' : 'no') + '].' + id).click();
        }
    };

    var ToggleOptionsChecklistControl = PuppetForm.ToggleOptionsChecklistControl = Backbone.Marionette.LayoutView.extend(
        _.defaults(ToggleOptionsChecklistPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions, PuppetForm.CommonContainerEventsFunctions))
    );

    return ToggleOptionsChecklistControl;
});