var dependencies = ["backbone", "main/adk_utils/dateUtils", "main/adk_utils/resizeUtils", "main/adk_utils/collectionUtils", "main/adk_utils/appletViewTypesUtils", "main/Session", "backbone-sorted-collection", "moment", "underscore"];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, DateUtils, ResizeUtils, CollectionUtils, AppletViewTypesUtils, Session, SortedCollection,  moment, _) {

    var Utils = {};

    Utils.dateUtils = DateUtils;
    Utils.resize = ResizeUtils;
    Utils.collection = CollectionUtils;
    Utils.appletViewTypes = AppletViewTypesUtils;

    Utils.formatDate = function(date, displayFormat, sourceFormat) {

        if (!displayFormat) {
            displayFormat = "MM/DD/YYYY";
            sourceFormat = "YYYYMMDDHHmmssSSS";
        } else if (!sourceFormat) {
            sourceFormat = "YYYYMMDDHHmmssSSS";
        }

        if (date) {
            return moment(date, sourceFormat).format(displayFormat);
        } else {
            return '';
        }
    };

    Utils.getTimeSince = function(dateString, showMinutes) {
        var startDate = moment(dateString, 'YYYYMMDDHHmmssSSS'); 
        var endDate = moment();
        if(startDate.isAfter(endDate)){
            endDate = moment(dateString, 'YYYYMMDDHHmmssSSS'); 
            startDate = moment();        
        }
        var duration = moment.duration(endDate.diff(startDate));

        var years = parseFloat(duration.asYears());
        var days = parseFloat(duration.asDays());
        var months = parseFloat(duration.asMonths());
        var hours = parseFloat(duration.asHours());
        var min = parseFloat(duration.asMinutes());

        var lYear = 'y';
        var lMonth = 'm';
        var lDay = 'd';
        var lHour = 'h';
        var lMin = '\'';
        var finalResult = '';
        var finalResultText = '';
        var count = 1;
        var timeUnits = 'h';
        if (min > 0 && min < 60) {
            finalResult = '< ' + count + 'h';
            if (showMinutes !== undefined && showMinutes === true) {
                count = Math.round(min);
                timeUnits = lMin;
                finalResult = count + lMin;
                finalResultText = count.toString() + ' Minute';
            }

        } else if (months >= 24) {
            count = Math.round(years);
            timeUnits = lYear;
            finalResult = count + lYear;
            finalResultText = count.toString() + ' Year';
        } else if ((months < 24) && (days > 60)) {
            count = Math.round(months);
            timeUnits = lMonth;
            finalResult = count + lMonth;
            finalResultText = count.toString() + ' Month';
        } else if ((days >= 2) && (days <= 60)) {
            count = Math.round(days);
            timeUnits = lDay;
            finalResult = count + lDay;
            finalResultText = count.toString() + ' Day';
        } else if (days < 2) {
            count = Math.round(hours);
            timeUnits = lHour;
            finalResult = count + lHour;
            finalResultText = count.toString() + ' Hour';
        }

        if (count >= 2) {
            finalResultText = finalResultText + 's';
        }

        //recent check
        var recent = false;
        if (months <= 6) {
            recent = true;
        }
        return {
            timeSince: finalResult,
            count: count,
            timeUnits: timeUnits,
            timeSinceDescription: finalResultText,
            isRecent: recent
        };

    };

    /*
        extract(OBJECT,OBJECT,OBJECT);
        Third OBJECT param. has key value pairs in which the 'key' is used to assign a new param to response,
            and the 'value' is the name of the value being assigned to the new param.

            example usage:
            response = ADK.utils.extract(response, response.reactions[0], {reaction:"name"});
    */
    Utils.extract = function(response, responseObject, attributesObject) {
        if (responseObject) {
            for (var i in attributesObject) {
                var attribute = attributesObject[i];
                if (responseObject[attribute]) {
                    response[i] = responseObject[attribute];
                }
            }
        }
        return response;
    };


    /*
        sortCollectionByColumn(collection, column name, sortType);
            Takes in a Backbone collection and a valid column name within that collection, and
            sorts the collection on that column.  sortType is an optional parameter that specifies
            the type of sort, if not alphabetical or ascending/descending by number.

            example usage:
            EventHandlers.sortCollectionByColumn(med_review_data, "dose");
        */
    Utils.sortCollection = function(collection, key, sortType, ascending) {
        if (sortType) {
            // Checking collection models to see if they have the specified key
            var hasKey = false;
            if (collection.at(0).attributes[key]) {
                hasKey = true;
            } else if (collection.at(collection.length - 1).attributes[key]) {
                hasKey = true;
            } else {
                for (var i = 1, collectionLength = collection.length; i < collectionLength - 1; i++) {
                    if (collection.at(i).attributes[key]) {
                        hasKey = true;
                        break;
                    }
                }
            }
            if (hasKey) {
                collection.comparator = function(item1, item2) {
                    var ascendingToggle;
                    if (ascending) {
                        ascendingToggle = 1;
                    } else {
                        ascendingToggle = -1;
                    }
                    var value1 = item1.get(key);
                    var value2 = item2.get(key);

                    if (sortType === "alphanumerical" || sortType === "numeric" || sortType === "date" || sortType === "alphabetical") {
                        if (value1 === value2) {
                            return 0;
                        } else if ((value1 < value2) || (value2 === undefined)) {
                            return -1 * ascendingToggle;
                        } else {
                            return 1 * ascendingToggle;
                        }
                    }
                };
                collection.reset(collection.originalModels);
                collection.sort();
            }
        }
    };


    /*
        A set of helper functions for Backbone Collections.
            example usage:
            1. ADK.Utils.CollectionTools.sort(med_review_data, "qualifiedName", "asc", "alphabetical");
            2. ADK.Utils.CollectionTools.resetSort(med_review_data);
        */
    Utils.CollectionTools = {
        /*Takes in a Backbone collection and a valid column name within that collection, and
            sorts the collection on that column. sortOrder & sortType are  optional parameters which specify
            the order of sort and the type of sort. Else the default is ascending order & alphabetical type.
            */
        sort: function(collection, key, sortOrder, sortType) {
            /* Save the unsorted collection models */
            if (collection.unsortedModels === undefined) {
                collection.unsortedModels = collection.models;
            }
            var sortedCollection = new SortedCollection(collection);
            /* set default sort order to ascending */
            var order = 'asc';
            if (sortOrder !== undefined) {
                order = this.getSortOrderFromAlias(sortOrder);
            }
            var type = sortType || 'alphabetical';
            /* sort on data type of key. Default to 'alphabetical' sort if data type is not given or invalid */
            switch (type.toLowerCase()) {
                case 'alphabetical':
                    sortedCollection.setSort(function(model) {
                        return model.get(key).toLowerCase();
                    }, order);
                    break;
                case 'numeric':
                    sortedCollection.setSort(function(model) {
                        return parseFloat(model.get(key));
                    }, order);
                    break;
                case 'int':
                    sortedCollection.setSort(function(model) {
                        return parseInt(model.get(key));
                    }, order);
                    break;
                case 'date':
                    sortedCollection.setSort(function(model) {
                        return moment(model.get(key), "YYYYMMDDHHmmssSSS");
                    }, order);
                    break;
                case 'boolean':
                    sortedCollection.setSort(function(model) {
                        var toInt = function(boolean) {
                            if (boolean === true || boolean === 'true') {
                                return 1;
                            } else {
                                return 0;
                            }
                        };
                        return toInt(model.get(key));
                    }, order);
                    break;
                default:
                    sortedCollection.setSort(function(model) {
                        return model.get(key).toLowerCase();
                    }, order);
                    break;
            }
            collection.reset(sortedCollection._collection.models);
            /* remove sorting so that the backbone collection callbacks don't point to last setSort Call when clicking the refresh button */
            sortedCollection.removeSort();
        },
        resetSort: function(collection) {
            /* if collection has been sorted reset collection to presorted state */
            if (collection.unsortedModels !== undefined) {
                collection.reset(collection.unsortedModels);
                collection.unsortedModels = undefined;
            }
        },
        getSortOrderFromAlias: function(sortOrderAliasString) {
            switch (sortOrderAliasString.toLowerCase()) {
                case 'a':
                    return 'asc';
                case 'asc':
                    return 'asc';
                case 'ascending':
                    return 'asc';
                case 'up':
                    return 'asc';
                case 'd':
                    return 'desc';
                case 'desc':
                    return 'desc';
                case 'descending':
                    return 'desc';
                case 'down':
                    return 'desc';
                default:
                    return 'asc';
            }

        }
    };
    /*
        resetCollection(collection);
            Takes in an ADK Backbone collection that may have been filtered and resets to originalModels.

            example usage:
            ADK.utils.resetColection(allergyCollection);
    */
    Utils.resetCollection = function(collection) {
        if (collection instanceof Backbone.PageableCollection) {
            collection.fullCollection.reset(collection.originalModels);
        } else {
            collection.reset(collection.originalModels);
        }
    };

    Utils.setCollection = function(collection, filterFunction) {
        if (collection instanceof Backbone.PageableCollection) {
            collection.fullCollection.reset(collection.fullCollection.filter(filterFunction));
        } else {
            collection.reset(collection.filter(filterFunction));
        }
    };
    /*
        filterCollectionByDays(collection, numberOfDays, dateKey);
            Takes in a Backbone collection, number of days, and date key and filters collection by past number of days.

            example usage:
            ADK.utils.filterCollectionByDays(collection, numberOfDays, dateKey);
    */
    Utils.filterCollectionByDays = function(collection, numberOfDays, dateKey) {

        Utils.resetCollection(collection);

        filterFunction = function(model) {
            var dateFilter = new Date();
            dateFilter.setDate(dateFilter.getDate() - numberOfDays);

            if (!(typeof model.get(dateKey) === 'undefined')) {
                var filterYear = model.get(dateKey).substring(0, 4),
                    filterMonth = model.get(dateKey).substring(4, 6),
                    filterDay = model.get(dateKey).substring(6, 8);

                var filterDate = new Date(filterYear, filterMonth - 1, filterDay);
                if (filterDate != 'Invalid Date') {
                    return filterDate > dateFilter;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        Utils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionByDateRange(collection, startDate, endDate, dateKey);
            Takes in a Backbone collection, start date, end date, and date key and filters collection by date range.

            example usage:
            ADK.utils.filterCollectionByDateRange(collection, startDate, endDate, dateKey);
    */
    Utils.filterCollectionByDateRange = function(collection, startDate, endDate, dateKey) {
        Utils.resetCollection(collection);

        filterFunction = function(model) {

            if (!(typeof model.get(dateKey) === 'undefined')) {
                var filterYear = model.get(dateKey).substring(0, 4),
                    filterMonth = model.get(dateKey).substring(4, 6),
                    filterDay = model.get(dateKey).substring(6, 8);
                var filterDate = new Date(filterYear, filterMonth - 1, filterDay);
                if (filterDate != 'Invalid Date') {
                    return ((filterDate >= startDate) && (filterDate <= endDate));
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        Utils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionBeginsWith(collection, key, filterValue);
            Takes in a Backbone collection, filterValue string, and key and filters collection by begins with.

            example usage:
            ADK.utils.filterCollectionBeginsWith(collection, key, filterValue);
    */
    Utils.filterCollectionBeginsWith = function(collection, key, filterValue) {
        Utils.resetCollection(collection);

        filterFunction = function(model) {

            if (!(typeof model.get(key) === 'undefined')) {
                var field = model.get(key);
                return field.indexOf(filterValue) === 0;
            } else {
                return false;
            }
        };

        Utils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionSubstring(collection, key, filterValue);
            Takes in a Backbone collection, filterValue string, and key and filters collection by contains substring.

            example usage:
            ADK.utils.filterCollectionBeginsWith(collection, key, filterValue);
    */
    Utils.filterCollectionSubstring = function(collection, key, substring) {
        Utils.resetCollection(collection);

        filterFunction = function(model) {

            if (!(typeof model.get(key) === 'undefined')) {
                var field = model.get(key);
                return field.indexOf(substring) > -1;
            } else {
                return false;
            }
        };

        Utils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionSubstring(collection, key, filterValue);
            Takes in a Backbone collection, filterValue string, and key and filters collection by contains substring.

            example usage:
            ADK.utils.filterCollectionBeginsWith(collection, key, filterValue);
    */
    Utils.filterCollectionNoSubstring = function(collection, key, substring) {
        Utils.resetCollection(collection);

        filterFunction = function(model) {

            if (!(typeof model.get(key) === 'undefined')) {
                var field = model.get(key);
                return field.indexOf(substring) <= -1;
            } else {
                return false;
            }
        };

        Utils.setCollection(collection, filterFunction);
    };

    /*
        filterCollectionByValue(collection, key, filterValue);
            Takes in a Backbone collection, filterValue string, and key and filters collection by key value.

            example usage:
            ADK.utils.filterCollectionByValue(collection, key, filterValue);
    */
    Utils.filterCollectionByValue = function(collection, key, filterValue) {
        Utils.resetCollection(collection);

        filterFunction = function(model) {

            if (!(typeof model.get(key) === 'undefined')) {
                var field = model.get(key);
                return field == filterValue;
            } else {
                return false;
            }
        };

        Utils.setCollection(collection, filterFunction);
    };
    
    Utils.chartDataBinning = function (graphData, config) {
       // by default for data normalization will be used Math.log(x/0.1)
       // but user can define normalization function as config parameter
       var DEBUG = config.debug || false;
       //if(diag) DEBUG = true;
       if (_.isUndefined(graphData)) {
           console.log("ADK.util.chartDataBinning() - graphData input error");
           return null;
       }
       if (_.isUndefined(config)) {
           if (DEBUG) console.log("ADK.util.chartDataBinning() - config input error");
           return null;
       }
       var fNormalization;
       var barWidth = config.barWidth || 5;
       var barPadding = config.barPadding || 2;
       var chartWidth = config.chartWidth;
       if (_.isFunction(config.normal_function)) {
           fNormalization = config.normal_function;
       }else{
           fNormalization = function(val){ return val;}
       } 
       var data = graphData.series || [];
       var nColumns = chartWidth / (barWidth + barPadding);
       var firstEvent = moment(graphData.oldestDate);
       var lastEvent = moment(graphData.newestDate);
       var diffDays = lastEvent.diff(firstEvent, "days");
       var daysPerBin = Math.round(diffDays / nColumns);
       if (DEBUG) {
           console.log("Chart width: " + chartWidth+ "px");
           console.log("Number of chart columns: " + Math.round(nColumns));
           console.log("First event: " + moment(firstEvent).format("YYYY-MM-DD"));
           console.log("Last event: " + moment(lastEvent).format("YYYY-MM-DD"));
           console.log("Days range: " + diffDays);
           console.log("Days per bean: " + daysPerBin);
       }
       //------- Sieve cell calculation function ----------------
       var arrBolter = [];
       var start = moment(firstEvent);
       var stop = moment(firstEvent);
       var stopFlag = true;
       stop.add(daysPerBin, "days"); 
       if (DEBUG) {
           console.log(moment(start).format("YYYY-MM-DD"));
           console.log(moment(stop).format("YYYY-MM-DD"));
       }
       for (var n = 0; n < nColumns; n++) {
           arrBolter.push([moment(start), moment(stop)]);
           start = moment(stop);
           stop = moment(start).add(daysPerBin, "days");
           if((start.isBefore()) && (stop.isAfter())&& stopFlag){
                stop = moment();
                nColumns++; // extra coloumn, because of splitted bin
               stopFlag = false;
                if(DEBUG){
                   console.log("Splitted bin --->> !!!");
                   console.log(moment(start).format("YYYY-MM-DD"));
                   console.log(moment(stop).format("YYYY-MM-DD"));                    
                   console.log("Days per Bin -->> "+daysPerBin);                    
                }
           }
       }
       if (DEBUG) {
           console.log("Number of sieve cells: " + arrBolter.length);
           console.log(arrBolter);
       }
        
       //----- Agrigate data --------------------
       var agrData = [];
       for (var z = 0; z < arrBolter.length; z++) {
           var count = 0;
           for (var x = 0; x < data.length; x++) {
               //if ((moment(moment(data[x][0])).isBetween(arrBolter[z][0], arrBolter[z][1])) || ((moment(moment(data[x][0])).isSame(arrBolter[z][0])))) {// version for moment 2.9.0
               if (((moment(moment(data[x][0])).isAfter(arrBolter[z][0]))&&(moment(moment(data[x][0])).isBefore(arrBolter[z][1]))) || ((moment(moment(data[x][0])).isSame(arrBolter[z][0])))) {
                   count = count + data[x][1];
               }
           }
           if (count !== 0) {
              agrData.push([moment.utc(moment(arrBolter[z][0]).add(Math.round(((arrBolter[z][1]).diff(arrBolter[z][0], "days")) / 2), "days")).valueOf(), fNormalization(count)]);
           }
           if (DEBUG) console.log((moment(arrBolter[z][0]).add(Math.round(daysPerBin / 2), "days")).format("YYYY-MM-DD") + " - " + count);
       }
       if (DEBUG) console.log(agrData);
       return agrData;
   };

    return Utils;
}