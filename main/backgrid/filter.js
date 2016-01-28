define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'moment',
    'backgrid',
    'main/backgrid/filterTagView',
    'api/ResourceService',
    'hbs!main/backgrid/filterTemplate',
    'api/Messaging',
    'main/api/WorkspaceFilters',
    'main/Utils',
], function(Backbone, Marionette, $, _, moment, Backgrid, FilterTagView, ResourceService, filterTemplate, Messaging, WorkspaceFilters, Utils) {
    'use strict';
    var Filter = {};
    var processId;
    var custprocessId;

    // Capture the name of the browser
    var browser = window.navigator.userAgent;
    var msie = browser.indexOf("MSIE ");

    var searchActive = false;
    var UserDefinedFilter = Backbone.Model.extend({
        defaults: {
            name: '',
            workspaceId: '',
            instanceId: '',
            status: ''
        }
    });

    var initialQueryAndNoFiltersFound = true;

    var UserDefinedFilters = Backbone.Collection.extend({
        model: UserDefinedFilter
    });
    Filter.create = function(options) {
        // Customize Backgrid's default ClientSideFilter
        Backgrid.ClientSideFilterWithDateRangePickerFilter = Backgrid.Extension.ClientSideFilter.extend({
            preFilterCollection: null,
            dateField: null,
            setDateField: function(dateField) {
                this.dateField = dateField;
            },
            events: _.extend({}, Backgrid.Extension.ClientSideFilter.prototype.events, {
                'submit': 'addFilterOnSubmit',
                'click a.remove-all': 'removeAllFilters',
                'click .filter-title': 'filterEditModeFromUi',
                'focusout .filter-title-input': 'filterEditModeFromUi',
                'change .filter-title-input': 'saveFilter',
                'keypress .filter-title-input': 'filterKeypress'
            }),
            addFilter: function(filterText) {
                if (filterText.length < 1) {
                    return;
                }
                var filterAlreadyDefined = this.userDefinedFilters.findWhere({
                    name: filterText
                });
                if (filterAlreadyDefined) {
                    return;
                }
                var userDefinedFilter, udafTag;
                userDefinedFilter = new UserDefinedFilter({
                    name: filterText,
                    workspaceId: this.workspaceId,
                    instanceId: this.instanceId,
                    status: 'new'
                });
                this.userDefinedFilters.add(userDefinedFilter);
                udafTag = new FilterTagView({
                    model: userDefinedFilter,
                    onUserWorkspace: this.onUserWorkspace,
                    fullScreen: this.fullScreen
                });
                this.$('.udaf').append(udafTag.render().el);
                ADK.SessionStorage.setAppletStorageModel(this.instanceId, 'filterText', '', true);
                this.searchBox().val('');
                if (this.collection._events.customfilter !== undefined) {
                    this.doCustomSearch();
                } else {
                    this.doSearch();
                }
                this.userDefinedFiltersCollectionChanged();
                this.listenTo(this.userDefinedFilters, 'model: remove', this.onUserDefinedFilterRemove);
            },
            addFilterOnSubmit: function(e) {
                e.preventDefault();
                //if not on a user defined workspace, return
                if (!this.onUserWorkspace) {
                    return;
                }
                var searchText = this.searchBox().val().trim();
                if (searchText.length === 0) {
                    return;
                }
                var filterTerms = searchText.split(' ');
                _.each(filterTerms, this.addFilter, this);
            },
            getFilterTextbox: function() {
                return this.$el.find('.filter-title-input');
            },
            getFilterLabel: function() {
                return this.$el.find('.filter-title');
            },
            filterKeypress: function(e) {
                if (e.which == 13) {
                    this.getFilterTextbox().focusout();
                }
            },
            saveFilter: function() {
                var filterTitleTextbox = this.getFilterTextbox();
                var newTitle = filterTitleTextbox.val();
                if (newTitle === '')
                    return;

                var filterLabel = this.getFilterLabel();
                filterLabel.text(newTitle);
                this.$el.parents('.gs-w').attr('data-filter-name', newTitle);
                Messaging.trigger('gridster:saveAppletsConfig');
                this.$el.parents('.gs-w').find('.applet-filter-title').text(newTitle);
            },
            removeAllFilters: function(e) {
                e.preventDefault();
                if (this.fullScreen) {
                    WorkspaceFilters.removeAllFiltersFromAppletFromSession(this.workspaceId, this.instanceId);
                } else {
                    WorkspaceFilters.removeAllFiltersFromApplet(this.workspaceId, this.instanceId);
                }
                ADK.SessionStorage.setAppletStorageModel(this.instanceId, 'filterText', '', true);
                this.userDefinedFilters.reset();
                this.clear();
                this.$('.udaf').html('');
                this.userDefinedFiltersCollectionChanged();
            },
            filterEditModeFromUi: function(event) {
                var editFilter = $(event.target).hasClass('filter-title-input');
                this.filterEditMode(!editFilter);
            },
            filterEditMode: function(editFilter) {
                var filterTitleLabel = this.getFilterLabel();
                var filterTitleTextbox = this.getFilterTextbox();
                this.setVisible(filterTitleLabel, !editFilter);
                this.setVisible(filterTitleTextbox, editFilter);

                if (editFilter) {
                    var filterTitle = filterTitleLabel.text();
                    filterTitleTextbox.focus().val(filterTitle);
                }
            },
            setVisible: function(element, makeVisible) {
                if (makeVisible) {
                    element.removeClass('hidden');
                } else {
                    element.addClass('hidden');
                }
            },
            setVisibleWithTransition: function(element, makeVisible) {
                if (makeVisible) {
                    element.removeClass('hidden');
                    element.collapse('show');
                } else {
                    element.collapse('hide');
                }
            },
            onShow: function() {
                var self = this;
                WorkspaceFilters.onRetrieveWorkspaceFilters(self.instanceId, function(args) {
                    var j, filters, filterCount, userDefinedFilter, udafTag, status;
                    var filterTitle = self.$el.parents('.gs-w').attr('data-filter-name');
                    self.getFilterLabel().text(filterTitle);

                    filters = args.applet ? args.applet.filters : args.applet;
                    filterCount = filters ? filters.length : 0;
                    for (j = 0; j < filterCount; j++) {
                        userDefinedFilter = new UserDefinedFilter({
                            name: filters[j],
                            workspaceId: self.workspaceId,
                            instanceId: self.instanceId,
                            status: 'SAVED'
                        });
                        self.userDefinedFilters.add(userDefinedFilter);
                        udafTag = new FilterTagView({
                            model: userDefinedFilter,
                            onUserWorkspace: self.onUserWorkspace,
                            fullScreen: self.fullScreen
                        });
                        self.$('.udaf').append(udafTag.render().el);
                        self.listenTo(self.userDefinedFilters, 'model: remove', self.onUserDefinedFilterRemove);
                    }

                    self.userDefinedFiltersCollectionChanged.call(self);
                    var context = self;
                    var counter = 0;
                    var interval = setInterval(function() {
                        if (context.collection.size() > 0 || counter >= 10) {
                            context.search();
                            clearInterval(interval);
                        } else {
                            counter++;
                        }
                    }, 500);
                    self.search();
                });

                this.listenTo(Messaging, 'globalDate:selected', this.onCollectionChange);

                this.listenTo(this.collection, 'fetchSuccessfull', this.onFetchCollection);
                this.listenTo(this.collection, 'backgrid:sorted', this.onSort);
                this.listenTo(this.collection, 'baseGistView:sortNone', this.onSortNone);
                this.listenTo(this.collection, 'baseGistView:sortManual', this.onSortManual);
            },
            render: function() {
                var self = this;
                var filterTitle;
                var numOftimes = 0;
                this.$el.html(this.template(this));
                Utils.applyMaskingForSpecialCharacters(this.$el.find('.filter-title-input'));
                var interval = setInterval(function() {
                    if (self.$el.parents('.gs-w').length > 0 || numOftimes >= 10) {
                        clearInterval(interval);
                        filterTitle = self.$el.parents('.gs-w').attr('data-filter-name');
                        self.getFilterLabel().text(filterTitle);
                    } else {
                        numOftimes++;
                    }
                }, 100);
                return this;
            },
            initialize: function(options) {
                Backgrid.ClientSideFilterWithDateRangePickerFilter.__super__.initialize.apply(this, arguments);
                this.userDefinedFilters = new UserDefinedFilters();

                this.instanceId = options.instanceId;
                this.workspaceId = options.workspaceId;
                this.fullScreen = options.fullScreen;
                this.collection = options.collection;
                this.maximizedScreen = options.maximizedScreen;
                this.model = options.model;

                var currentScreen = Messaging.request('get:current:screen');
                this.onUserWorkspace = (currentScreen.config.predefined === false ? true : false);
                var lockedScreen = currentScreen.config.locked;
                if (lockedScreen) {
                    this.onUserWorkspace = !lockedScreen.filters;
                }
                this.prevSearchTextLength = 0; //when using backspace the search text of less than 3 characters will be allowed
                this.hasActiveSearch = false;
            },
            updateAdvancedFilterOptionsVisibility: function() {
                var filterContainer = this.$el.find('.filter-container');
                var anyUserDefinedFilters = this.userDefinedFilters.length > 0;
                var showAdvancedFilterOptions = anyUserDefinedFilters;

                this.setVisibleWithTransition(filterContainer, showAdvancedFilterOptions);
            },
            userDefinedFiltersCollectionChanged: function() {
                this.updateAdvancedFilterOptionsVisibility();

                var anyFilters = this.userDefinedFilters.length > 0;
                WorkspaceFilters.triggerGlobalFiltersChangedAlert(this.instanceId, anyFilters);
            },
            onCollectionChange: function(event) {
                //when the collection is updated through the GDF set focus to the search box and run the search
                this.searchBox().focus();
                this.preFilterCollection = null;
                if (this.collection._events.customfilter !== undefined) {
                    this.doCustomSearch();
                } else {
                    this.doSearch();
                }
                return true;
            },
            onUserDefinedFilterRemove: function() {
                //when a filter is deleted, set focus to the search box and run the search
                ADK.SessionStorage.setAppletStorageModel(this.instanceId, 'filterText', '', true);
                this.searchBox().focus();
                if (this.collection._events.customfilter !== undefined) {
                    this.doCustomSearch();
                } else {
                    this.doSearch();
                }
                this.userDefinedFiltersCollectionChanged();
            },
            search: function() {
                var originalModelsCount = 0;
                var self = this;
                // custom filter
                if (this.collection._events.customfilter !== undefined) {
                    //reset the timeout
                    if (custprocessId) {
                        clearTimeout(custprocessId);
                    }
                    custprocessId = setTimeout(function() {
                        self.doCustomSearch();
                    }, 400);
                    return;
                }
                if (this.collection.pageableCollection !== undefined && this.collection.pageableCollection.originalModels !== undefined) {
                    originalModelsCount = this.collection.pageableCollection.originalModels.length;
                } else if (this.collection.originalModels !== undefined) {
                    originalModelsCount = this.collection.originalModels.length;
                }
                //expect at least 1 characters to start filtering.
                if ((this.searchBox().val().length < 1 && this.searchBox().val().length > this.prevSearchTextLength && this.collection.models.length === originalModelsCount && this.userDefinedFilters.length === 0) || !this.patternIsMatched(this.searchBox())) {
                    this.prevSearchTextLength = this.searchBox().val().length;
                    return;
                }
                this.prevSearchTextLength = this.searchBox().val().length;
                //make an unblocking call to the ClientSideFilter.search so that the user can continue typing
                //reset the timeout
                if (processId) {
                    clearTimeout(processId);
                }
                processId = setTimeout(function() {
                    self.doSearch();
                }, 400);
                // trigger filterDone event for GistView.
                if (this.collection._events.filterDone !== undefined) {
                    options.collection.trigger('filterDone');
                }
            },
            doCustomSearch: function() {
                //console.log('doCustomSearch');
                var regexp = this.getFilterRegExp();
                options.collection.trigger("customfilter", regexp);
            },
            getFilterRegExp: function() {
                var query = this.searchBox().val().trim();
                if (this.userDefinedFilters !== undefined && this.userDefinedFilters.length > 0) {
                    this.userDefinedFilters.each(function(model) {
                        query = query + (query.length > 0 ? ' ' : '') + model.get('name');
                    });
                }

                var regexp;
                try {
                    regexp = this.makeRegExp(query);
                } catch (e) {
                    //ignore this error.
                    //it is caused by the user not completing the full search string
                    //which causes it to be syntactically incorrect regex expression
                    return true;
                }
                return regexp;
            },
            getFilterValues: function() {
                var filterValues = [];
                if (this.userDefinedFilters !== undefined) {
                    filterValues = _.map(this.userDefinedFilters.models, function(filterModel) {
                        return filterModel.get('name');
                    });
                }

                var termInTextBox = this.searchBox().val().trim();
                filterValues.push(termInTextBox);
                return _.filter(filterValues, function(filterTerm) {
                    return filterTerm !== '';
                });
            },
            doSearch: function(e) {
                //console.log('doSearch');
                var filterValues = this.getFilterValues();
                var query = _.reduce(filterValues, function(queryThusFar, filterValue) {
                    var seperator = (queryThusFar === '' ? '' : ' ');
                    return queryThusFar + seperator + filterValue;
                }, '');

                if (msie > 0) {
                    query = query.replace(/[\%&\^$\!]/gi, '');
                }
                //replace the spaces with | to represent logical OR
                query = query.replace(/\s/g, '|');

                var searchNeeded = true;
                if (query.length === 0) {
                    if (!this.hasActiveSearch) {
                        // the query is empty and it was already empty (no active search) - so there's nothing to do.
                        searchNeeded = false;
                    } else {
                        // the query is empty, but it must have just *now* become empty (there was an active search)
                        // so go ahead with doSearch in order to clear the current filter
                        // then set hasActiveSearch to false so that the next call to doSearch is a no-op
                        this.hasActiveSearch = false;
                    }
                } else {
                    this.hasActiveSearch = true;
                }

                if (!searchNeeded) {
                    return;
                }

                // capture pre-filtered collections for restoring collections on clearing of filters.
                if (this.preFilterCollection === null || this.preFilterCollection.length === 0) {
                    var fullCollection = this.collection.fullCollection || this.collection;
                    this.preFilterCollection = fullCollection.clone();
                }
                var matcher = _.bind(this.makeMatcher(query), this);
                var col = this.collection;
                if (col.pageableCollection) col.pageableCollection.getFirstPage({
                    silent: true
                });

                if (col instanceof Backbone.PageableCollection) {
                    col.fullCollection.reset(this.preFilterCollection.models, {
                        silent: true
                    });
                    col.getFirstPage({
                        silent: true
                    });
                    col.fullCollection.reset(col.fullCollection.filter(matcher), {
                        reindex: true
                    });
                } else {
                    col.reset(this.preFilterCollection.filter(matcher), {
                        reindex: false
                    });
                }
                if (col.comparator) {
                    col.sort();
                }
                if (col.markInfobutton) {
                    col.markInfobutton.func(col.markInfobutton.that);
                }
            },
            destroy: function() {

                if (this.collection.fullCollection && this.collection.fullCollection.markInfobutton) {
                    this.collection.fullCollection.markInfobutton = null;
                }

                if (this.collection && this.collection.markInfobutton) {
                    this.collection.markInfobutton = null;
                }

                this.remove();
            },
            onFetchCollection: function() {
                this.preFilterCollection = null;
            },
            onSort: function() {
                if (this.collection._events.customfilter !== undefined) {
                    this.doCustomSearch();
                } else {
                    this.doSearch();
                }
            },
            onSortNone: function() {
                this.preFilterCollection = null;
                if (this.collection._events.customfilter !== undefined) {
                    this.doCustomSearch();
                } else {
                    this.doSearch();
                }
            },
            onSortManual: function(col) {
                if (_.isUndefined(col)) {
                    this.preFilterCollection = null;
                } else {
                    this.preFilterCollection = col;
                }
                if (this.collection._events.customfilter !== undefined) {
                    this.doCustomSearch();
                } else {
                    this.doSearch();
                }
            },
            clear: function() {
                this.searchBox().val('');
                this.toggleClearButton();

                // trigger filterDone event for GistView.
                if (this.collection._events.filterDone !== undefined) {
                    options.collection.trigger('filterDone');
                }
                if (this.collection._events.clear_customfilter !== undefined) {
                    var filterRegExp = this.getFilterRegExp();
                    options.collection.trigger('clear_customfilter', filterRegExp);
                    return;
                }
                this.searchBox().focus();
                if (this.collection._events.customfilter !== undefined) {
                    this.doCustomSearch();
                } else {
                    this.doSearch();
                }
                if (options.collection.markInfobutton) {
                    options.collection.markInfobutton.func(options.collection.markInfobutton.that);
                }

            },
            toggleClearButton: function() {
                var $clearButton = this.clearButton();
                var searchTerms = this.searchBox().val();
                if (searchTerms.length > 0) {
                    $clearButton.show();
                } else {
                    $clearButton.hide();
                }
            },
            invalidInput: function(string) {
                var pattern = /[^\%&\^$\!]/gi;
                var result = pattern.test(string);
            },

            patternIsMatched: function(object) {
                var a = [];
                if (msie > 0) {
                    a = $(object).parent().find('input').val();
                    return (!this.invalidInput(a));
                } else {
                    a = $(object).parent().find('input:valid');
                }
                if (a.length > 0) {
                    return true;
                }
                return false;
            },

            makeMatcher: function(query) {
                var regexp;

                try {
                    regexp = this.makeRegExp(query);
                } catch (e) {
                    //ignore this error.
                    //it is caused by the user not completing the full search string
                    //which causes it to be syntactically incorrect regex expression
                    return true;
                }

                var tryMatch = function(text) {
                    return regexp.test(text);
                };

                var getCellValue = function(json, key) {
                    if (typeof(key) === 'string') {
                        return json[key];
                    } else {
                        // appletOptions.filterFields is typically a list of strings, but for
                        //  complex types (nested arrays) it could be a function that will
                        //  return a string (such a a space separated list of the values to search)
                        return key(json);
                    }
                };

                return function(model) {
                    var json = model.toJSON();
                    // Test the search filter on all other fields
                    var fields = this.fields;
                    var keys = this.fields || model.keys();

                    for (var i = 0, l = keys.length; i < l; i++) {
                        var key = keys[i];
                        var cellValue = getCellValue(json, key);
                        if (key === 'observed' || key === 'entered') {
                            //some records have blank dates
                            if (cellValue !== undefined) {
                                var observed1 = cellValue + '';
                                observed1 = cellValue.slice(0, 8);
                                observed1 = cellValue.replace(/(\d{4})(\d{2})(\d{2})/, '$2/$3/$1');

                                var observed2 = cellValue + '';
                                observed2 = cellValue.slice(0, 8);

                                if (tryMatch(observed1) || tryMatch(observed2)) return true;
                            }
                        }
                        if (tryMatch(cellValue + '')) return true;
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
                                    var nestedKey = nestedKeys[i];
                                    var nestedCellValue = getCellValue(json, nestedKey);
                                    if (nestedKey === 'observed') {
                                        var observed1 = nestedCellValue + '';
                                        observed1 = nestedCellValue.slice(0, 8);
                                        observed1 = nestedCellValue.replace(/(\d{4})(\d{2})(\d{2})/, '$2/$3/$1');

                                        var observed2 = nestedCellValue + '';
                                        observed2 = nestedCellValue.slice(0, 8);

                                        if (tryMatch(observed1) || tryMatch(observed2)) {
                                            isNestedMatched = true;
                                        }
                                    }
                                    if (tryMatch(nestedCellValue + '')) {
                                        isNestedMatched = true;
                                    }
                                }
                            });
                        }
                    }

                    return isNestedMatched;
                };
            }
        });

        var filterView = new Backgrid.ClientSideFilterWithDateRangePickerFilter({
            instanceId: options.id,
            workspaceId: options.workspaceId,
            maximizedScreen: options.maximizedScreen,
            fullScreen: options.fullScreen,
            collection: options.collection,
            fields: options.filterFields,
            placeholder: 'Enter your text filter',
            name: 'q-' + options.id,
            template: filterTemplate,
            model: options.model
        });

        if (options.filterDateRangeEnabled) {
            filterView.setDateField(options.filterDateRangeField);
        }

        return filterView;
    };

    return Filter;

});