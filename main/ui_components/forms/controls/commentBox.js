define([
    'backbone',
    'puppetForm',
    'handlebars',
    'api/UserService',
    'moment'
], function(Backbone, PuppetForm, Handlebars, UserService, Moment) {
    'use strict';
    var CommentItemView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile([
            '<div class="table-cell">' +
            '<span>{{comment}} {{timeStamp}} - {{name}}</span>' +
            '</div>',
            '<div class="table-cell pixel-width-55 text-right">',
            '{{#if userIsAllowedEditDelete}}' +
            '<span>',
            '<button type="button" class="comment-edit-button btn btn-icon right-padding-xs left-padding-xs" title="Press enter to edit comment: {{comment}} {{timeStamp}} - {{name}}">' +
            '<i class="fa fa-pencil"></i></button>',
            '<button type="button" class="comment-delete-button button btn btn-icon right-padding-xs left-padding-xs" title="Press enter to delete this comment">' +
            '<i class="fa fa-trash"></i></button>',
            '</span>' +
            '{{/if}}',
            '</div>'
        ].join("\n")),
        ui: {
            'CommentEditButton': '.comment-edit-button',
            'CommentDeleteButton': '.comment-delete-button',
        },
        events: {
            'click @ui.CommentEditButton': 'queueEditComment',
            'click @ui.CommentDeleteButton': 'removeComment'
        },
        initialize: function(options) {
            this.formModel = options.formModel;
            this.attributeMapping = options.attributeMapping;
            this.field = options.field;
            this.commentInputModel = options.commentInputModel;
        },
        modelEvents: {
            'change': 'render'
        },
        serializeModel: function(model) {
            return {
                comment: model.get(this.attributeMapping.comment),
                author: model.get(this.attributeMapping.author),
                timeStamp: model.get(this.attributeMapping.timeStamp),
                name: (model.get(this.attributeMapping.author) ? model.get(this.attributeMapping.author).name : '')
            };
        },
        queueEditComment: function(e) {
            this.triggerMethod('queue:edit:comment');
        },
        removeComment: function(e) {
            this.triggerMethod('remove:comment');
        },
        className: 'table-row',
        templateHelpers: function() {
            var self = this;
            return {
                userIsAllowedEditDelete: function() {
                    var currentUser = UserService.getUserSession();
                    if (this[self.attributeMapping.author] && _.isEqual(currentUser.get('duz'), this[self.attributeMapping.author].duz)) {
                        return true;
                    }
                    return false;
                }
            };
        },
        onDomRefresh: function() {
            if ((!_.isNull(this.commentInputModel.get('commentIndex')) && this._index === this.commentInputModel.get('commentIndex')) || (_.isNull(this.commentInputModel.get('commentIndex')) && !this.commentInputModel.get('editMode'))) {
                this.ui.CommentEditButton.focus();
            }
        }
    });

    var CommentButtonView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile([
            '{{#if editMode}}' +
            '<div class="col-xs-6">',
            '<button type="button" class="cancel-edit-comment-button btn btn-default btn-block btn-sm" title="Press enter to cancel edit of comment">Cancel</button>',
            '</div>',
            '<div class="col-xs-6">',
            '<button type="button" class="edit-comment-button btn btn-default btn-block btn-sm" title="Press enter to save edit of comment">Save</button>',
            '</div>',
            '{{else}}' +
            '<div class="col-xs-12">',
            '<button type="button" class="add-comment-button btn btn-default btn-block btn-sm" title="Press enter to add comment" disabled="disabled">Add Comment</button>',
            '</div>' +
            '{{/if}}'
        ].join('\n')),
        ui: {
            'AddCommentButton': '.add-comment-button',
            'EditCommentButton': '.edit-comment-button',
            'CancelEditCommentButton': '.cancel-edit-comment-button'
        },
        events: {
            'click @ui.AddCommentButton': 'addComment',
            'click @ui.EditCommentButton': 'editComment',
            'click @ui.CancelEditCommentButton': 'cancelEditComment',
            'addbutton:disabled': function(e, booleanValue) {
                this.ui.AddCommentButton.attr('disabled', booleanValue);
            }
        },
        addComment: function(e) {
            this.triggerMethod('add:comment');
        },
        editComment: function(e) {
            this.triggerMethod('edit:comment');
        },
        cancelEditComment: function(e) {
            this.triggerMethod('cancel:edit:comment');
        },
        modelEvents: {
            'change:editMode': 'render'
        }
    });

    var CommentCollectionView = Backbone.Marionette.CollectionView.extend({
        childView: CommentItemView,
        childViewOptions: function() {
            return {
                attributeMapping: this.attributeMapping,
                formModel: this.formModel,
                field: this.field,
                commentInputModel: this.commentInputModel
            };
        },
        initialize: function(options) {
            this.attributeMapping = options.attributeMapping;
            this.formModel = options.formModel;
            this.field = options.field;
            this.commentInputModel = options.commentInputModel;
        },
        className: "body"
    });

    var CommentBoxPrototype = {
        attributeMappingDefaults: {
            comment: "commentString",
            author: "author",
            timeStamp: "timeStamp"
        },
        className: function() {
            return PuppetForm.CommonPrototype.className() + ' comment-box bottom-margin-none';
        },
        template: Handlebars.compile([
            '<div class="faux-table-container comments-container"><div class="comment-region faux-table all-margin-no top-border"></div></div>',
            '<div class="comment enter-comment-region top-margin-xs">',
            '<div class="enter-comment-input-region col-xs-10"></div>',
            '<div class="enter-comment-button-region col-xs-2"></div>',
            '</div>'
        ].join('\n')),
        ui: {
            'CommentRegion': '.comment-region',
            'EnterCommentRegion': '.enter-comment-region',
            'EnterCommentInputRegion': '.enter-comment-input-region',
            'EnterCommentButtonRegion': '.enter-comment-button-region'
        },
        regions: {
            'CommentRegion': '@ui.CommentRegion',
            'EnterCommentRegion': '@ui.EnterCommentRegion',
            'EnterCommentInputRegion': '@ui.EnterCommentInputRegion',
            'EnterCommentButtonRegion': '@ui.EnterCommentButtonRegion'
        },
        events: _.defaults({
            'input @ui.EnterCommentInputRegion input': function(e) {
                var currentString = this.$(e.target).val();
                if (currentString.length > 0 && this.previousInputString.length === 0) {
                    this.commentButtonView.$el.trigger('addbutton:disabled', false);
                } else if (currentString.length === 0 && this.previousInputString.length > currentString.length) {
                    this.commentButtonView.$el.trigger('addbutton:disabled', true);
                }
                this.previousInputString = currentString;
            }
        }, PuppetForm.CommonPrototype.events),
        initialize: function(options) {
            this.formModel = options.formModel || null;
            this.initOptions(options);
            this.setAttributeMapping();
            this.setFormatter();
            this.listenToFieldOptions();
            var name = this.getComponentInstanceName();

            this.initCollection('collection');
            this.collection = options.collection || this.collection;
            // input region's views
            var commentInputViewField = new PuppetForm.Field({
                control: "input",
                name: "inputString",
                title: "Please enter in a comment",
                placeholder: "Add comment",
                maxlength: 60,
                charCount: true,
                label: "Enter a comment",
                srOnlyLabel: true
            });
            var CommentInputModel = Backbone.Model.extend({
                defaults: {
                    inputString: "",
                    editMode: false,
                    commentIndex: null
                }
            });
            this.commentInputModel = new CommentInputModel();
            this.commentInputView = new PuppetForm.InputControl({
                field: commentInputViewField,
                model: this.commentInputModel
            });
            this.commentButtonView = new CommentButtonView({
                model: this.commentInputModel,
                field: this.field
            });
            // comments collection view
            this.commentCollectionView = new CommentCollectionView({
                collection: this.collection,
                formModel: this.formModel,
                attributeMapping: this.attributeMapping,
                field: this.field,
                commentInputModel: this.commentInputModel
            });

            this.stopListening(this.model, "change:" + name, this.render);
            this.model.set(name, this.collection);
            this.listenTo(this.model, "change:" + name, this.render);

            this.listenToFieldName();
            var self = this;
            this.listenTo(this.collection, 'change add remove', function() {
                self.model.trigger('change');
            });
            this.previousInputString = "";
        },
        childEvents: {
            'queue:edit:comment': function(child) {
                $.fn.focusTextToEnd = function() {
                    this.focus();
                    var $thisVal = this.val();
                    this.val('').val($thisVal);
                    return this;
                };
                this.commentInputModel.set({
                    inputString: child.model.get(this.attributeMapping.comment),
                    editMode: true,
                    commentIndex: child._index
                });
                this.ui.EnterCommentInputRegion.find('input').trigger('input').focusTextToEnd();
            },
            'remove:comment': function(child) {
                var self = this;
                child.$el.addClass('hidden');
                var deleteCommentAlert = new ADK.UI.Alert({
                    title: "Comment Deleted",
                    icon: "fa-exclamation-triangle",
                    messageView: Backbone.Marionette.ItemView.extend({
                        template: Handlebars.compile(['<p>You have deleted a comment.</p>'].join('\n'))
                    }),
                    footerView: Backbone.Marionette.ItemView.extend({
                        template: Handlebars.compile([
                            '{{ui-button "Restore" type="button" classes="btn-sm btn-default restore-button" title="Press enter to restore."}}',
                            '{{ui-button "Okay" type="button" classes="btn-sm btn-primary no-button" title="Press enter to continue."}}'
                        ].join('\n')),
                        ui: {
                            'NoButton': '.no-button',
                            'RestoreButton': '.restore-button'
                        },
                        events: {
                            'click @ui.RestoreButton': function() {
                                ADK.UI.Alert.hide();
                                child.$el.removeClass('hidden');
                                child.ui.CommentEditButton.focus();
                            },
                            'click @ui.NoButton': function() {
                                ADK.UI.Alert.hide();
                                if (self.commentInputModel.get('editMode') === true) {
                                    self.commentInputModel.set({
                                        inputString: self.ui.EnterCommentInputRegion.find('input').val(''),
                                        editMode: false
                                    });
                                }
                                self.collection.remove(child.model);
                                if (!_.isUndefined(self.collection.at(child._index))) {
                                    var childToReceiveFocus = self.CommentCollectionView.children.find(function(childView) {
                                        return childView._index === child._index;
                                    });
                                    if (childToReceiveFocus) {
                                        childToReceiveFocus.ui.CommentEditButton.focus();
                                    }
                                } else {
                                    self.ui.EnterCommentInputRegion.find('input').focus();
                                }
                            }
                        }
                    })
                });
                deleteCommentAlert.show();
            },
            'add:comment': function(child) {
                this.saveComment();
            },
            'edit:comment': function(child) {
                this.saveComment();
            },
            'cancel:edit:comment': function(child) {
                this.ui.EnterCommentInputRegion.find('input').val('').trigger('input');
                this.commentInputModel.set({
                    inputString: this.ui.EnterCommentInputRegion.find('input').val(),
                    editMode: false
                });
                var triggeringChild = this.commentCollectionView.children.find(function(childView) {
                    return childView._index === this.commentInputModel.get('commentIndex');
                }, this);
                if (triggeringChild) {
                    triggeringChild.ui.CommentEditButton.focus();
                }
            }
        },
        commonRender: PuppetForm.CommonPrototype.onRender,
        onRender: function() {
            this.commonRender();
            this.showChildView('CommentRegion', this.commentCollectionView);
            this.showChildView('EnterCommentInputRegion', this.commentInputView);
            this.showChildView('EnterCommentButtonRegion', this.commentButtonView);
        },
        saveComment: function() {
            this.commentInputModel.set('inputString', this.ui.EnterCommentInputRegion.find('input').val());
            if (this.commentInputModel.get('inputString').length > 0) {
                var currentUser = UserService.getUserSession();
                var authorObject = {
                    name: currentUser.get('lastname') + ',' + currentUser.get('firstname'),
                    duz: currentUser.get('duz')
                };
                var commentIndex = this.commentInputModel.get('commentIndex');
                if (!this.commentInputModel.get('editMode')) {
                    var newModelObject = {};
                    newModelObject[this.attributeMapping.comment] = this.commentInputModel.get('inputString');
                    newModelObject[this.attributeMapping.author] = authorObject;
                    newModelObject[this.attributeMapping.timeStamp] = new Moment().format('MM/DD/YYYY h:mma');
                    this.commentInputModel.set('commentIndex', this.collection.length);
                    this.collection.add(new Backbone.Model(newModelObject));
                } else if (this.commentInputModel.get('editMode') && (this.collection.at(commentIndex).get(this.attributeMapping.comment) != this.commentInputModel.get('inputString'))) {
                    var model = this.collection.at(commentIndex);
                    model.set(this.attributeMapping.comment, this.commentInputModel.get('inputString'));
                    model.set(this.attributeMapping.author, authorObject);
                    model.set(this.attributeMapping.timeStamp, new Moment().format('MM/DD/YYYY h:mma'));
                }
                this.ui.EnterCommentInputRegion.find('input').val('').trigger('input');
                this.commentInputModel.set({
                    inputString: this.ui.EnterCommentInputRegion.find('input').val(),
                    editMode: false
                });
            }
        }
    };

    var CommentBox = PuppetForm.CommentBoxControl = Backbone.Marionette.LayoutView.extend(
        _.defaults(CommentBoxPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return CommentBox;
});
