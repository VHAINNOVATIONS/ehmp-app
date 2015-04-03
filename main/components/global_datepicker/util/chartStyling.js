var dependencies = [
    'backbone',
    'marionette',
    'moment',
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, moment) {


    return {

        allEventsChartStyles: {
            chart: {
                backgroundColor: '#263238',
                height: 90,
                width: 682,
                marginBottom: 25,
                events: {
                    selection: $.noop
                },
                style: {
                    // cursor: 'col-resize'
                },
                spacingRight: 20

            },
            title: {
                text: null
            },
            xAxis: {
                lineWidth: 1,
                lineColor: '#BFCAD0',
                plotLines: [{
                    color: '#FF0000',
                    width: 2,
                    value: moment().valueOf(),
                    zIndex: 99
                }]
            }
        },

        selectedEventsChartStyles: {
            chart: {
                backgroundColor: '#F2F2F2',
                events: {
                    selection: $.noop,
                    redraw: function() {
                        var self = this;

                        $('.selectedActivitiesTitle ').html('Selected Events');
                    }
                },
                height: 90,
                width: 682,
                marginBottom: 25,
                zoomType: '',
            },
            title: {
                text: null
            },
            series: [{
                color: '#A28CD1'
            }, {
                color: '#2270C3'
            }],
            xAxis: {
                lineWidth: 1,
                lineColor: '#616161',
                labels: {
                    style: {
                        "color": "#616161"
                    }
                }

            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    borderColor: '#000000',
                    pointWidth: 20 //default, changes dynamically
                },
                series: {}
            },
            tooltip: {
                enabled: true,
                xDateFormat: '%b %Y',
                shared: true
            }
        },

        spikeLineChartStyles: {
            chart: {
                zoomType: '',
                events: {
                    selection: $.noop
                },
                margin: [0, 0, 0, 0],
                backgroundColor: '#182024',
                height: 34,
                width: 400
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    pointWidth: 8, //default, changes dynamically
                    borderWidth: 0
                }
            },

            series: [{
                color: '#A28CD1'
            }, {
                color: '#2270C3'
            }],
            xAxis: {
                labels: {
                    enabled: false
                },
                plotLines: [{
                    color: '#FF0000',
                    width: 2,
                    value: moment().valueOf(),
                    zIndex: 99
                }]
            },
            yAxis: {
                maxPadding: 0,
                minPadding: 0,
                endOnTick: false,
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                enabled: false
            }
        }
    };
}