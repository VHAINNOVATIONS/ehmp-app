define([
    'backbone',
    'puppetForm',
    'handlebars'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var ChildView = Backbone.Marionette.ItemView.extend({
        className: PuppetForm.CommonPrototype.className,
        getTemplate: function() {
            if (this.itemTemplate) {
                var label = this.itemTemplate(this.serializeModel(this.model));
                return Handlebars.compile('{{ui-form-checkbox "' + label + '"  labelTemplate=true name=name checked=value id=id disabled=disabled title="Press spacebar to select."}}');
            }
            return Handlebars.compile('{{ui-form-checkbox label name=name checked=value id=id disabled=disabled title="Press spacebar to select."}}');
        },
        initialize: function(options) {
            this.itemTemplate = options.itemTemplate;
            this.attributeMapping = options.attributeMapping;
            this.prefixName = options.prefixName;
        },
        events: {
            "change input": "onChange"
        },
        modelEvents: {
            'optionUpdated': 'render',
            'change': 'render'
        },
        serializeModel: function(model) {
            var attributes = model.toJSON(),
                data = _.defaults({
                    id: this.prefixName + '-' + attributes[this.attributeMapping.unique],
                    name: attributes[this.attributeMapping.unique],
                    value: attributes[this.attributeMapping.value],
                    label: attributes[this.attributeMapping.label],
                    disabled: attributes[this.attributeMapping.disabled] || false
                }, attributes);
            return data;
        },
        getValueFromDOM: function(INPUT) {
            return (INPUT.is(":checked") ? true : false);
        },
        onChange: function(e) {
            e.preventDefault();
            var INPUT = this.$(e.target),
                value = this.getValueFromDOM(INPUT);
            this.stopListening(this.model, "change", this.render);
            this.model.set(this.attributeMapping.value, value);
            this.listenTo(this.model, "change:" + this.attributeMapping.value, this.render);
            this.trigger('checklist-value-change');
        }
    });

    var ChecklistPrototype = {
        defaults: {
            name: "",
            label: "",
            collection: [],
            extraClasses: []
        },
        attributeMappingDefaults: {
            unique: 'name',
            value: 'value',
            label: 'label',
            disabled: 'disabled'
        },
        tagName: 'fieldset',
        template: Handlebars.compile([
            '<legend{{#if srOnlyLabel}} class="sr-only"{{/if}}>{{label}}</legend>',
            '<div class="childView-container{{#if (has-puppetForm-prop "controlsClassName")}} {{PuppetForm "controlsClassName"}}{{/if}}"></div>'
        ].join("\n")),
        ui: {
            'ChildViewContainer': '.childView-container'
        },
        initialize: function(options) {
            this.initOptions(options);
            this.hasAllRequiredOptionsDefined();
            this.setAttributeMapping();
            this.setFormatter();
            this.listenToFieldName();
            this.listenToFieldOptions();
            this.setExtraClasses();
            this.modelName = this.getComponentInstanceName();
            this.initCollection('collection');
            this.selectedCountName = this.field.get('selectedCountName') || null;

            this.itemTemplate = this.field.get('itemTemplate') || null;
            if (this.itemTemplate) {
                this.itemTemplate = _.isFunction(this.itemTemplate) ? this.itemTemplate : _.isString(this.itemTemplate) ? Handlebars.compile(this.itemTemplate) : null;
            }

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

            this.stopListening(this.model, "change:" + this.modelName, this.render);
            this.model.set(this.modelName, this.collection);
            this.listenTo(this.model, "change:" + this.modelName, this.render);
        },
        updateCount: function() {
            var passedAttributes = {};
            passedAttributes[this.attributeMapping.value] = true;
            this.model.set(this.selectedCountName, this.collection.where(passedAttributes).length);
        },
        events: _.defaults({
            //Events to be Triggered By User
            "control:item:disabled": function(event, options) {
                this.changeItemBooleanAttribute(event, options, 'disabled');
            },
            "control:item:value": function(event, options) {
                this.changeItemBooleanAttribute(event, options, 'value');
            }
        }, PuppetForm.CommonPrototype.events),
        changeItemBooleanAttribute: function(event, options, attributeToChange) {
            var itemName = options.itemName || null,
                booleanValue = options.booleanValue;
            if (_.isBoolean(booleanValue)) {
                if (itemName) {
                    this.collection.each(function(model) {
                        if (model.get(this.attributeMapping.unique) === itemName) {
                            model.set(this.attributeMapping[attributeToChange], booleanValue);
                        }
                    }, this);
                } else {
                    this.collection.each(function(model) {
                        model.set(this.attributeMapping[attributeToChange], booleanValue);
                    }, this);
                }
                event.stopPropagation();
            }
        },
        childViewContainer: '@ui.ChildViewContainer',
        childEvents: {
            'checklist-value-change': 'childValueChange'
        },
        childViewOptions: function(model, index) {
            return {
                filter: this.filter,
                attributeMapping: this.attributeMapping,
                prefixName: this.modelName,
                itemTemplate: this.itemTemplate
            };
        },
        getChildView: function(item) {
            if (this.field.get('hideCheckboxForSingleItem') && this.collection.length <= 1) {
                item.set(this.attributeMapping.value, true);
                return ChildView.extend({
                    template: Handlebars.compile('<span class="single-item left-padding-sm">{{label}}</span>'),
                    getTemplate: function() {
                        if (this.itemTemplate) {
                            var label = this.itemTemplate(this.serializeModel(this.model));
                            return Handlebars.compile('<span class="single-item left-padding-sm">' + label + '</span>');
                        }
                        return Handlebars.compile('<span class="single-item left-padding-sm">{{label}}</span>');
                    }
                });
            }
            return ChildView;
        },
        addChild: function(child, ChildView, index) {
            if (_.isString(child.get(this.attributeMapping.label))) {
                Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            }
        },
        childValueChange: function() {
            var model = this.model,
                attrArr = this.field.get("name").split('.'),
                name = attrArr.shift(),
                path = attrArr.join('.');
            if (this.model.errorModel instanceof Backbone.Model) {
                if (_.isEmpty(path)) {
                    this.model.errorModel.unset(name);
                } else {
                    var nestedError = this.model.errorModel.get(name);
                    if (nestedError) {
                        this.keyPathSetter(nestedError, path, null);
                        this.model.errorModel.set(name, nestedError);
                    }
                }
            }
        }
    };

    var Checklist = PuppetForm.ChecklistControl = Backbone.Marionette.CompositeView.extend(
        _.defaults(ChecklistPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return Checklist;
});