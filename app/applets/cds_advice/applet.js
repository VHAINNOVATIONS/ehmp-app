var dependencies = [
    'main/ADK',
    'ADKApp',
    'app/applets/cds_advice/util',
    'app/applets/cds_advice/modal/default/defaultModal',
    'app/applets/cds_advice/modal/error/errorModal',
    'app/applets/cds_advice/modal/advice/adviceModal',
    'app/applets/cds_advice/modal/reminder/reminderModal',
    'app/applets/cds_advice/modal/loading/loadingModal',
    'hbs!app/applets/cds_advice/list/priorityTemplate',
    'app/applets/cds_advice/toolbar/toolbar'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, ADKApp, Util, DefaultModal, ErrorModal, AdviceModal, ReminderModal, LoadingModal, PriorityTemplate, Toolbar) {
    'use strict';
    //Data Grid Columns
    var priorityCol = {
        label: 'Priority',
        cell: 'handlebars',
        template: PriorityTemplate
    };
    var typeCol = {
        name: 'typeText',
        label: 'Type',
        cell: 'string'
    };
    var titleCol = {
        name: 'title',
        label: 'Title',
        cell: 'string'
    };
    var dueCol = {
        name: 'dueDateFormatted',
        label: 'Due Date',
        cell: 'string'
    };
    var doneCol = {
        name: 'doneDateFormatted',
        label: 'Done Date',
        cell: 'string'
    };

    var summaryColumns = [priorityCol, titleCol, typeCol, dueCol];

    var fullScreenColumns = [priorityCol, titleCol, typeCol, dueCol, doneCol];

    var selectedUse = Toolbar.getModel().get('selectedUse');

    //Collection fetchOptions
    var fetchOptions = {
        pageable: true,
        resourceTitle: 'cds-advice-list',
        cache: false, // let the CDS Advice RDK resource control the cache rules
        criteria: {
            // pid:  This is set by the ADK when fetching the collection.
            use: selectedUse,
            cache: true // default to cached results
        },
        viewModel: {
            parse: function(response) {
                response.typeText = Util.getTypeText(response.type);
                response.priorityText = Util.getPriorityText(response.priority);
                response.priorityCSS = Util.getPriorityCSS(response.priority);
                response.dueDateFormatted = Util.formatDate(response.dueDate);
                response.doneDateFormatted = Util.formatDate(response.doneDate);
                return response;
            }
        }
    };

    var detailsPromise;
    var _super;
    var GridApplet = ADK.Applets.BaseGridApplet;

    var AppletLayoutView = GridApplet.extend({
        localId: null,
        initialize: function(options) {
            var self = this;

            // Listen to Toolbar selection changes
            var lastSelectedUse = ADK.SessionStorage.getAppletStorageModel('cdsadvice', 'selectedUse');
            if (lastSelectedUse) {
                Toolbar.getModel().set('selectedUse', lastSelectedUse);
            }
            self.listenTo(Toolbar.getModel(), 'change:selectedUse', self.onSelectedUseChanged);

            _super = GridApplet.prototype;

            fetchOptions.pageable = !options.appletConfig.fullScreen;

            var dataGridOptions = {
                summaryColumns: summaryColumns,
                fullScreenColumns: fullScreenColumns,
                toolbarView: Toolbar.createView(),
                enableModal: true,
                filterEnabled: !fetchOptions.pageable,
                onClickRow: function(model, event) { //Row click event handler
                    self.onClickRowHandler(model, event);
                },
                collection: ADK.PatientRecordService.createEmptyCollection(fetchOptions)
            };
            self.dataGridOptions = dataGridOptions;
            _super.initialize.call(self, options);

            ADK.PatientRecordService.fetchCollection(fetchOptions, self.dataGridOptions.collection);
        },
        onRender: function() {
            _super.onRender.apply(this, arguments);
        },
        refresh: function() {
            fetchOptions.criteria.cache = false; // this is an explicit refresh, we don't want a cached response
            _super.refresh.apply(this, arguments);
            fetchOptions.criteria.cache = true; // restore default cache behavior
        },
        onClickRowHandler: function(model, event) {
            var self = this;

            if (model.get('details')) {
                // we got the details, show the popup
                self.showDetails(model);
            } else {
                // show loading popup while we wait for the details
                LoadingModal.show(model, Util.getTypeText(model.get('type')));
                self.getDetails(model);
            }
        },
        getDetails: function(model) {
            var self = this;
            var fetchOptions = {
                resourceTitle: 'cds-advice-detail',
                criteria: {
                    adviceId: model.get('id'),
                    use: selectedUse
                }
            };
            var data = ADK.PatientRecordService.fetchModel(fetchOptions);
            detailsPromise = data.fetch().promise();

            detailsPromise.fail(function(coll, resp) {
                ErrorModal.show(model.get('title'));
            });

            data.on('sync', function() {
                model.set('details', data.toJSON());
                self.showDetails(model);
            });
        },
        showDetails: function(model) {
            switch (model.get('type')) {
                case Util.ADVICE_TYPE.REMINDER:
                    ReminderModal.show(model);
                    break;

                case Util.ADVICE_TYPE.ADVICE:
                    AdviceModal.show(model);
                    break;

                default:
                    DefaultModal.show(model);
            }
        },
        onSelectedUseChanged: function() {
            var self = this;
            var selectedUse = Toolbar.getModel().get('selectedUse');
            fetchOptions.criteria.use = selectedUse;
            ADK.SessionStorage.setAppletStorageModel('cdsadvice', 'selectedUse', selectedUse);
            ADK.PatientRecordService.fetchCollection(fetchOptions, self.dataGridOptions.collection);
        }
    });

    var applet = {
        id: 'cds_advice',
        hasCSS: true,
        viewTypes: [{
            type: 'summary',
            view: AppletLayoutView.extend({
                columnsViewType: "summary"
            }),
            chromeEnabled: true
        }, {
            type: 'expanded',
            view: AppletLayoutView.extend({
                columnsViewType: "expanded"
            }),
            chromeEnabled: true
        }],
        defaultViewType: "summary"
    };

    return applet;
}