var dependencies = [
    'underscore',
    'main/ADK',
    'backbone',
    'marionette',
    'hbs!app/applets/workspaceManager/list/screenEditor',
    'app/applets/workspaceManager/list/screenSelectionSlider',
    'app/applets/workspaceManager/list/addEditViews',
    'gridster',
    'api/UserDefinedScreens'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(_, ADK, Backbone, Marionette, screenEditor, ScreenSelectionSlider, AddEditViews, gridster, UserDefinedScreens) {

    'use strict';


    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        template: screenEditor,
        initialize: function() {
            var self = this;
            this.model = new Backbone.Model();
            var screenModule = ADK.ADKApp[Backbone.history.fragment];
        },
        regions: {
            slider: '.applet-tray',
            screenAddEditRegion: '.addEditFormRegion',
            activeRemoveRegion: '.deleteActiveRegion'
        },
        events: {
            'keyup #searchScreens': 'filterScreens',
            'click #doneEditing': 'hideOverlay',
            'click .edit-applet': 'editClicked',
            'click #addScreen': 'showAddForm',
            'click .cancelAddEdit': 'closeAddEditScreens',
            'click .screen-thumbnail': 'editScreen',
            'click .deleteScreen': 'removeScreenActive',
            'keydown .screen-thumbnail' : function(evt){
                if(evt.which === 13){
                    this.editScreen(evt);
                }
            }
        },
        hideOverlay: function() {
            ADK.hideFullscreenOverlay();
            ADK.Navigation.navigate(Backbone.history.fragment);
        },
        onRender: function() {
            this.slider.show(new ScreenSelectionSlider());
        },
        filterScreens: function() {
            var filterText = this.$el.find('#searchScreens').val();
            this.slider.currentView.filterScreens(filterText);
        },
        showAddForm: function(){
            this.screenAddEditRegion.show(new AddEditViews.AddScreenView());
        },
        closeAddEditScreens: function(){
            this.screenAddEditRegion.reset();
        },
        editScreen: function(e) {
            var title = $(e.currentTarget).find('p').text();
            this.screenAddEditRegion.show(new AddEditViews.EditorFormView({screenTitle: title, screenTile: e}));
        },
        removeScreenActive: function(e){
            this.activeRemoveRegion.show(new AddEditViews.DeleteActiveView());
        }

    });

    return AppletLayoutView;
}