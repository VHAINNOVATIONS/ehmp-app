var dependencies = [
    'main/ADK',
    'ADKApp',
    'app/applets/clinical_reminders/util',
    'app/applets/clinical_reminders/modal/modalView',
    'hbs!app/applets/clinical_reminders/modal/loadingTemplate'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, ADKApp, Util, ModalView, LoadingTemplate) {
    'use strict';
    //Data Grid Columns
    var displayNameCol;
    var reminderCol = {
        name: 'title',
        label: 'Clinical Reminder',
        cell: 'string'
    };
    var dueDateCol = {
        name: 'dueDateFormatted',
        label: 'Due Date',
        cell: 'string'
    };
    var doneDateCol = {
        name: 'doneDateFormatted',
        label: 'Done Date',
        cell: 'string'
    };

    var summaryColumns = [reminderCol, dueDateCol];

    var fullScreenColumns = [reminderCol, dueDateCol, doneDateCol];

    //Collection fetchOptions
    var fetchOptions = {
        pageable: true,
        resourceTitle: 'clinical-reminder-list',
        cache: true,
        viewModel: {
            parse: function(response) {
                response = Util.getDueDateFormatted(response);
                response = Util.getDoneDateFormatted(response);
                return response;

            }
        }
    };

    var deferred = new $.Deferred();
    var localId;

    var _super;
    var GridApplet = ADK.Applets.BaseGridApplet;

    var AppletLayoutView = GridApplet.extend({
        localId: null,
        fetchPatient: function(deferred) {
            var self = this;
            var fetchPatientOptions = {
                patient: ADK.PatientRecordService.getCurrentPatient(),
                resourceTitle: "patient-record-patient",
                cache: true
            };

            //Parse localId
            fetchPatientOptions.onSuccess = function() {

                self.localId = patientCollection.first().get('localId');
                deferred.resolve(self.localId);

            };
            var patientCollection = ADK.PatientRecordService.fetchCollection(fetchPatientOptions);
        },
        initialize: function(options) {
            var self = this;
            var deferred = new $.Deferred();
            self.fetchPatient(deferred);
            _super = GridApplet.prototype;
            var dataGridOptions = {};

            if (this.columnsViewType === "expanded") {
                dataGridOptions.columns = fullScreenColumns;
                dataGridOptions.filterEnabled = true;
            } else if (this.columnsViewType === "summary") {
                dataGridOptions.columns = summaryColumns;
                dataGridOptions.filterEnabled = false;
            } else {
                dataGridOptions.summaryColumns = summaryColumns;
                dataGridOptions.fullScreenColumns = fullScreenColumns;
            }

            dataGridOptions.enableModal = true;
            fetchOptions.pageable = false;

            fetchOptions.onSuccess = function() {
                // console.log(JSON.stringify(dataGridOptions.collection));
                // console.log(dataGridOptions.collection.length);
            };

            dataGridOptions.collection = ADK.PatientRecordService.createEmptyCollection(fetchOptions);
            //dataGridOptions.collection.fullCollection = new Backbone.Collection([]);
            //Row click event handler
            dataGridOptions.onClickRow = function(model, event) {
                self.onClickRowHandler(model, event);
            };
            self.dataGridOptions = dataGridOptions;
            //There's an error for options where it's not picking up the appletId
            dataGridOptions.appletId = 'clinical_reminders';
            _super.initialize.call(self, options);
            var message = ADK.Messaging.getChannel('clinical_reminders');
            message.reply('gridCollection', function() {
                return self.gridCollection;
            });

            deferred.done(function(localId) {
                fetchOptions.resourceTitle = 'clinical-reminder-list';
                fetchOptions.criteria = {
                    dfn: localId
                };
                ADK.PatientRecordService.fetchCollection(fetchOptions, self.dataGridOptions.collection);

            });
        },
        onRender: function() {

            _super.onRender.apply(this, arguments);


        },
        onClickRowHandler: function(model, event) {
            var self = this;
            var fetchOptions = {
                resourceTitle: "clinical-reminder-detail",
                criteria: {
                    dfn: self.localId,
                    reminderId: model.get('reminderId')
                }
            };

            var modalOptions = {
                'title': 'Clinical Reminder - ' + model.get('title')
            };
            var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
            data.on('sync', function() {

                var detail = data.first().get('detail');
                model.set('detail', detail);
                var view = new ModalView({
                    model: model
                });
                ADK.showModal(view, modalOptions);
            });

            var LoadingView = Backbone.Marionette.ItemView.extend({
                template: LoadingTemplate
            });
            var loadingView = new LoadingView();
            ADK.showModal(loadingView, modalOptions);
        }
    });

    var applet = {
        id: 'clinical_reminders',
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
        defaultViewType: 'summary'
    };

    // expose detail view through messaging
    var channel = ADK.Messaging.getChannel(applet.id);
    channel.reply('detailView', function(params) {

        var fetchOptions = {
            criteria: {
                "uid": params.uid
            },
            patient: new Backbone.Model({
                icn: params.patient.icn,
                pid: params.patient.pid
            }),
            resourceTitle: 'uid',
            viewModel: viewParseModel
        };

        var response = $.Deferred();

        var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
        data.on('sync', function() {
            var detailModel = data.first();
            var onSuccess = function(detailView) {
                response.resolve({
                    view: detailView,
                    title: AppletHelper.getModalTitle(detailModel)
                });
            };
            var onFail = function(errorMsg) {
                response.reject(errorMsg);
            };
            AppletUiHelper.getDetailView(detailModel, null, data, false, onSuccess, onFail);
        }, this);

        return response.promise();
    });

    return applet;
}