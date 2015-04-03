var dependencies = [
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'moment',
    'backgrid',
    'backgrid.filter'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, $, _, moment, Backgrid) {
    'use strict';
    var Filter = {};
    var processId;

    Filter.create = function(options) {
        // Customize Backgrid's default ClientSideFilter
        Backgrid.ClientSideFilterWithDateRangePickerFilter = Backgrid.Extension.ClientSideFilter.extend({
            dateField: null,
            setDateField: function(dateField) {
                this.dateField = dateField;
            },
            search: function() {
                var originalModelsCount=0;
                // custom filter
                if (this.collection._events.customfilter !== undefined){
                    var query = this.searchBox().val();
                        query = query.replace(/\+/g, '.*').replace(/\s/g, '|');
                        var regexp;
                        try {
                            regexp = this.makeRegExp(query);
                        } catch (e){
                            //ignore this error.
                            //it is caused by the user not completing the full search string
                            //which causes it to be syntactically incorrect regex expression
                            return true;
                        }
                     options.collection.trigger("customfilter",regexp);
                    return;
                }
                if (this.collection.pageableCollection !== undefined) {
                    originalModelsCount = this.collection.pageableCollection.originalModels.length;
                } else {
                    originalModelsCount = this.collection.originalModels.length;
                }
                //expect at least 3 characters to start filtering.
                //users can use the backspace after filtering to filter by 2 or 1 characters.
                //this was added to allow the user uninterrupted typing, at least for the first 3 characters
                if ((this.searchBox().val().length < 3 && this.collection.models.length === originalModelsCount) || !this.patternIsMatched(this.searchBox())) {
                    return;
                }
                var self = this;
                //make an unblocking call to the ClientSideFilter.search so that the user can continue typing
                if (processId !== undefined) {
                    clearInterval(processId);
                }
                processId = setTimeout(function(){
                    Backgrid.Extension.ClientSideFilter.prototype.search.call(self, arguments);
                }, 500);
                // trigger filterDone event for GistView.
                if (this.collection._events.filterDone !== undefined){
                    options.collection.trigger("filterDone");
                }
            },
            clear: function() {
                // call parent clear function
                Backgrid.Extension.ClientSideFilter.prototype.clear.call(this, arguments);
                // trigger filterDone event for GistView.
                if (this.collection._events.filterDone !== undefined){
                    options.collection.trigger("filterDone");
                }                
                if (this.collection._events.clear_customfilter !== undefined){
                    options.collection.trigger("clear_customfilter");
                }
            },
            patternIsMatched: function(object){
                var a = $(object).parent().find('input:valid');
                if (a.length > 0) {
                    return true;
                }
                return false;
            },
            makeMatcher: function(query) {
                //replace the + with .* to represent logical AND
                //replace the spaces with | to represent logical OR
                query = query.replace(/\+/g, '.*').replace(/\s/g, '|');
                var regexp;
                try {
                    regexp = this.makeRegExp(query);
                } catch (e){
                    //ignore this error.
                    //it is caused by the user not completing the full search string
                    //which causes it to be syntactically incorrect regex expression
                    return true;
                }

                return function(model) {
                    var json = model.toJSON();
                    // Test the search filter on all other fields
                    var fields  = this.fields;
                    var keys = this.fields || model.keys();

                    for (var i = 0, l = keys.length; i < l; i++) {
                        if (keys[i] === 'observed') {
                            //some records have blank dates
                            if (json[keys[i]] !== undefined) {
                                var observed1 = json[keys[i]] + '';
                                observed1 = json[keys[i]].slice(0, 8);
                                observed1 = json[keys[i]].replace(/(\d{4})(\d{2})(\d{2})/, '$2/$3/$1');

                                var observed2 = json[keys[i]] + '';
                                observed2 = json[keys[i]].slice(0, 8);

                                if (regexp.test(observed1) || regexp.test(observed2)) return true;
                            }
                        }
                        if (regexp.test(json[keys[i]] + '')) return true;
                    }

                    // for Panel, add all of its enclosed laps' keys, too.
                    var isNestedMatched = false;
                    var isPanel = model.get('isPanel');
                    if (isPanel !== undefined && isPanel !== null && isPanel === 'Panel') {
                        var labs = model.get('labs');
                        if (labs !== undefined && labs !== null) {
                            labs.each(function(nestedLab) {
                                var nestedJson = nestedLab.toJSON();
                                var nestedKeys = fields || nestedLab.keys();

                                for (var i = 0, l = nestedKeys.length; i < l; i++) {
                                    if (nestedKeys[i] === 'observed') {
                                        var observed1 = nestedJson[nestedKeys[i]] + '';
                                        observed1 = nestedJson[nestedKeys[i]].slice(0, 8);
                                        observed1 = nestedJson[nestedKeys[i]].replace(/(\d{4})(\d{2})(\d{2})/, '$2/$3/$1');

                                        var observed2 = nestedJson[nestedKeys[i]] + '';
                                        observed2 = nestedJson[nestedKeys[i]].slice(0, 8);

                                        if (regexp.test(observed1) || regexp.test(observed2)) {
                                            isNestedMatched = true;
                                        }
                                    }
                                    if (regexp.test(nestedJson[nestedKeys[i]] + '')) {
                                        isNestedMatched = true;
                                    }
                                }
                            });
                        }
                    }

                    if (isNestedMatched) return true;

                    return false;
                };
            }
        });

        var filterView = new Backgrid.ClientSideFilterWithDateRangePickerFilter({
            collection: options.collection,
            fields: options.filterFields,
            placeholder: "Enter your text filter",
            name: "q-" + options.id,
            template: function(data) { //None of the follow are allowed in the input:  * % & ^ $ # !
                return '<span class="search">&nbsp;</span><input pattern="[^\*%&\^$#\!]*" type="search" title="Enter Filter (special characters not allowed)" ' + (data.placeholder ? 'placeholder="' + data.placeholder + '"' : '') + ' name="' + data.name + '" ' + (data.value ? 'value="' + data.value + '"' : '') + '/><a class="clear" data-backgrid-action="clear" href="#">&times;</a>';
            }
        });

        if (options.filterDateRangeEnabled) {
            filterView.setDateField(options.filterDateRangeField);
        }

        return filterView;
    };


    return Filter;


}
