var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
    'app/applets/ccd_grid/util',
    'hbs!app/applets/ccd_grid/modal/modalTemplate',
    'app/applets/ccd_grid/modal/modalHeaderView.js'

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, Util, modalTemplate, modalHeader) {
    'use strict';

    var modals = [],
        dataCollection;

    var ModalView = Backbone.Marionette.ItemView.extend({
        template: modalTemplate,
        initialize: function(options) {
            this.model = options.model;
            this.collection = options.collection;
            dataCollection = options.collection;
            var sections = this.model.get('sections');
            _.each(sections, function(section) {
                section.text = section.text.replace(/\s+/g, ' ');
            });
            this.model.set('sections', sections);
            var currentPatient = ADK.PatientRecordService.getCurrentPatient();
            this.model.set('fullName', currentPatient.get('fullName'));
            this.model.set('birthDate', currentPatient.get('birthDate'));
            this.model.set('genderName', currentPatient.get('genderName'));
            this.model.set('ssn', currentPatient.get('ssn'));

            this.getModals();
        },
        events: {
            'click .ccdNext': 'getNextModal',
            'click .ccdPrev': 'getPrevModal'
        },
        getNextModal: function(e) {
            var next = _.indexOf(modals, this.model) + 1;
            if (next >= modals.length) {
                // if (dataCollection.hasNextPage()) {
                //     dataCollection.getNextPage();
                // } else {
                //     dataCollection.getFirstPage();
                // }

                this.getModals();
                next = 0;
            }
            var model = modals[next];
            this.setNextPrevModal(model);

        },
        getPrevModal: function(e) {

            var next = _.indexOf(modals, this.model) - 1;
            if (next < 0) {
                // if (dataCollection.hasPreviousPage()) {
                //     dataCollection.getPreviousPage();
                // } else {
                //     dataCollection.getLastPage();
                // }

                this.getModals();
                next = modals.length - 1;
            }
            var model = modals[next];

            this.setNextPrevModal(model);

        },
        getModals: function() {
            modals = [];
            _.each(dataCollection.models, function(m, key) {

                if (m.get('vlerdocument')) {
                    var outterIndex = dataCollection.indexOf(m);
                    // console.log('>>>>>outterIndex', outterIndex);
                    _.each(m.get('vlerdocument').models, function(m2, key) {
                        m2.set({
                            'inAPanel': true,
                            'parentIndex': outterIndex,
                            'parentModel': m
                        });
                        modals.push(m2);

                    });
                } else {
                    modals.push(m);
                }

            });
        },
        setNextPrevModal: function(model) {

            if (this.showNavHeader) {
                model.attributes.navHeader = true;
            }

            var view = new ModalView({
                model: model,
                //target: event.currentTarget,
                collection: dataCollection
            });

            var modalOptions = {
                'title': Util.getModalTitle(model),
                'size': 'xlarge',
                'headerView': modalHeader.extend({
                    model: model,
                    theView: view
                })
            };

            ADK.showModal(view, modalOptions);
        },
    });

    return ModalView;
}