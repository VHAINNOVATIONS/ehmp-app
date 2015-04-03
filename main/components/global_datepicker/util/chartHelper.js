var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
    'highcharts',
    'moment'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, Highcharts, moment) {
    'use strict';

    var rect;
    var selectionColor = 'rgba(59, 96, 102, .8)';

    return {
        chartConfig: {
            chart: {
                zoomType: '',
                // spacingRight: 20,
                type: 'column',
                selectionMarkerFill: selectionColor,
                backgroundColor: '#38474F'
            },
            tooltip: {
                enabled: true
            },
            legend: {
                enabled: false
            },
            title: {
                text: null,
                style: {
                    color: '#CFD8DC'
                }
            },
            xAxis: {
                title: {
                    text: null
                },
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%Y',
                    year: '%Y'
                },
                tickLength: 0,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickWidth: 0,
                lineWidth: 0,
                labels: {
                    style: {
                        "color": "#ffffff"
                    }
                }

            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0
            },
            credits: {
                enabled: false
            },

            plotOptions: {
                column: {
                    stacking: 'normal',
                    // borderWidth: 0
                },
                series: {
                    // borderWidth: 0,
                    color: '#BFCAD0',
                    minPointLength: 10,
                    pointRange: 12 * 30 * 24 * 3600 * 1000,
                    pointPadding: 0,
                    groupPadding: 1,
                    pointInterval: 12 * 30 * 24 * 3600 * 1000
                }
            },
            series: [{
                name: 'Outpatient',
                data: [
                ],
                color: '#BFCAD0',
                id: 'outpatient'
            }, {
                name: 'Inpatient',
                data: [
                ],
                color: '#BFCAD0',
                id: 'inpatient'
            }, {
                name: '',
                data: [
                    [moment().valueOf(), null],
                ],
                showInLegend: false,
                color: '#B9C5CB'
            }]

        },
        selectionColor: selectionColor
    };
}