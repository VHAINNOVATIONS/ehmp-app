var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'jquery',
    'app/applets/vitals/util',
    'app/applets/vitals/modal/modalView',
    'hbs!app/applets/vitals/list/siteTemplate',
    'hbs!app/applets/vitals/list/vitalTypeTemplate',
    'hbs!app/applets/vitals/list/resultTemplate',
    'hbs!app/applets/vitals/list/refRangeTemplate',
    'hbs!app/applets/vitals/list/resultedTemplate',
    'hbs!app/applets/vitals/list/observedTemplate',
    'hbs!app/applets/vitals/list/rowTemplate',
    'hbs!app/applets/vitals/list/itemTemplate',
    'hbs!app/applets/vitals/list/gridTemplate',
    'hbs!app/applets/vitals/list/layoutTemplate',
    'hbs!app/applets/vitals/list/qualifierTemplate',
    'hbs!app/applets/vitals/modal/detailsFooterTemplate',
    'app/applets/vitals/modal/modalHeaderView',
    'hbs!app/applets/vitals/templates/tooltip'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, $, Util, ModalView, siteTemplate, vitalTypeTemplate, resultTemplate, refRangeTemplate, resultedTemplate, observedTemplate, rowTemplate, itemTemplate, gridTemplate, layoutTemplate, qualifierTemplate, detailsFooterTemplate, modalHeader, tooltip) {

    'use strict';
    var model;
    //Data Grid Columns
    var displayNameCol = {
        name: 'displayName',
        label: 'Vital',
        cell: 'string'
    };
    var flagCol = {
        name: '',
        label: 'Flag',
        cell: 'string'
    };
    var resultCol = {
        name: 'resultUnitsMetricResultUnits',
        label: 'Result',
        cell: 'handlebars',
        template: resultTemplate
    };
    var observedFormattedCol = {
        name: 'observedFormatted',
        label: 'Date Observed',
        cell: 'handlebars',
        template: observedTemplate
    };
    var observedFormattedCoversheetCol = {
        name: 'observedFormattedCover',
        label: 'Date Observed',
        cell: 'string'
    };
    var facilityCodeCol = {
        name: 'facilityMoniker',
        label: 'Facility',
        cell: 'string'
    };
    var typeNameCol = {
        name: 'typeName',
        label: 'Type',
        cell: 'string'
    };
    var refRangeCol = {
        name: 'referenceRange',
        label: 'Reference Range',
        cell: 'string'
    };
    var resultedDateCol = {
        name: 'resulted',
        label: 'Date Entered',
        cell: 'handlebars',
        template: resultedTemplate
    };
    var qualifierCol = {
        name: 'qualifiers',
        label: 'Qualifiers',
        cell: 'handlebars',
        template: qualifierTemplate
    };

    var summaryColumns = [displayNameCol, resultCol, observedFormattedCoversheetCol];

    var fullScreenColumns = [observedFormattedCol, typeNameCol, resultCol, resultedDateCol, qualifierCol, facilityCodeCol];

    var gridCollectionStore;
    //Collection fetchOptions
    var fetchOptions = {
        resourceTitle: 'patient-record-vital',
        pageable: false,
        cache: true,
        criteria: {}
    };

    var PanelModel = Backbone.Model.extend({
        defaults: {
            type: 'panel'
        }
    });

    function parseModel(response) {
        response = Util.getObservedFormatted(response);
        // response = Util.getObservedTimeFormatted(response);
        response = Util.getFacilityColor(response);
        response = Util.getObservedFormattedCover(response);
        // response = Util.getStandardizedName(response);
        response = Util.getResultedFormatted(response);
        // response = Util.getResultedTimeFormatted(response);
        response = Util.getDisplayName(response);
        response = Util.getTypeName(response);
        response = Util.noVitlasNoRecord(response);
        response = Util.getFormattedHeight(response);
        response = Util.getResultUnits(response);
        response = Util.getMetricResultUnits(response);
        response = Util.getResultUnitsMetricResultUnits(response);
        response = Util.getReferenceRange(response);
        response = Util.getFormattedWeight(response);
        return response;
    }

    fetchOptions.viewModel = {
        parse: function(response) {
            return response;
        }
    };


    var gistConfiguration = {
        //Collection fetchOptions

         
        gistModel: [{            
            id: 'name',
            field: 'displayName'        
        }, {            
            id: 'result',
            field: 'result'        
        }, {            
            id: 'finalResult',
            field: 'finalResult'        
        }, {            
            id: 'interpretationField',
            field: 'interpretationField'        
        }, {            
            id: 'timeSince',
            field: 'timeSince'        
        }, {            
            id: 'low',
            field: 'low'        
        }, {            
            id: 'bmiValue',
            field: 'bmiValue'        
        }, {            
            id: 'high',
            field: 'high'        
        }, {            
            id: 'vitalColumns',
            field: 'vitalColumns'        
        }, {            
            id: 'previousResult',
            field: 'previousResult'        
        }, {            
            id: 'fullName',
            field: 'qualifiedName'        
        }, {            
            id: 'value',
            field: 'result'        
        }, {            
            id: 'referenceRange',
            field: 'referenceRange'        
        }, {            
            id: 'observedTime',
            field: 'observedFormatted'        
        }, {            
            id: 'observationType',
            field: 'observationType'        
        }, {            
            id: 'tooltip',
            field: 'tooltip'        
        }],
        defaultView: 'observation',
        viewColumns: 2,
        graphOptions: {
            height: '19', //defaults to 20
            width: '45', //defaults to 80
            id: '',
            abnormalRangeWidth: 14, //defaults to Math.floor(w / 4)
            //rhombusA: 6, //defaults to Math.floor(h / 2 * 0.7)
            rhombusB: 3.5, //defaults to Math.floor(aw / 2 * 0.4)
            //radius: 3, //defaults to 2.5
            //hasCriticalInterpretation: false, defaults to false
        }
    };
    var graphOptions_BMI = _.extend(_.clone(gistConfiguration.graphOptions), {
        ranges: [{
            high: 18.5,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'underweight'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'abnormalRange lowRange',
            positionValues: 'center'
        }, {
            low: 18.5,
            includeLow: true,
            high: 25,
            interpretations: [{
                flag: 'N',
                valueClass: 'normalValue',
                description: 'normal'
            }],
            width: gistConfiguration.graphOptions.width - 2 * gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'normalRange',
            positionValues: 'scaled'
        }, {
            low: 25,
            includeLow: true,
            high: 30,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'overweight'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 2,
            rangeClass: 'abnormalRange highRange',
            positionValues: 'center'
        }, {
            low: 30,
            includeLow: true,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'obese'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 2,
            rangeClass: 'abnormalRange criticalHighRange',
            positionValues: 'center'
        }]
    });
    var graphOptions_PN = _.extend(_.clone(gistConfiguration.graphOptions), {
        ranges: [{
            high: 0,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'low'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'abnormalRange hashedRange lowRange',
            positionValues: 'center'
        }, {
            low: 0,
            includeLow: true,
            high: 2,
            includeHigh: true,
            interpretations: [{
                flag: 'N',
                valueClass: 'normalValue',
                description: 'normal'
            }],
            width: gistConfiguration.graphOptions.width - 2 * gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'normalRange',
            positionValues: 'scaled'
        }, {
            low: 2,
            high: 5,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'high'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 4,
            rangeClass: 'abnormalRange highRange',
            positionValues: 'center'
        }, {
            low: 5,
            includeLow: true,
            high: 7,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'high'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 4,
            rangeClass: 'abnormalRange highRange',
            positionValues: 'center'
        }, {
            low: 7,
            includeLow: true,
            high: 9,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'critical high'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 4,
            rangeClass: 'abnormalRange criticalHighRange',
            positionValues: 'center'
        }, {
            low: 9,
            includeLow: true,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'critical high'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 4,
            rangeClass: 'abnormalRange criticalHighRange',
            positionValues: 'center'
        }]
    });
    var graphOptions_PO2 = _.extend(_.clone(gistConfiguration.graphOptions), {
        ranges: [{
            high: 90,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'critical low'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 2,
            rangeClass: 'abnormalRange criticalLowRange',
            positionValues: 'center'
        }, {
            low: 90,
            includeLow: true,
            high: 95,
            includeHigh: true,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'low'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 2,
            rangeClass: 'abnormalRange lowRange',
            positionValues: 'center'
        }, {
            low: 95,
            high: 100,
            includeHigh: true,
            interpretations: [{
                flag: 'N',
                valueClass: 'normalValue',
                description: 'normal'
            }],
            width: gistConfiguration.graphOptions.width - 2 * gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'normalRange',
            positionValues: 'scaled'
        }, {
            includeHigh: true,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'low'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'abnormalRange hashedRange highRange',
            positionValues: 'center'
        }]
    });

    var _super;
    var gridView;
    var GridApplet = ADK.Applets.BaseGridApplet;
    var isExpandedView = false;
    var AppletLayoutView = GridApplet.extend({
        onBeforeDestroy: function() {
            ADK.Messaging.off('globalDate:selected');
        },
        initialize: function(options) {
            var viewType = 'summary';
            var self = this;
            _super = GridApplet.prototype;
            var dataGridOptions = {};


            //dataGridOptions.filterEnabled = false; //Defaults to true
            //dataGridOptions.filterFields = ['summary']; //Defaults to all columns
            if (this.columnsViewType === "expanded" || options.appletConfig.fullScreen) {
                dataGridOptions.columns = fullScreenColumns;
                fetchOptions.pageable = false;
                dataGridOptions.filterEnabled = true;
                self.isFullscreen = true;
                isExpandedView = true;
                options.appletConfig.viewType = 'expanded';
            } else if (this.columnsViewType === "gist") {
                dataGridOptions.columns = summaryColumns;
                dataGridOptions.filterEnabled = false;
                self.isFullscreen = false;
                isExpandedView = false;
                dataGridOptions.gistView = true;
                dataGridOptions.appletConfiguration = gistConfiguration;
                fetchOptions.pageable = false;
            } else {
                dataGridOptions.summaryColumns = summaryColumns;
                dataGridOptions.fullScreenColumns = fullScreenColumns;
                dataGridOptions.filterEnabled = true;
                self.isFullscreen = false;
                isExpandedView = false;
                options.appletConfig.viewType = 'summary';
            }
            this.isExpandedView = isExpandedView;

            dataGridOptions.enableModal = true;

            var table = setInterval(function() {
                if ($(".panel.panel-primary[title='Vitals']").length) {
                    clearInterval(table);
                    $(".panel.panel-primary[title='Vitals']").find(".grid-footer.panel-footer").addClass("hidden");
                }
            }, 500);
            // self.getExposure();

            ADK.Messaging.on('globalDate:selected', function(dateModel) {

                if (self.isFullscreen) {
                    fetchOptions.criteria = {
                        filter: 'and(ne(removed, true),' + self.buildJdsDateFilter('observed') + ')'
                    };
                } else {
                    fetchOptions.criteria = {
                        filter: 'and(ne(removed, true),' + self.buildJdsDateFilter('observed') + '), ne(result,Pass)'
                    };
                }
                fetchOptions.collectionConfig = {
                    collectionParse: self.filterCollection
                };

                fetchOptions.onSuccess = function(collection) {
                    modifyModel();
                    if (self.isFullscreen) {
                        collection.trigger('reset');
                    } else {
                        collection.trigger('vitals:globalDateFetch');
                    }
                };

                ADK.PatientRecordService.fetchCollection(fetchOptions, self.dataGridOptions.collection);
            });

            fetchOptions.collectionConfig = {
                collectionParse: self.filterCollection
            };


            if (self.isFullscreen) {
                fetchOptions.criteria = {
                    filter: 'and(ne(removed, true),' + self.buildJdsDateFilter('observed') + ')'
                };
            } else {
                fetchOptions.criteria = {
                    filter: 'and(ne(removed, true),' + self.buildJdsDateFilter('observed') + '), ne(result,Pass)'
                };
            }

            fetchOptions.onSuccess = function() {
                modifyModel();
            };
            dataGridOptions.appletId = 'vitals';
            this.dataGridOptions = dataGridOptions;

            self.dataGridOptions.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);

            // this gridview is required for several applets in order to refresh the
            // gridview on save, update and delete
            gridView = this;
            //this.listenTo(self.dataGridOptions.collection, 'sync', this.filterCollection);
            if (ADK.UserService.hasPermission('add-patient-vital')) {
                dataGridOptions.onClickAdd = function(event) {
                    var addVitalsChannel = ADK.Messaging.getChannel('addVitals');
                    addVitalsChannel.trigger('addVitals:clicked', event, gridView);
                };
            }

            var modifyModel = function() {
                for (var i = 0; i < dataGridOptions.collection.models.length; i++) {
                    dataGridOptions.collection.models[i].attributes.timeSince = Util.setTimeSince(dataGridOptions.collection.models[i].attributes.observed);
                    dataGridOptions.collection.models[i].attributes.numericTime = Util.getNumericTime(dataGridOptions.collection.models[i].attributes.timeSince);
                    dataGridOptions.collection.models[i].attributes.observationType = 'vitals';
                    dataGridOptions.collection.models[i].attributes.vitalColumns = 'true';
                }

                dataGridOptions.collection.reset(dataGridOptions.collection.models);
                if (dataGridOptions !== undefined && dataGridOptions.appletConfiguration !== undefined && dataGridOptions.appletConfiguration.viewColumns !== undefined) {
                    dataGridOptions.collection = Util.buildCollection(dataGridOptions.collection);
                    dataGridOptions.collection = Util.splitCollection(dataGridOptions.collection, dataGridOptions.appletConfiguration.viewColumns);
                }
            };

            var showModal = function(model, event) {
                event.preventDefault();
                var view = new ModalView({
                    model: model,
                    target: event.currentTarget,
                    gridCollection: dataGridOptions.collection

                });
                view.resetSharedModalDateRangeOptions();
                var modalOptions = {
                    'title': model.get('typeName'),
                    'size': 'xlarge',
                    'headerView': modalHeader.extend({
                        model: model,
                        theView: view
                    }),
                    footerView: Backbone.Marionette.ItemView.extend({
                        template: detailsFooterTemplate,
                        events: {
                            'click #error': 'enteredInError'
                        },
                        enteredInError: function(event) {
                            var vitalEnteredInErrorChannel = ADK.Messaging.getChannel('vitalsEiE');
                            vitalEnteredInErrorChannel.trigger('vitalsEiE:clicked', event, {
                                'collection': self.dataGridOptions.collection.models,
                                'title': model.attributes.observedFormatted,
                                'checked': model.attributes.localId,
                                'gridView': gridView
                            });
                        }
                    }),
                    'regionName': 'vitalsDetailsDialog'
                };

                ADK.showWorkflowItem(view, modalOptions);
            };

            dataGridOptions.onClickRow = function(model, event, gridView) {
                showModal(model, event);
            };


            //US2396 : commented out for demo on 11/5
            //dataGridOptions.onClickAdd = function(event) {
            //    console.log(  'onClickAdd');
            //    var addVitalsChannel = ADK.Messaging.getChannel('addVitals');
            //    addVitalsChannel.trigger('addVitals:clicked', event);
            //};

            var VitalsItemView = Backbone.Marionette.ItemView.extend({
                tagName: 'tr',
                attributes: function() {
                    if (this.model.get('observedDateLatest') !== undefined) {
                        return {
                            'tabindex': '0',
                            'class': this.model.get('observedDateLatest') + ' clickable'
                        };
                    } else {
                        return {
                            'tabindex': '0',
                            'class': this.model.get('observedDateLatest') + ''
                        };
                    }
                },
                template: itemTemplate,
                events: {
                    'click td': function(e) {
                        showModal(this.model, e);
                    }
                }
            });

            var VitalsCompositeView = Backbone.Marionette.CompositeView.extend({
                initialize: function(options) {
                    this.collection = options.collection;
                },
                template: gridTemplate,
                childView: VitalsItemView,
                childViewContainer: 'tbody'
            });

            var VitalsLayoutView = Backbone.Marionette.LayoutView.extend({
                initialize: function(options) {
                    this.collection = options.collection;
                    this.listenTo(this.collection, 'vitals:globalDateFetch', this.render);
                },
                regions: {
                    leftTable: '.a-table',
                    rightTable: '.b-table'
                },
                template: layoutTemplate,
                onRender: function() {
                    var count = this.collection.length;
                    var middle = Math.floor(count / 2);
                    var leftCol = new Backbone.Collection(this.collection.slice(0, middle));
                    var rightCol = new Backbone.Collection(this.collection.slice(middle, count));
                    if (this.collection.length > 0) {
                        this.leftTable.show(new VitalsCompositeView({
                            collection: leftCol
                        }));
                        this.rightTable.show(new VitalsCompositeView({
                            collection: rightCol
                        }));

                    } else {
                        this.$el.find('.a-table')
                            .after('<div class="emptyTextVital">No Records Found</div>');
                    }

                }
            });



            dataGridOptions.filterDateRangeEnabled = true;
            dataGridOptions.filterDateRangeField = {
                name: "observed",
                label: "Date",
                format: "YYYYMMDD"
            };


            this.dataGridOptions = dataGridOptions;

            if (!self.isFullscreen) {
                if (this.dataGridOptions.gistView) {
                    this.dataGridOptions.GistView = VitalsLayoutView;
                    this.dataGridOptions.SummaryView = ADK.Views.VitalsGist.getView();
                    this.dataGridOptions.SummaryViewOptions = {
                        //collectionParser: gistConfiguration.transformCollection,
                        gistModel: gistConfiguration.gistModel,
                    };
                } else {
                    this.dataGridOptions.SummaryView = VitalsLayoutView;
                }
            }

            _super.initialize.apply(this, arguments);


        },
        onRender: function() {
            _super.onRender.apply(this, arguments);

        },
        // onBeforeDestroy: function(){
        //     this.stopListening();
        //     console.log("not listening");
        // },
        // onSync: function() {
        //     this.filterCollection();
        //     _super.onSync.apply(this, arguments);
        // },
        filterCollection: function(coll) {
            console.log('Vitals<------------------Filter collection');
            var knownTypes;
            var resultColl = [];
            if (this.isExpandedView) {
                knownTypes = ['BP', 'P', 'R', 'T', 'PO2', 'PN', 'WT', 'HT', 'BMI'];
            } else {
                knownTypes = ['BP', 'P', 'R', 'T', 'PO2', 'PN', 'WT', 'BMI'];
            }

            if (coll.length === 0) {
                return Util.setNoRecords(resultColl, knownTypes, knownTypes);
            }
            coll.models.forEach(function(model) {
                model.attributes = parseModel(model.attributes);
            });

            coll.reset(_.filter(coll.models, function(model) {
                if (model.has('removed') && model.get('removed') === true)
                    return false;
                else
                    return true;
            }));

            var allTypes = $.unique(coll.pluck('displayName'));
            var displayTypes = knownTypes.filter(function(el) {
                return allTypes.indexOf(el) != -1;
            });
            var latestDate = 0;
            var bmi, wt, rr;
            var observedDate;
            displayTypes.forEach(function(type) {
                var newColl = new Backbone.Collection(coll.where({
                    displayName: type
                }));

                if (newColl.length > 0) {
                    newColl.comparator = 'observed';
                    newColl.sort();
                    var displayModel = newColl.at(newColl.length - 1);
                    if (displayModel.has('observed')) {
                        observedDate = displayModel.get('observed').substring(0, 8);
                        displayModel.set('observedDate', observedDate);
                        if (latestDate === 0 || latestDate < observedDate) {
                            latestDate = observedDate;
                        }
                    }
                    if (newColl.length > 1) {
                        var previousDisplayModel = newColl.at(newColl.length - 2);
                        if (previousDisplayModel.has('result')) {
                            displayModel.set('previousResult', previousDisplayModel.get('result'));
                        }
                    }
                    // if (!displayModel.has('low') && !displayModel.has('high')) {
                    switch (type) {
                        case 'WT':
                            displayModel.set('graphOptions', graphOptions_BMI);
                            break;
                        case 'BMI':
                            displayModel.set('graphOptions', graphOptions_BMI);
                            displayModel.set('low', 18.5);
                            displayModel.set('high', 25);
                            break;
                        case 'PN':
                            displayModel.set('graphOptions', graphOptions_PN);
                            displayModel.set('low', 0);
                            displayModel.set('high', 2);
                            break;
                        case 'PO2':
                            displayModel.set('graphOptions', graphOptions_PO2);
                            displayModel.set('low', 95);
                            displayModel.set('high', 100);
                            break;
                        default:
                            displayModel.set('graphOptions', gistConfiguration.graphOptions);
                    }
                    // } else {
                    //     displayModel.set('graphOptions', gistConfiguration.graphOptions);
                    // }
                    if (type === 'WT') {
                        wt = displayModel;
                    } else if (type === 'BMI') {
                        bmi = displayModel;
                    } else if (type === 'R') {
                        rr = displayModel;
                    }
                    resultColl[knownTypes.indexOf(type)] = displayModel;
                }
            });
            _.each(resultColl, function(model) {
                if (typeof model === 'undefined' || model === null) {
                    return;
                }
                if (model.get('observedDate') === latestDate) {
                    model.set('observedDateLatest', 'latestVital');
                } else {
                    model.set('observedDateLatest', 'notLatestVital');
                }
            });


            if (bmi) {
                var wtDate = wt.get('observed');
                var bmiDate = bmi.get('observed');
                if (bmiDate < wtDate) {
                    // bmi.set('result', 'No Records Found');
                    bmi.set('observed', '');
                    bmi.set('summary', 'No Record');
                }
            }

            var noRecordTypes = knownTypes.filter(function(el) {
                return displayTypes.indexOf(el) == -1;
            });

            if (noRecordTypes.length > 0) {
                resultColl = Util.setNoRecords(resultColl, noRecordTypes, knownTypes);
            }

            if (wt && wt.attributes && wt.attributes.result && wt.attributes.units && wt.attributes.metricResultUnits !== 'No Record') {
                _.each(resultColl, function(result) {
                    if (result && result.attributes && result.attributes.displayName === 'BMI' && bmi.attributes.result) {
                        result.attributes.bmiValue = wt.attributes.result;
                        result.attributes.bmiUnits = wt.attributes.units;
                        result.attributes.bmiMetricUnits = wt.attributes.metricResultUnits;
                        result.attributes.isWT = true;
                        result.attributes.bmiTypeName = wt.attributes.typeName;
                        result.attributes.bmiDisplayName = wt.attributes.displayName;
                        result.attributes.bmiReferenceRange = wt.attributes.referenceRange;
                        result.attributes.bmiObservedFormatted = wt.attributes.observedFormatted;
                    }
                }, wt.attributes.result);
            }
            if (rr && rr.attributes && rr.attributes.result && rr.attributes.result !== 'No Record') {
                _.each(resultColl, function(result) {
                    if (result && result.attributes && result.attributes.displayName === 'R' && rr.attributes.result) {
                        result.attributes.vitalsTypeName = 'Respiratory Rate';
                    }
                });
            }
            _.each(resultColl, function(result) {
                if (result && result.attributes && result.attributes.result !== 'No Record') {
                    result.attributes.tooltip = tooltip(result.attributes);
                }
            });

            return resultColl;
        }
    });
    // expose gist detail view through messaging
    var channel = ADK.Messaging.getChannel('vitals');

    channel.on('getDetailView', function(params) {
        var vitalsTitle;
        if (params.model.get('typeName') == 'Blood Pressure Systolic' || params.model.get('typeName') == 'Blood Pressure Diastolic') {
            vitalsTitle = 'Blood Pressure';
        } else {
            vitalsTitle = params.model.get('typeName');
        }
        ADK.showModal(
            new ModalView({
                model: params.model,
                navHeader: false
            }), {
                size: "xlarge",
                title: vitalsTitle
            });
    });

    channel.reply('detailView', function(params) {

        var fetchOptions = {
            criteria: {
                "uid": params.uid
            },
            patient: new Backbone.Model({
                icn: params.patient.icn,
                pid: params.patient.pid
            }),
            resourceTitle: 'patient-record-vital',
            viewModel: {
                parse: parseModel
            }
        };

        var response = $.Deferred();

        var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
        data.on('sync', function() {
            var detailModel = data.first();
            response.resolve({
                view: new ModalView({
                    model: detailModel,
                    target: null,
                    gridCollection: data
                }),
                title: detailModel.get('typeName'),
                footerView: Backbone.Marionette.ItemView.extend({
                    template: detailsFooterTemplate,
                    events: {
                        'click #error': 'enteredInError'
                    },
                    enteredInError: function(event) {
                        var vitalEnteredInErrorChannel = ADK.Messaging.getChannel('vitalsEiE');
                        vitalEnteredInErrorChannel.trigger('vitalsEiE:clicked', event, {
                            'collection': self.dataGridOptions.collection.models,
                            'title': detailModel.attributes.observedFormatted,
                            'checked': detailModel.attributes.localId,
                            'gridView': gridView
                        });
                    }
                })
            });
        }, this);

        return response.promise();
    });
    channel.reply('refreshGridView', function() {
        var refreshed = false;
        if (_.isObject(gridView) === true) {
            gridView.refresh({});
            refreshed = true;
        }
        return refreshed;
    });


    var applet = {
        id: "vitals",
        hasCSS: true,
        viewTypes: [{
            type: 'summary',
            view: AppletLayoutView.extend({
                columnsViewType: "summary"
            }),
            chromeEnabled: true
        }, {
            type: 'gist',
            view: AppletLayoutView.extend({
                columnsViewType: "gist"
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

    return applet;
}