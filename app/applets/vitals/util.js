var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
    'app/applets/vitals/utilParse'
];

"use strict";
define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _, Util) {
    "use strict";

    Util.getNumericDate = function(response) {
        if (response.observed) {
            response.numericDate = ADK.utils.formatDate(response.observed, 'YYYYMMDD');
        }
        return response;
    };

    Util.getObservedFormatted = function(response) {
        response.observedFormatted = '';
        if (response.observed) {
            response.observedFormatted = ADK.utils.formatDate(response.observed, ADK.utils.dateUtils.defaultOptions().placeholder + ' - HH:mm');
        }
        return response;
    };
    Util.getObservedFormattedCover = function(response) {
        response.observedFormattedCover = '';
        if (response.observed) {
            response.observedFormattedCover = ADK.utils.formatDate(response.observed, ADK.utils.dateUtils.defaultOptions().placeholder);
        }
        return response;
    };

    // Util.getObservedTimeFormatted = function(response) {
    //     response.observedTimeFormatted = '';
    //     if (response.observed) {
    //         response.observedTimeFormatted = ADK.utils.formatDate(response.observed, 'HH:mm');
    //     }
    //     return response;
    // };

    Util.getResultedFormatted = function(response) {
        response.resultedFormatted = '';
        if (response.resulted) {
            response.resultedFormatted = ADK.utils.formatDate(response.resulted, ADK.utils.dateUtils.defaultOptions().placeholder + ' - HH:mm');
        }
        return response;
    };



    Util.splitCollection = function(collection, splitCols) {

        var items = collection.models;
        var len = items.length;
        var step = len / splitCols | 0;
        var result = [];

        for (var i = 0, j; i < step; ++i) {
            j = i;

            while (j < len) {
                result.push(items[j]);
                j += step;
            }
        }

        collection.reset(result, {
            reindex: true
        });
        return collection;
    };

    Util.buildCollection = function(collection) {

        var items = collection.models;
        var result = [];
        var wtResult;
        var item1 = new Backbone.Model();
        var item2 = new Backbone.Model();
        for (var i = 0; i < items.length; i++) {
            if (items[i].attributes.displayName === 'BP') {
                var originalResult = items[i].attributes.result;
                item1 = jQuery.extend(true, {}, items[i]);
                item2 = jQuery.extend(true, {}, items[i]);

                if (items[i].attributes.codes !== undefined && items[i].attributes.codes.length > 0 && items[i].attributes.codes[0].code !== undefined && items[i].attributes.codes[0].code === '55284-4') {
                    var low2, high2, result2, previousResult2;
                    if (items[i].attributes.low) {
                        low2 = items[i].attributes.low.substring(items[i].attributes.low.search("/") + 1, items[i].attributes.low.length);
                        items[i].attributes.low = items[i].attributes.low.substring(0, items[i].attributes.low.search("/"));
                    } else {
                        items[i].attributes.low = '90';
                        low2 = '60';
                    }
                    if (items[i].attributes.high) {
                        high2 = items[i].attributes.high.substring(items[i].attributes.high.search("/") + 1, items[i].attributes.high.length);
                        items[i].attributes.high = items[i].attributes.high.substring(0, items[i].attributes.high.search("/"));
                    } else {
                        items[i].attributes.high = '140';
                        high2 = '90';
                    }
                    if (items[i].attributes.result) {
                        result2 = items[i].attributes.result.substring(items[i].attributes.result.search("/") + 1, items[i].attributes.result.length);
                        items[i].attributes.result = items[i].attributes.result.substring(0, items[i].attributes.result.search("/"));
                    }
                    if (items[i].attributes.previousResult) {
                        previousResult2 = items[i].attributes.previousResult.substring(items[i].attributes.previousResult.search("/") + 1, items[i].attributes.previousResult.length);
                        items[i].attributes.previousResult = items[i].attributes.previousResult.substring(0, items[i].attributes.previousResult.search("/"));
                    }

                    items[i].attributes.originalResult = originalResult;

                    items[i].attributes.finalResult = items[i].attributes.result + ' ' + 'mm';
                    items[i].attributes.finalUnits = 'mm';
                    items[i].attributes.qualifiedName += ' Systolic';
                    items[i].attributes.typeName += ' Systolic';

                    item2.attributes.low = low2;
                    item2.attributes.high = high2;
                    item2.attributes.result = result2;
                    item2.attributes.previousResult = previousResult2;
                    item2.attributes.originalResult = originalResult;
                    item2.attributes.finalResult = result2 + ' ' + 'mm';
                    item2.attributes.finalUnits = 'mm';
                    item2.attributes.qualifiedName += ' Diastolic';
                    item2.attributes.typeName += ' Diastolic';
                }
                items[i].attributes.displayName += ' S';
                items[i].attributes.name += ' S';
                items[i].attributes.normalizedName = 'BP_S';
                items[i].attributes.descriptionColumn = 'SBP';
                items[i].attributes.tooltipName = 'Blood Pressure';
                result.push(items[i]);

                item2.attributes.displayName += ' D';
                item2.attributes.name += ' D';
                item2.attributes.normalizedName = 'BP_D';
                item2.attributes.descriptionColumn = 'DBP';
                item2.attributes.tooltipName = 'Blood Pressure';

            } else if (items[i].attributes.displayName === 'WT') {
                if (items[i].attributes.result) {
                    wtResult = items[i].attributes.result + ' ' + items[i].attributes.units;
                }
                items[i].attributes = item2.attributes;
                items[i].attributes.normalizedName = items[i].attributes.displayName.replace(/\W/g, '_');
                result[1] = items[i];
            } else {

                var descriptionColumn = {};
                switch (items[i].attributes.displayName) {
                    case 'T':
                        result[i + 1] = items[i];
                        items[i].attributes.normalizedName = items[i].attributes.displayName.replace(/\W/g, '_');
                        descriptionColumn = 'Temp';
                        items[i].attributes.resultAndUnitsMerged = true;
                        break;
                    case 'PO2':
                        result[i + 1] = items[i];
                        items[i].attributes.normalizedName = items[i].attributes.displayName.replace(/\W/g, '_');
                        descriptionColumn = 'SpO<sub>2</sub>';
                        if (!items[i].attributes.low) {
                            items[i].attributes.low = '95';
                        }
                        items[i].attributes.finalUnits = items[i].attributes.units;
                        break;
                    case 'PN':
                        result[i + 1] = items[i];
                        items[i].attributes.normalizedName = items[i].attributes.displayName.replace(/\W/g, '_');
                        descriptionColumn = 'Pain';
                        break;
                    case 'BMI':
                        result[i] = items[i];
                        items[i].attributes.normalizedName = items[i].attributes.displayName.replace(/\W/g, '_');
                        items[i].attributes.resultAndUnitsMerged = true;
                        descriptionColumn = 'Wt / BMI';
                        break;
                    case 'P':
                        result[i + 1] = items[i];
                        items[i].attributes.normalizedName = items[i].attributes.displayName.replace(/\W/g, '_');
                        items[i].attributes.finalUnits = items[i].attributes.units;
                        descriptionColumn = 'Pulse';
                        if (!items[i].attributes.low) {
                            items[i].attributes.low = '60';
                        }
                        if (!items[i].attributes.high) {
                            items[i].attributes.high = '100';
                        }
                        break;
                    case 'R':
                        result[i + 1] = items[i];
                        items[i].attributes.normalizedName = items[i].attributes.displayName.replace(/\W/g, '_');
                        items[i].attributes.finalUnits = items[i].attributes.units;
                        descriptionColumn = 'RR';
                        if (!items[i].attributes.low) {
                            items[i].attributes.low = '12';
                        }
                        if (!items[i].attributes.high) {
                            items[i].attributes.high = '20';
                        }
                        break;
                }
                items[i].attributes.descriptionColumn = descriptionColumn;


                items[i].attributes.tooltipName = items[i].attributes.typeName;
                if (items[i].attributes.result) {
                    items[i].attributes.originalResult = items[i].attributes.result;
                    if (items[i].attributes.displayName === 'T') {
                        if (items[i].attributes.metricResultUnits) {
                            result[i + 1].attributes.finalResult = items[i].attributes.resultUnits + ' / ' + items[i].attributes.metricResultUnits;
                        } else {
                            result[i + 1].attributes.finalResult = items[i].attributes.resultUnits + ' / ' + Math.round(((items[i].attributes.result - 32) * 0.55555) * 10) / 10 + ' C';
                        }
                    } else if (items[i].attributes.displayName === 'BMI') {
                        result[i].attributes.finalResult = items[i].attributes.result;
                    } else if (result[i + 1]) {
                        result[i + 1].attributes.finalResult = items[i].attributes.resultUnits;
                    }
                }
            }
        }

        _.each(result, function(result) {
            if (result && result.attributes.result) {
                result.attributes.isValid = !isNaN(result.attributes.result);
            }
            if (result && result.attributes.displayName === 'BMI' && wtResult) {
                if (result.attributes.result) {
                    result.attributes.finalResult = wtResult + " / " + result.attributes.finalResult;
                } else {
                    result.attributes.finalResult = wtResult;
                }
                var testInterpretation = '';                
                if (result.attributes.result <= 18.5) {                    
                    testInterpretation = 'underweight';                
                } else if (result.attributes.result > 18.5 && result.attributes.result <= 24.9) {                    
                    testInterpretation = 'normal';                
                } else if (result.attributes.result > 24.9 && result.attributes.result <= 29.9) {                    
                    testInterpretation = 'overweight';                
                } else testInterpretation = 'obese';                
                result.attributes.interpretationField = testInterpretation;
            }
        }, wtResult);

        collection.reset(result, {
            reindex: true
        });
        return collection;
    };

    Util.findNearestRange = function(reference, index) {
        if (isNaN(reference[index]) || reference[index] === undefined) {
            _.each(reference, function(e, item) {
                if (!isNaN(item) && item !== undefined) {
                    return item;
                }
            });
        } else {
            return reference[index];
        }
    };

    Util.setNoRecords = function(resultColl, recordTypes, knownTypes) {
        recordTypes.forEach(function(type) {
            resultColl[knownTypes.indexOf(type)] = {
                displayName: type,
                name: type,
                resultUnitsMetricResultUnits: 'No Record',
                resultUnits: 'No Record',
                summary: 'No Record',
                metricResultUnits: 'No Record',
                typeName: type,
                observed: ''

            };

        });
        return resultColl;
    };
    Util.setTimeSince = function(fromDate) {

        if (fromDate === undefined || fromDate === "") return undefined;
        var startDate = moment(fromDate, 'YYYYMMDDHHmmssSSS');
        var endDate = moment();

        var duration = moment.duration(endDate.diff(startDate));

        var years = parseFloat(duration.asYears());
        var days = parseFloat(duration.asDays());
        var months = parseFloat(duration.asMonths());
        var hours = parseFloat(duration.asHours());
        var min = parseFloat(duration.asMinutes());

        if (min > 0 && min < 60) {
            hours = 1;
        }
        //console.log(hours1);

        var lYear = "y";
        var lMonth = "m";
        var lDay = "d";
        var lHour = "h";
        var finalResult = "";
        if (months >= 24) {
            finalResult = Math.round(years) + lYear;
        } else if ((months < 24) && (days > 60)) {
            finalResult = Math.round(months) + lMonth;
        } else if ((days >= 2) && (days <= 60)) {
            finalResult = Math.round(days) + lDay;
        } else if (days < 2) {
            finalResult = Math.round(hours) + lHour;
        }

        return finalResult;
    };


    return Util;
}