var dependencies = [
    "backbone",
    "marionette",
    "jquery",
    "underscore",
    "main/ADK",
    "hbs!main/components/views/ccowFooterTemplate",
    'app/screens/ScreensManifest'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, $, _, ADK, ccowFooterTemplate, ScreensManifest) {
    'use strict';

    var CCOWModalView = {
        activateModal: function(CCOWService, patient, bodyText){
            var modalOptions = {
                'title': 'Context Change',
                'footerView': this.getFooterView(CCOWService, patient),
                'headerView': this.getHeaderView(),
                'keyboard': false,
                'backdrop': 'static',
                'callShow': true
            };

            ADK.showModal(this.getModalView(bodyText), modalOptions);

        },
        getFooterView: function(CCOWService, patient){
            var CCOWFooterView = Backbone.Marionette.ItemView.extend({
                template: ccowFooterTemplate,
                events: {
                    'click #cancelContextChangeBtn': 'cancelContextChange',
                    'click #breakContextBtn': 'breakContextLink',
                    'click #forceContextChangeBtn': 'forceContextChange'
                },
                cancelContextChange: function(){
                    CCOWService.cancelContextChange(function(){
                        ADK.hideModal();
                    }, function(){
                        ADK.hideModal();
                    });
                },
                breakContextLink: function(){
                    var callback = function(){
                        ADK.Messaging.trigger("patient:selected", patient);
                        ADK.Navigation.navigate(ScreensManifest.defaultScreen);
                    };

                    CCOWService.breakContextLink(callback, callback);
                },
                forceContextChange: function(){
                    var callback = function(){
                        ADK.Messaging.trigger("patient:selected", patient);
                        ADK.Navigation.navigate(ScreensManifest.defaultScreen);
                    };

                    CCOWService.forceContextChange(callback, callback);
                }
            });

            return CCOWFooterView;
        },
        getHeaderView: function(){
            var CCOWHeaderView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('<h4 class="modal-title" id="mainModalLabel">Context Change</h4>')
            });
            return CCOWHeaderView;
        },
        getModalView: function(bodyText){
            var ContextModalView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('<div id="ccowBodyText">{{bodyText}}</div>'),
                initialize: function(){
                    this.model = new Backbone.Model();
                    this.model.set('bodyText', bodyText);
                }
            });
            return new ContextModalView();
        }
    };

    return CCOWModalView;
}