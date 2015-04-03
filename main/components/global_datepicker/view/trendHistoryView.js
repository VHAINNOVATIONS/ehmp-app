var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
    'main/components/global_datepicker/util/chartHelper',
    'main/components/global_datepicker/util/chartStyling',
    'main/components/global_datepicker/util/parseEvents',
    'hbs!main/components/global_datepicker/template/trendHistoryTemplate',
    'api/SessionStorage',
    'moment'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, ChartHelper, ChartStyling, parseEvents, trendHistoryTemplate, SessionStorage, moment) {
    'use strict';

    var fetchOptions = {
        resourceTitle: 'global-timeline-getTimeline',
        pageable: false,
        cache: true,
        viewModel: {
            parse: parseEvents
        }
    };

    var leftHandle, rightHandle, rect;
    var allEventsChart; // , selectedEventsChart;

    var allEventsChartOptions = $.extend(true, {}, ChartHelper.chartConfig, ChartStyling.allEventsChartStyles);
    // var selectedEventsChartOptions = $.extend(true, {}, ChartHelper.chartConfig, ChartStyling.selectedEventsChartStyles);
    var response = $.Deferred();
    var handleWidth = 14;
    var handleHeight = 19;
    var handleHalfWidth = handleWidth / 2;

    return Backbone.Marionette.ItemView.extend({
        template: trendHistoryTemplate,
        initialize: function(options) {

            var self = this;

            ADK.Messaging.on('globalDate:customDateRangeSelected', function(dateModel) {
                var dateRange = self.deriveSelectedDateRange(dateModel);
                self.updateDateSliderPosition(dateRange.from, dateRange.to);
            });

            ADK.Messaging.on('resetDateSliderPosition', function(dateRange) {
                self.updateDateSliderPosition(dateRange.from, dateRange.to);
            });

            fetchOptions.onSuccess = function(collection) {
                self.displayCharts(collection);
            };
            ADK.PatientRecordService.fetchCollection(fetchOptions);
        },
        deriveSelectedDateRange: function(dateModel) {
            var from = moment(dateModel.get('customFromDate'), 'MM/DD/YYYY').valueOf();
            var to;
            if (allEventsChart !== undefined && dateModel.get('selectedId') === 'all-range-global') {
                to = allEventsChart.xAxis[0].getExtremes().dataMax;
            } else {
                to = moment(dateModel.get('customToDate'), 'MM/DD/YYYY').valueOf();
            }

            if (from === null || from === undefined || _.isNaN(from) || $.trim(from) === '') {
                from = moment(allEventsChart.xAxis[0].getExtremes().dataMin).valueOf();
            }

            if (dateModel.get('selectedId') === 'all-range-global') {
                dateModel.set('firstEventDate', moment(from).format('MM/DD/YYYY'));
                dateModel.set('lastEventDate', moment(to).format('MM/DD/YYYY'));
                ADK.Messaging.trigger('globalDate:customAllDateRangeDefined', dateModel);
            }

            var dateRange = {
                from: from,
                to: to
            };
            return dateRange;
        },
        updateDateSliderPosition: function(from, to) {
            if ((leftHandle !== undefined) && (rightHandle !== undefined) && (rect !== undefined) && (allEventsChart !== undefined)) {
                leftHandle.attr({
                    x: allEventsChart.xAxis[0].toPixels(from)
                });

                rightHandle.attr({
                    x: allEventsChart.xAxis[0].toPixels(to)
                });

                rect.attr({
                    width: rightHandle.attr('x') - leftHandle.attr('x'),
                    x: leftHandle.attr('x') + handleHalfWidth
                });
            }
        },
        displayCharts: function(mockCollection) {
            allEventsChartOptions.series[0].data = this.buildOutpatientArray(mockCollection);
            allEventsChartOptions.series[1].data = this.buildInpatientArray(mockCollection);
            allEventsChartOptions.plotOptions.series.pointRange = 1;
            allEventsChartOptions.tooltip.enabled = false;
            var self = this;

            var interval = setInterval(function() {
                if (self.$('#trendHistoryChartContainer')) {
                    clearInterval(interval);
                    interval = 0;
                    allEventsChartOptions.chart.renderTo = self.$('#trendHistoryChartContainer')[0];
                    allEventsChart = new Highcharts.Chart(allEventsChartOptions, self.allEventsChartCallback);
                    self.drawAndZoom();

                    var sessionGlobalDate = ADK.SessionStorage.get.sessionModel('globalDate');
                    sessionGlobalDate.set('firstEventDate', moment(allEventsChart.xAxis[0].getExtremes().dataMin).format('MM/DD/YYYY').valueOf());
                    sessionGlobalDate.set('lastEventDate', moment(allEventsChart.xAxis[0].getExtremes().dataMax).format('MM/DD/YYYY').valueOf());
                    ADK.SessionStorage.set.sessionModel('globalDate', sessionGlobalDate);
                }
            }, 500);
        },
        allEventsChartCallback: function(allEventsChart) {
            var isDragging = false,
                group = allEventsChart.renderer.g().add(),
                downX,
                downY,
                optionsX,
                optionsY,
                currentX,
                beingDragged,
                currentY;

            var label = allEventsChart.renderer.label('TODAY', allEventsChart.xAxis[0].toPixels(moment().valueOf()), false)
                .attr({
                    fill: '#FF0000',
                    padding: 2,
                    r: 2,
                    zIndex: 99
                })
                .css({
                    color: '#FFFFFF',
                    fontSize: '8px'
                })
                .add();
            var w = label.attr('width');
            var x1 = label.attr('x');
            label.attr({
                x: x1 - (w / 2)
            });

            group.attr({
                zIndex: 99
            });

            rect = allEventsChart.renderer.rect(allEventsChart.plotLeft, allEventsChart.plotTop, allEventsChart.plotWidth, allEventsChart.plotHeight, 0)
                .attr({
                    fill: ChartHelper.selectionColor,
                    zIndex: 98
                })
                .add();

            leftHandle = allEventsChart.renderer.image('_assets/img/leftHandle.svg', 0, 0, handleWidth, handleHeight)
                .attr({
                    zIndex: 99
                })
                .css({
                    cursor: 'e-resize',
                    zIndex: 99
                })
                .add();

            rightHandle = allEventsChart.renderer.image('_assets/img/rightHandle.svg', 0, 0, handleWidth, handleHeight)
                .attr({
                    zIndex: 99
                })
                .css({
                    cursor: 'w-resize'
                })
                .add();

            Highcharts.addEvent(leftHandle.element, 'mousedown', function(e) {
                e = allEventsChart.pointer.normalize(e);
                downX = e.chartX;
                optionsX = leftHandle.attr('x');
                currentX = leftHandle.attr('x') + handleHalfWidth;
                beingDragged = leftHandle;
                isDragging = true;
            });

            Highcharts.addEvent(rightHandle.element, 'mousedown', function(e) {
                e = allEventsChart.pointer.normalize(e);
                downX = e.chartX;
                optionsX = rightHandle.attr('x');
                currentX = rightHandle.attr('x') + handleHalfWidth;
                beingDragged = rightHandle;
                isDragging = true;
            });

            Highcharts.addEvent(allEventsChart.container, 'mousemove', function(e) {
                if (isDragging) {
                    e = allEventsChart.pointer.normalize(e);
                    var draggedX = e.chartX - downX;

                    if (beingDragged === leftHandle) {

                        if (currentX + draggedX > 0 && currentX + draggedX + leftHandle.attr('width') < allEventsChart.xAxis[0].toPixels(moment().valueOf())) {

                            leftHandle.attr({
                                x: optionsX + draggedX
                            });

                            rect.attr({
                                width: rightHandle.attr('x') - leftHandle.attr('x'),
                                x: leftHandle.attr('x') + handleHalfWidth
                            });
                        }

                    } else if (beingDragged === rightHandle) {

                        if (currentX + draggedX > allEventsChart.xAxis[0].toPixels(moment().valueOf()) && currentX + draggedX + rightHandle.attr('width') < allEventsChart.chartWidth) {

                            rightHandle.attr({
                                x: optionsX + draggedX
                            });

                            rect.attr({
                                width: rightHandle.attr('x') - leftHandle.attr('x'),
                                x: leftHandle.attr('x') + handleHalfWidth
                            });
                        }
                    }
                }
            });
            Highcharts.addEvent(document, 'mouseup', function(e) {
                var ee = allEventsChart.pointer.normalize(e);

                //if we're reasonably close to today's date in the "to" field, set to date to today's date.  This is for usability purposes
                // since each pixel of dragging represents nearly two weeks.  If users want finer control, they can explicitly specify from/to
                // date in custom fields
                var from = allEventsChart.xAxis[0].toValue(leftHandle.attr('x') + handleHalfWidth);
                var to = allEventsChart.xAxis[0].toValue(rightHandle.attr('x') + handleHalfWidth);

                var timeDiffFromNow = moment.duration(moment(to).diff(moment().valueOf()));
                var timeDiffInDays = timeDiffFromNow.asDays();
                if (timeDiffInDays < 7) {
                    to = moment().valueOf();
                }

                if (isDragging) {
                    var newDateRange = {
                        from: from,
                        to: to
                    };
                    ADK.Messaging.trigger('updateGlobalTimelineDateRange', newDateRange);
                }

                beingDragged = null;

                isDragging = false;
            });
        },
        buildOutpatientArray: function(mockCollection) {
            var outpatientArray = [];
            var model = mockCollection.at(0);
            var oup = model.get('outpatient');

            oup = this.groupPatientsByTimeSlice(oup);

            _.each(oup, function(value, key) {
                var dateTime = key + '';
                var num = value.length;
                if(dateTime.length > 6){
                    dateTime = dateTime.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    outpatientArray.push([moment(dateTime, 'YYYY-MM-DD').valueOf(), num]);
                }
                else{
                    dateTime = dateTime.replace(/(\d{4})(\d{2})/, '$1-$2');
                    outpatientArray.push([moment(dateTime, 'YYYY-MM').valueOf(), num]);
                }
            });

            return outpatientArray;
        },
        buildInpatientArray: function(mockCollection) {
            var inpatientArray = [];

            var model = mockCollection.at(0);
            var inp = model.get('inpatient');

            inp = this.groupPatientsByTimeSlice(inp);

            _.each(inp, function(value, key) {
                var dateTime = key + '';
                var num = value.length;
                if(dateTime.length > 6){
                    dateTime = dateTime.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    inpatientArray.push([moment(dateTime, 'YYYY-MM-DD').valueOf(), num]);
                }
                else{
                    dateTime = dateTime.replace(/(\d{4})(\d{2})/, '$1-$2');
                    inpatientArray.push([moment(dateTime, 'YYYY-MM').valueOf(), num]);
                }
            });
            return inpatientArray;
        },
        groupPatientsByTimeSlice: function(patients) {
            return _.groupBy(patients, function(patient) {
                var time = patient.dateTime + '';
                time = time.slice(0, 8);
                var year = parseInt(time.slice(0, 4), 10);
                var month = parseInt(time.slice(4, 6), 10);
                var day = parseInt(time.slice(6, 8), 10);
                if (moment([year, month-1, day]).diff(moment(), 'days') >= 0){
                    // 1-7: (month) 7
                    // 8-14: (month) 14
                    // 15-21: (month) 21
                    // 22-31: (month+1) 1

                    if (day >= 1 && day <= 7){
                        day = 7;
                    }
                    else if(day >= 8 && day <= 14){
                        day = 14;
                    }
                    else if (day >= 15 && day <= 21){
                        day = 21;
                    }
                    else if (day >= 22){
                        day = 1;
                        month = month + 1;
                    }

                    if (day < 10) {
                        day = '0' + day;
                    } else {
                        day = '' + day;
                    }

                    if (month < 10) {
                        month = '0' + month;
                    } else {
                        month = '' + month;
                    }

                    return (year + '' + month + '' + day);
                }
                else{
                    var quarterlyBinning = (Math.floor((month + 2) / 3) * 3) - 2;
                    if ((quarterlyBinning) < 10) {
                        quarterlyBinning = '0' + quarterlyBinning;
                    } else {
                        quarterlyBinning = '' + quarterlyBinning;
                    }
                    var timeSlice = time.slice(0, 4) + '' + quarterlyBinning;
                    return timeSlice;
                }
            });
        },
        addAllEventsChartMouseEvents: function(allEventsChart) {

        },
        drawAndZoom: function() {
            var globalDate = SessionStorage.getModel('globalDate');
            var selectedId = globalDate.get('selectedId');
            var fromDate, toDate, from, to;

            if (globalDate.get('selectedId') !== undefined && globalDate.get('selectedId') !== null) {
                if (selectedId === 'all-range-global') {
                    fromDate = globalDate.get('firstEventDate');
                    toDate = globalDate.get('lastEventDate');
                } else {
                    fromDate = globalDate.get('fromDate');
                    toDate = globalDate.get('toDate');
                }
            }

            if (fromDate === null || fromDate === undefined || $.trim(fromDate) === '') {
                fromDate = '01/01/1900';
            }

            from = moment(fromDate, 'MM/DD/YYYY').valueOf();
            to = moment(toDate, 'MM/DD/YYYY').valueOf();

            leftHandle.attr({
                x: allEventsChart.xAxis[0].toPixels(from),
                y: (allEventsChart.chartHeight / 2) - (leftHandle.attr('height') / 2)
            });

            rightHandle.attr({
                x: allEventsChart.xAxis[0].toPixels(to),
                y: (allEventsChart.chartHeight / 2) - (leftHandle.attr('height') / 2)
            });

            rect.attr({
                width: rightHandle.attr('x') - leftHandle.attr('x'),
                x: leftHandle.attr('x') + handleHalfWidth
            });

            ADK.Messaging.trigger('updateGlobalTimelineDateRange', {
                from: from,
                to: to
            });
        },
        onBeforeDestroy: function() {
            // this.destroySelectedEventsChart();
            this.destroyAllEventsChart();
            ADK.Messaging.off('globalDate:customDateRangeSelected');
        },
        // destroySelectedEventsChart: function() {
        //     if (selectedEventsChart !== undefined && selectedEventsChart !== null) {
        //         Highcharts.charts.splice(Highcharts.charts.indexOf(selectedEventsChart), 1);
        //     }
        // },
        destroyAllEventsChart: function() {
            if (allEventsChart !== undefined && allEventsChart !== null) {
                $(document).off('mouseup');
                allEventsChart.destroy();
                allEventsChart = undefined;
            }
        }
    });
}
