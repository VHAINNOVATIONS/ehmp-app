define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars',
    'api/Messaging',
    'main/ui_components/workflow/controllerView',
    'main/ui_components/workflow/containerView'
], function(Backbone, Marionette, $, _, Handlebars, Messaging, ControllerView, ContainerView) {

    var HeaderModel = Backbone.Model.extend({
        defaults: {
            'title': '',
            'actionItems': false,
            'popOutToggle': false
        }
    });
    var WorkflowView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile('<div class="{{classPrefix}}-content{{#if showProgress}} with-progress-indicator{{/if}}">{{#if showHeader}}<div class="workflow-header"></div>{{/if}}{{#if showProgress}}<div class="workflow-progressIndicator"></div>{{/if}}<div class="workflow-controller"></div></div>'),
        ui: {
            HeaderRegion: '.workflow-header',
            ProgressIndicatorRegion: '.workflow-progressIndicator',
            ControllerRegion: '.workflow-controller'
        },
        regions: {
            ControllerRegion: '@ui.ControllerRegion'
        },
        events: {
            'keydown input': function(e) {
                if (e.which === 13) { //Prevent IE bug which issues data-dismiss in a modal on enter key
                    e.preventDefault();
                }
            }
        },
        changeHeaderTitle: function(newTitleString) {
            if (_.isString(newTitleString)) {
                this.headerModel.set('title', newTitleString);
            }
        },
        changeHeaderActionItems: function(newActionItemsArray) {
            if (_.isArray(newActionItemsArray)) {
                this.headerModel.set('actionItems', newActionItemsArray);
            }
        },
        changeHeaderCloseButtonOptions: function(newCloseButtonOptions) {
            if (_.isObject(newCloseButtonOptions)) {
                if (_.isFunction(newCloseButtonOptions.onClick)) {
                    this.headerView.events['click button.close.custom-on-close-method'] = _.bind(newCloseButtonOptions.onClick, this.workflowControllerView.getCurrentFormView());
                    this.headerView.delegateEvents();
                    this.headerModel.set('defaultCloseButtonAction', false);
                } else {
                    this.headerModel.set('defaultCloseButtonAction', true);
                }
                if (_.isString(newCloseButtonOptions.title)) {
                    this.headerModel.set('closeButtonTitle', newCloseButtonOptions.title);
                }
            }
        },
        modelEvents: {
            'change:title': 'render',
            'change:showProgress': 'render',
            'change:showHeader': 'render'
        },
        workflowOptionsDefaults: {
            title: '',
            size: '',
            steps: [],
            backdrop: false,
            keyboard: true,
            headerOptions: {}
        },
        initialize: function(options) {
            this.workflowOptions = _.defaults(options, this.workflowOptionsDefaults);
            this.model = new Backbone.Model();
            this.model.set({
                title: this.workflowOptions.title,
                actionItems: this.workflowOptions.headerOptions.actionItems,
                closeButtonOptions: this.workflowOptions.headerOptions.closeButtonOptions,
                popOutToggle: this.workflowOptions.headerOptions.popOutToggle,
                steps: new Backbone.Collection(this.workflowOptions.steps),
                currentIndex: 0,
                showProgress: (this.workflowOptions.steps.length > 1 ? this.workflowOptions.showProgress || false : false),
                showHeader: (_.isBoolean(this.workflowOptions.showHeader) ? this.workflowOptions.showHeader : true),
                classPrefix: this.workflowOptions.classPrefix || 'modal'
            });
        },
        getFormView: function(index) {
            return this.workflowControllerView.children.findByIndex(index);
        },
        showHeader: function() {
            this.addRegion('HeaderRegion', this.ui.HeaderRegion);
            var workflowTitle = this.model.get('title');
            var workflowpopOutToggle = this.model.get('popOutToggle');
            var workflowCloseButtonOptions = this.model.get('closeButtonOptions') || {};
            var workflowactionItems = this.model.get('actionItems');
            if (workflowTitle || workflowactionItems || this.workflowOptions.header) {
                if (this.workflowOptions.header) {
                    this.HeaderView = this.workflowOptions.header.extend({
                        className: this.model.get('classPrefix') + '-header'
                    });
                } else {
                    this.headerModel = new HeaderModel({
                        'title': workflowTitle,
                        'actionItems': workflowactionItems,
                        'popOutToggle': workflowpopOutToggle,
                        'closeButtonTitle': workflowCloseButtonOptions.title,
                        'defaultCloseButtonAction': !_.isFunction(workflowCloseButtonOptions.onClick)
                    });
                    workflowCloseButtonOptions = _.defaults(workflowCloseButtonOptions, {title: "", onClick: function(){}});
                    this.HeaderView = Backbone.Marionette.ItemView.extend({
                        modelEvents: {
                            'change': 'render'
                        },
                        initialize: function(options) {
                            this.workflowControllerView = options.workflowControllerView;
                            this.model = options.model;
                        },
                        events: {
                            'click .dropdown-menu li a': function(e) {
                                e.preventDefault();
                                var menuOptionForClickedItem = this.model.get('actionItems')[this.$(e.currentTarget).attr('data-item-index')];
                                _.bind(menuOptionForClickedItem.onClick, this.workflowControllerView.getCurrentFormView())();
                            },
                            'click button.close.custom-on-close-method': _.bind(workflowCloseButtonOptions.onClick, this.workflowControllerView.getCurrentFormView())
                        },
                        template: Handlebars.compile([
                            '<div class="row">',
                            '<div class="col-md-10 col-xs-10">',
                            '<h4 class="all-padding-no ' + this.model.get('classPrefix') + '-title" id="main-workflow-label">{{title}}</h4>',
                            '</div>',
                            '<div class="col-md-2 col-xs-2">',
                            '<div class="header-btns">',
                            '{{#if actionItems}}',
                            '<div class="col-xs-6 all-padding-no">',
                            '<div class="dropdown">',
                            '<button class="btn btn-icon dropdown-toggle" type="button" id="action-items-dropdown" data-toggle="dropdown" aria-expanded="true">',
                            '<i class="fa fa-ellipsis-v"><span class="sr-only">Settings</span></i>',
                            '</button>',
                            '<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="action-items-dropdown">',
                            '{{#each actionItems}}',
                            '<li role="presentation"><a role="menuitem" data-item-index={{@index}} href="#">{{label}}</a></li>',
                            '{{/each}}',
                            '</ul>',
                            '</div>',
                            '</div>',
                            '{{/if}}',
                            '<div class="right-padding-no{{#if actionItems}} left-padding-xs col-xs-6{{else}} col-xs-6 col-xs-offset-6{{/if}}">',
                            '<button type="button" class="close{{#if defaultCloseButtonAction}}" data-dismiss="modal"{{else}} custom-on-close-method"{{/if}} title="{{#if closeButtonTitle}}{{closeButtonTitle}}{{else}}Press enter to close.{{/if}}">',
                            '<span aria-hidden="true">&times;</span>',
                            '</button>',
                            '</div>',
                            '</div>',
                            '</div>',
                            '</div>'
                        ].join("\n")),
                        className: this.model.get('classPrefix') + '-header'
                    });
                }
                this.headerView = new this.HeaderView({
                    workflowControllerView: this.workflowControllerView,
                    model: this.headerModel
                });
                this.showChildView('HeaderRegion', this.headerView);
            }
        },
        showProgressBar: function() {
            this.addRegion('ProgressIndicatorRegion', this.ui.ProgressIndicatorRegion);
            var ProgressIndicatorChildView = Backbone.Marionette.ItemView.extend({
                tagName: 'li',
                template: Handlebars.compile('<div{{#if completed}} class="completed"{{/if}}><span class="bubble"></span>{{stepTitle}}{{#if currentStep}}<span class="sr-only">You are currently on step {{currentIndex}} of {{numberOfSteps}}</span>{{/if}}'),
                modelEvents: {
                    'change': 'render'
                }
            });
            this.WorkflowProgressIndicatorView = Backbone.Marionette.CollectionView.extend({
                collection: this.model.get('steps'),
                tagName: 'ul',
                className: 'progress-indicator',
                childView: ProgressIndicatorChildView
            });
            this.workflowProgressIndicatorView = new this.WorkflowProgressIndicatorView();
            this.showChildView('ProgressIndicatorRegion', this.workflowProgressIndicatorView);
        },
        onBeforeShow: function() {
            var steps = this.model.get('steps');
            steps.at(0).set({
                'completed': true,
                'currentStep': true,
                'currentIndex': this.model.get('currentIndex') + 1
            });

            _.each(steps.models, function(step) {
                step.set('numberOfSteps', steps.length);
            });

            //Creation of Form Controller
            this.workflowControllerView = new ControllerView({
                model: this.model,
                parentViewInstance: this
            });

            //Creation of Header
            if (this.model.get('showHeader') === true) {
                this.showHeader();
            }
            //Creation of Progressbar View
            if (this.model.get('showProgress') === true) {
                this.showProgressBar();
            }

            //Show of Form Controller
            this.showChildView('ControllerRegion', this.workflowControllerView);
        },
        show: function() {
            var $triggerElem = $(':focus');

            var WorkflowRegion = Messaging.request('get:adkApp:region', 'workflowRegion');
            if (!_.isUndefined(WorkflowRegion)) {
                var workflowContainerView = new ContainerView({
                    workflowOptions: this.workflowOptions,
                    controllerView: this
                });
                WorkflowRegion.show(workflowContainerView);

                WorkflowRegion.currentView.$el.one('hidden.bs.modal', function(e) {
                    WorkflowRegion.empty();
                    $triggerElem.focus();
                });
                WorkflowRegion.currentView.$el.modal('show');
            }
        }
    });

    WorkflowView.hide = function() {
        var currentView = Messaging.request('get:adkApp:region', 'workflowRegion').currentView;
        if (currentView) {
            currentView.$el.modal('hide');
        }
    };
    return WorkflowView;
});