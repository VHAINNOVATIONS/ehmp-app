'use strict';
var dependencies = [
    'backbone',
    'main/ADK',
    'hbs!app/applets/logon/main',
    'app/screens/ScreensManifest',
    'api/UserDefinedScreens',
    'main/ScreenBuilder'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, ADK, mainTemplate, ScreensManifest, UserDefinedScreens, ScreenBuilder) {

    var appletDefinition = {
        appletId: 'logon',
        resource: 'user-service-userinfo',
        mainTemplate: mainTemplate
    };

    var createFullViewApplet = function(appletDefinition) {
        var applet = {
            id: appletDefinition.appletId,
            hasCSS: true,
            getRootView: function() {
                return full(appletDefinition);
            }
        };
        return applet;
    };

    var full = function(appletDefinition) {
        var fullLayoutView = Backbone.Marionette.LayoutView.extend({
            initialize: function() {
                this.appletCompositeView = fullCompositeView(appletDefinition, appletDefinition.mainTemplate);
            },
            onRender: function() {
                this.appletMain.show(this.appletCompositeView);
            },
            template: _.template('<div id="applet-main"></div>'),
            regions: {
                appletMain: '#applet-main'
            }

        });
        return fullLayoutView;
    };

    var SingleFacilityListItemView = Backbone.Marionette.ItemView.extend({
        tagName: "option",
        className: "list-group-item row-layout simple",
        template: _.template('<%= name %>'),
        initialize: function() {
            this.$el.val(this.model.get('siteCode'));
        }
    });

    var FacilityListView = Backbone.Marionette.CollectionView.extend({
        initialize: function(options) {
            var searchOptions = {
                resourceTitle: 'authentication-list',
                cache: false
            };
            this.parentView = options.parentView;
            var self = this;
            searchOptions.onError = function(resp) {
                self.$el.empty().attr('disabled', true).append('<option class="bg-danger" selected="selected" disabled value="noneSelected">Server error while trying to load list of facilities.</option>');
                options.parentView.$el.find('#errorMessage').html('Unable to login due to server error. Status code: ' + resp.status);
            };
            searchOptions.onSuccess = function(resp) {
                self.render();
            };
            this.collection = ADK.ResourceService.fetchCollection(searchOptions);
        },
        attachBuffer: function(collectionView, buffer) {
            if (collectionView.isEmpty()) {
                collectionView.$el.attr('disabled', true).append('<option selected="selected" disabled value="noneSelected">Loading facilities...</option>').append(buffer);
            } else {
                collectionView.$el.removeAttr('disabled').empty().append('<option selected="selected" disabled value="noneSelected">Select a facility...</option>').append(buffer);
            }
        },
        childView: SingleFacilityListItemView,
        tagName: "select",
        className: "form-control",
        attributes: {
            name: "facility",
            id: "facility"
        },
    });

    var fullCompositeView = function(appletDefinition, mainTemplate) {
        var LayoutView = Backbone.Marionette.LayoutView.extend({
            template: mainTemplate,
            regions: {
                facilityListRegion: '#authenication-facility-list'
            },
            initialize: function() {
                this.facilityListView = new FacilityListView({
                    'parentView': this
                });
            },
            onRender: function() {
                this.facilityListRegion.show(this.facilityListView);
            },
            events: {
                submit: 'login',
                'propertychange .form-group': 'clearErrors',
                'change .form-group': 'clearErrors',
                'input .form-group': 'clearErrors',
                'paste .form-group': 'clearErrors'
            },

            clearErrors: function() {
                if (this.$el.find('form').hasClass('has-error')) {
                    this.$el.find('form').removeClass('has-error');
                }
                if (this.$el.find('#errorMessage').hasClass('alert-info')) {
                    this.$el.find('#errorMessage').removeClass('alert-info text-info');
                }
                this.$el.find('#errorMessage').empty();
            },

            login: function(event) {
                event.preventDefault();
                //disable login button
                var login = this.$el.find('#login');
                login.button('loading');

                this.$el.find('#screenReaderAuthenticating').addClass('sr-only').removeClass('hidden').focus();
                var fp = {
                    facility: this.$el.find('form #facility')[0].value,
                    accessCode: this.$el.find('form #accessCode')[0].value,
                    verifyCode: this.$el.find('form #verifyCode')[0].value
                };
                if (fp.facility && fp.accessCode && fp.verifyCode && (fp.facility !== "noneSelected")) {

                    var onSuccessfulLogin = function() {
                        var promise = UserDefinedScreens.getDefaultScreenIdFromScreenConfig();
                        promise.done(function(screenName) {
                            ADK.Navigation.navigate(screenName);
                        });
                        
                    };

                    var thisItemView = this;
                    var onFailedLogin = function(error) {
                        if (error) {
                            switch (error.status) {
                                case 401:
                                    thisItemView.$el.find('#errorMessage').html('Not a valid ACCESS CODE/VERIFY CODE pair.');
                                    thisItemView.$el.find('form').addClass('has-error');
                                    break;
                                case 403:
                                    thisItemView.$el.find('#errorMessage').html('User is not authorized to access this system.');
                                    thisItemView.$el.find('form').addClass('has-error');
                                    break;
                                case 503:
                                    thisItemView.$el.find('#errorMessage').html('SYNC NOT COMPLETE. Please try again in a few minutes.');
                                    thisItemView.$el.find('#errorMessage').addClass('alert-info text-info');
                                    break;
                                default:
                                    thisItemView.$el.find('#errorMessage').html('Unable to login due to server error. Status code: ' + error.status);
                                    thisItemView.$el.find('form').addClass('has-error');
                                    break;
                            }
                        } else {
                            thisItemView.$el.find('#errorMessage').html('Not a valid ACCESS CODE/VERIFY CODE pair.');
                            thisItemView.$el.find('form').addClass('has-error');
                        }
                        //enable login button
                        login.button('reset');
                    };

                    // TODO: Ok to remove the nonLegacy var and its use after the authenticate method has been updated
                    var nonLegacy = true;
                    var authenticateUser = ADK.UserService.authenticate(fp.accessCode, fp.verifyCode, fp.facility, nonLegacy);

                    authenticateUser.done(onSuccessfulLogin).fail(onFailedLogin);

                } else {
                    this.$el.find('form').addClass('has-error');
                    this.$el.find('#errorMessage').html("Please ensure all fields have been entered");
                    //enable login button
                    login.button('reset');

                }
            }
        });

        return new LayoutView();
    };

    return createFullViewApplet(appletDefinition);
}