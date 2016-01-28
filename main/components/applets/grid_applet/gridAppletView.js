define([
    'jquery',
    'underscore',
    'main/Utils',
    'main/backgrid/datagrid',
    'main/backgrid/filter',
    'api/ResourceService',
    'api/SessionStorage',
    'main/components/views/loadingView',
    'main/components/views/errorView',
    'main/components/applets/grid_applet/views/filterDateRangeView',
    'hbs!main/components/applets/grid_applet/templates/containerTemplate',
    'main/components/applets/grid_applet/gists/gistView'
], function($, _, utils, DataGrid, CollectionFilter, ResourceService, SessionStorage, LoadingView, ErrorView, FilterDateRangeView, containerTemplate, GistView) {
    'use strict';

    var SCROLL_TRIGGERPOINT = 40;
    var SCROLL_ADDITIONAL_ROWS = 100;
    var INITIAL_NUMBER_OF_ROWS = 30;

    function markInfobuttonData(that) {
        if (that.dataGridOptions.collection.length > 0 && !_.isUndefined(that.dataGridOptions.tblRowSelector)) {
            $(that.dataGridOptions.tblRowSelector).each(function() {
                $(this).attr("data-infobutton", $(this).find('td:first').text());
            });
        }
    }

    return Backbone.Marionette.LayoutView.extend({
        initialize: function(options) {
            if (this.options.appletConfig && _.isUndefined(this.options.appletConfig.instanceId)) {
                this.options.appletConfig.instanceId = this.options.appletConfig.id;
            } else if (!this.options.appletConfig) {
                this.options.appletConfig = {};
                this.options.appletConfig.id = this.dataGridOptions.appletConfig.id;
                this.options.appletConfig.instanceId = this.dataGridOptions.appletConfig.instanceId;
            }

            var maximizedApplet = ADK.Messaging.request('applet:maximized');
            if (!_.isUndefined(maximizedApplet)) {
                this.options.appletConfig.filterName = maximizedApplet.get('filterName');
                ADK.Messaging.reply("applet:maximized", function() {
                    return undefined;
                });
            }

            var appletConfig = this.options.appletConfig;
            this.appletConfig = appletConfig;
            var dataGridOptions = this.dataGridOptions || {}; //Set in extending view
            this.dataGridOptions = dataGridOptions;
            this.dataGridOptions.emptyText = dataGridOptions.emptyText || 'No Records Found';
            this.dataGridOptions.appletConfig = appletConfig;
            this.routeParam = this.options.routeParam;
            this.expandedAppletId = this.appletConfig.instanceId;
            if (this.appletConfig.fullScreen) {
                this.parentWorkspace = ADK.Messaging.request('get:current:workspace');
                var expandedModel = SessionStorage.get.sessionModel('expandedAppletId');
                if (!_.isUndefined(expandedModel) && !_.isUndefined(expandedModel.get('id'))) {
                    this.expandedAppletId = expandedModel.get('id');
                    SessionStorage.set.sessionModel('expandedAppletId', new Backbone.Model({
                        'id': undefined
                    }));

                }
            }
            //Set default filterEnabled
            if (this.dataGridOptions.filterEnabled === undefined) {
                this.dataGridOptions.filterEnabled = true;
            }

            //Set Data Grid Columns
            if (appletConfig.fullScreen) {
                dataGridOptions.columns = dataGridOptions.fullScreenColumns || dataGridOptions.summaryColumns || dataGridOptions.columns;
                SessionStorage.setAppletStorageModel(this.appletConfig.instanceId, 'fullScreen', true);
            } else {
                dataGridOptions.columns = dataGridOptions.summaryColumns || dataGridOptions.columns;
                SessionStorage.setAppletStorageModel(this.appletConfig.instanceId, 'fullScreen', false);
            }

            appletConfig.workspaceId = ADK.Messaging.request('get:current:screen').config.id;
            this.model = new Backbone.Model(appletConfig);

            this.initFilterView();

            if (this.dataGridOptions.hasOwnProperty('onClickAdd')) {
                this.onClickAdd = this.dataGridOptions.onClickAdd;
            }

            if (this.dataGridOptions.toolbarView) {
                this.toolbarView = this.dataGridOptions.toolbarView;
            }

            this.createDataGridView();

            //Create Loading View
            this.loadingView = LoadingView.create();
            this.listenTo(dataGridOptions.collection, 'sync', this.onSync);
            this.listenTo(dataGridOptions.collection, 'error', this.onError);

            this.dataGridOptions.collection.markInfobutton = {
                'that': this,
                'func': markInfobuttonData
            };
            var self = this;
            this.listenTo(this.dataGridOptions.collection, 'backgrid:sort', function() {
                self.dataGridOptions.collection.markInfobutton.func(self.dataGridOptions.collection.markInfobutton.that);
            });
            if (this.options.appletConfig.viewType === 'gist') {
                //set up events to close quicklooks
                var manualScrollingEvent = function() {
                    self.$('[data-toggle=popover]').popover('hide');
                };
                this.listenTo(this, 'show', function() {
                    /* listen for scroll on mousewheel only */
                    this.$('.grid-applet-panel').on('mousewheel', function() {
                        manualScrollingEvent();
                    });
                    /* listen for up and down arrow keys */
                    this.$('.grid-applet-panel').on('keydown', function(e) {
                        if (e.which === 38 || e.which === 40) {
                            manualScrollingEvent();
                        }
                    });
                });
                this.listenTo(this, 'destroy', function() {
                    this.$('.grid-applet-panel').off('mousewheel');
                    this.$('.grid-applet-panel').off('keydown');
                });
            }
        },
        initFilterView: function() {
            //Create Filter and Filter Button View
            if (this.dataGridOptions.filterEnabled === true) {
                var filterFields;
                if (this.dataGridOptions.filterFields) {
                    filterFields = this.dataGridOptions.filterFields;
                } else {
                    filterFields = _.pluck(this.dataGridOptions.columns, 'name');
                }

                var maximizedScreen = false;
                if (!_.isUndefined(this.options.appletConfig.filterName)) {
                    maximizedScreen = true;
                }

                var filterOptions = {
                    collection: this.dataGridOptions.collection,
                    filterFields: filterFields,
                    filterDateRangeEnabled: this.dataGridOptions.filterDateRangeEnabled,
                    filterDateRangeField: this.dataGridOptions.filterDateRangeField,
                    formattedFilterFields: this.dataGridOptions.formattedFilterFields,
                    id: this.appletConfig.instanceId,
                    workspaceId: ADK.Messaging.request('get:current:screen').config.id,
                    model: this.model,
                    maximizedScreen: maximizedScreen,
                    fullScreen: this.appletConfig.fullScreen
                };

                this.filterView = CollectionFilter.create(filterOptions);

                this.dataGridOptions.appletId = this.appletConfig.id;
                this.dataGridOptions.instanceId = this.appletConfig.instanceId;
                if (this.dataGridOptions.filterDateRangeEnabled && this.appletConfig.fullScreen) {
                    this.filterDateRangeView = new FilterDateRangeView({
                        model: new Backbone.Model(this.dataGridOptions),
                        appletId: this.dataGridOptions.appletId,
                        appletView: this
                    });
                }
            }
        },
        createDataGridView: function() {
            if (this.dataGridOptions.collection instanceof Backbone.PageableCollection) {
                if (this.appletConfig.fullScreen || this.appletConfig.fullScreen === true) {
                    this.dataGridOptions.collection.setPageSize(100, {
                        silent: true
                    });
                } else {
                    this.dataGridOptions.collection.setPageSize(INITIAL_NUMBER_OF_ROWS, {
                        silent: true
                    });
                }
            }
            if (!this.appletConfig.fullScreen && this.dataGridOptions.SummaryView) {

                var summaryViewOptions = this.dataGridOptions.SummaryViewOptions || {};
                summaryViewOptions.collection = this.dataGridOptions.collection;
                summaryViewOptions.appletConfig = this.appletConfig;

                this.dataGridView = new this.dataGridOptions.SummaryView(summaryViewOptions);
            } else if (this.dataGridOptions.gistView) {
                this.dataGridView = new GistView(this.dataGridOptions);
            } else {
                this.dataGridView = DataGrid.create(this.dataGridOptions);
            }
        },
        onRender: function() {
            this.loading();
            var self = this;
            if (this.filterView) {
                $(this.filterView.el).css({
                    marginLeft: '0px',
                    marginTop: '0px',
                    marginBottom: '6px'
                });

                this.gridFilter.show(this.filterView);
                var queryInputSelector = 'input[name=\'q-' + this.appletConfig.instanceId + '\']';
                this.filterView.$el.find('input[type=search]').on('change', function() {
                    SessionStorage.setAppletStorageModel(self.expandedAppletId, 'filterText', $(this).val(), true, this.parentWorkspace);
                });

                this.filterView.$el.find('a[data-backgrid-action=clear]').on('click', function() {
                    SessionStorage.setAppletStorageModel(self.expandedAppletId, 'filterText', $(this).val(), true, this.parentWorkspace);
                });

                if (this.filterDateRangeView) {
                    this.gridFilterDateRange.show(this.filterDateRangeView);
                }

                this.listenTo(this, 'destroy', function() {
                    this.filterView.$el.find('input[type=search]').off('change');
                    this.filterView.$el.find('a[data-backgrid-action=clear]').off('click');
                });

                $('.grid-filter').find('input').attr('tabindex', '0');
            }
            if (this.dataGridOptions.collection instanceof Backbone.PageableCollection) {
                if (!this.appletConfig.fullScreen || this.appletConfig.fullScreen !== true) {
                    this.$el.find('#grid-panel-' + this.appletConfig.instanceId).on('scroll', function(event) {
                        self.fetchRows(event);
                    });
                }

                this.listenTo(this, 'destroy', function() {
                    this.$el.find('#grid-panel-' + this.appletConfig.instanceId).off('scroll');
                });

            }
        },
        onShow: function() {
            this.showFilterView();

            //TODO: move fetch data for grid to this section
        },
        template: containerTemplate,
        regions: {
            gridContainer: '.grid-container',
            gridToolbar: '.grid-toolbar',
            gridFilterDateRange: '.grid-filter-daterange',
            gridFilter: '.grid-filter'
        },
        // events: {
        //     'click .applet-maximize-button': 'expandApplet',
        //     'click .applet-minimize-button': 'minimizeApplet',
        //     'click .applet-refresh-button': 'refresh',
        //     'click .applet-add-button': 'onClickAdd',
        //     'click .applet-options-button': 'displaySwitchboard',
        //     'click .applet-exit-options-button': 'closeSwitchboard'
        // },
        eventMapper: {
            'refresh': 'refresh',
            'add': 'onClickAdd'
        },
        fetchRows: function(event) {
            var e = event.currentTarget;
            if ((e.scrollTop + e.clientHeight + SCROLL_TRIGGERPOINT > e.scrollHeight) && this.dataGridOptions.collection.hasNextPage()) {
                event.preventDefault();
                this.dataGridOptions.collection.setPageSize(this.dataGridOptions.collection.state.pageSize + SCROLL_ADDITIONAL_ROWS);

                if (this.dataGridOptions.collection.length > 0 && !_.isUndefined(this.dataGridOptions.tblRowSelector)) {
                    $(this.dataGridOptions.tblRowSelector).each(function() {
                        $(this).attr("data-infobutton", $(this).find('td:first').text());
                    });
                }
            }
        },
        toolbar: function() {
            if (this.toolbarView) {
                this.gridToolbar.show(this.toolbarView);
            }
        },
        onSync: function() {
            var applet = this.$("[data-instanceid='" + this.appletConfig.instanceId + "']");
            if (applet.length === 0) {
                applet = this.$el.closest("[data-instanceid='" + this.appletConfig.instanceId + "']");
            }
            applet.find('.fa-refresh').removeClass('fa-spin');

            this.toolbar();

            if (this.filterView) {
                var searchText = SessionStorage.getAppletStorageModel(this.expandedAppletId, 'filterText', true, this.parentWorkspace);
                if (this.filterView.userDefinedFilters.length > 0 || (searchText !== undefined && searchText !== null && searchText.trim().length > 0)) {
                    this.filterView.search();
                }
            }

            //this.dataGridView.gridView.collection.reset(this.dataGridOptions.collection);
            if (this.dataGridOptions.gistView) {
                /* Adds Fields to the collection that match Gist Fields. It is up to the applet to provide the correct gist field names */
                /* Mapping done here to avoid double rendering in initialize */

                var options = this.dataGridOptions;
                this.dataGridOptions.collection.each(function(model) {
                    _.each(options.appletConfiguration.gistModel, function(object) {
                        model.set(object.id, model.get(object.field));
                    });
                });
                if (this.dataGridView.collection !== this.dataGridOptions.collection) {
                    this.dataGridView.collection.reset(this.dataGridOptions.collection.models);
                }
            } else {
                //TODO: find a way to bind datagridview collection to the dataGridView's collection
                if (this.dataGridView.collection) {
                    if (this.dataGridView.collection !== this.dataGridOptions.collection) {
                        this.dataGridView.collection.reset(this.dataGridOptions.collection.models);
                    }
                } else {
                    if (this.dataGridView.gridView.collection !== this.dataGridOptions.collection) {
                        this.dataGridView.gridView.collection.reset(this.dataGridOptions.collection.models);
                    }

                }
            }
            this.showViewInGridContainer(this.dataGridView);

            if (this.dataGridOptions.collection instanceof Backbone.PageableCollection) {
                if (this.appletConfig.fullScreen || this.appletConfig.fullScreen === true) {
                    var self = this;
                    this.$el.find('.data-grid').on('scroll', function(event) {
                        self.fetchRows(event);
                    });
                    this.$el.find('.data-grid').trigger("scroll");
                    this.listenTo(this, 'destroy', function() {
                        this.$el.find('.data-grid').off('scroll');
                    });
                } else {
                    this.$el.find('#grid-panel-' + this.appletConfig.instanceId).trigger("scroll");
                }
            }

            if (this.dataGridOptions.collection.length > 0 && !_.isUndefined(this.dataGridOptions.tblRowSelector)) {
                $(this.dataGridOptions.tblRowSelector).each(function() {
                    $(this).attr("data-infobutton", $(this).find('td:first').text());
                });
            }
            var i;
            _.each(this.dataGridOptions.columns, function(column, index) {
                i = index + 1;
                $(applet).find('thead th:nth-child(' + i + ') a').attr('tooltip-data-key', column.hoverTip);
            });
        },
        onError: function(collection, resp) {
            var errorModel = new Backbone.Model(resp);
            var errorView = ErrorView.create({
                model: errorModel
            });
            this.showViewInGridContainer(errorView);
        },
        loading: function() {
            this.showViewInGridContainer(this.loadingView);
        },
        showViewInGridContainer: function(viewToShow, options) {
            options = options || {};
            options.preventDestroy = (this.gridContainer.currentView == this.loadingView);
            this.gridContainer.show(viewToShow, options);
        },
        refresh: function(event) {
            if (this.dataGridOptions.refresh !== undefined) {
                this.loading();
                this.dataGridOptions.refresh(this);
                return;
            }
            var collection = this.dataGridOptions.collection;
            if (this.dataGridOptions.collection instanceof Backbone.PageableCollection) {
                collection.setPageSize(INITIAL_NUMBER_OF_ROWS, {
                    silent: true
                });
            }
            this.loading();
            this.createDataGridView();
            if (collection instanceof Backbone.PageableCollection) {
                collection.fullCollection.reset();
            } else {
                collection.reset();
            }
            ResourceService.clearCache(collection.url);
            this.fetchData();
        },
        fetchData: function() {
            ResourceService.fetchCollection(this.dataGridOptions.collection.fetchOptions, this.dataGridOptions.collection);
        },
        buildJdsDateFilter: function(dateField, options) {
            var isOverrideGlobalDate, fromDate, toDate, customFilter, operator;

            options = options || {};
            _.defaults(options, {
                isOverrideGlobalDate: false,
                operator: 'and'
            }); // by default use global date
            isOverrideGlobalDate = options.isOverrideGlobalDate;
            customFilter = options.customFilter;
            operator = options.operator;

            if (isOverrideGlobalDate) {
                fromDate = options.fromDate;
                toDate = options.toDate;
            } else {
                var globalDate = SessionStorage.getModel('globalDate');
                if (globalDate.get('selectedId') !== undefined && globalDate.get('selectedId') !== null) {
                    fromDate = globalDate.get('fromDate');
                    toDate = globalDate.get('toDate');
                }
            }

            if (fromDate === undefined || fromDate === null || fromDate.trim().length === 0) {
                fromDate = '';
            } else {
                fromDate = '"' + utils.formatDate(fromDate, 'YYYYMMDD', 'MM/DD/YYYY') + '"';
            }

            if (toDate === undefined || toDate === null || toDate.trim().length === 0) {
                toDate = '';
            } else {
                toDate = '"' + utils.formatDate(toDate, 'YYYYMMDD', 'MM/DD/YYYY') + '235959"';
            }

            var dateFilter;

            if (fromDate !== '' && toDate !== '') {
                dateFilter = 'between(' + dateField + ',' + fromDate + ',' + toDate + ')';
            } else if (fromDate === '' && toDate !== '') {
                dateFilter = 'lte(' + dateField + ',' + toDate + ')';
            } else if (fromDate !== '' && toDate === '') {
                dateFilter = 'gte(' + dateField + ',' + fromDate + ')';
            } else {
                console.error('gridAppletView buildJdsDateFilter both fromDate and toDate are empty.');
            }

            if (customFilter !== undefined && customFilter !== null) {
                dateFilter = operator + '(' + dateFilter + ',' + customFilter + ')';
            }

            return dateFilter;
        },
        dateRangeRefresh: function(filterParameter, options) {
            this.dataGridOptions.collection.fetchOptions.criteria.filter =
                this.buildJdsDateFilter(filterParameter, options);

            if (this.dataGridOptions.filterRemoved)
                this.dataGridOptions.collection.fetchOptions.criteria.filter = 'and(ne(removed, true),' + this.dataGridOptions.collection.fetchOptions.criteria.filter + ')';

            var collection = this.dataGridOptions.collection;
            if (this.dataGridOptions.collection instanceof Backbone.PageableCollection) {
                collection.setPageSize(INITIAL_NUMBER_OF_ROWS, {
                    silent: true
                });
            }
            this.loading();

            if (this.dataGridOptions.gistView) {
                this.dataGridView = new GistView(this.dataGridOptions);
            } else {
                this.dataGridView = DataGrid.create(this.dataGridOptions);
            }
            if (collection instanceof Backbone.PageableCollection) {
                collection.fullCollection.reset();
            } else {
                collection.reset();
            }
            ResourceService.fetchCollection(collection.fetchOptions, collection);
        },
        onClickAdd: function(event) {
            this.onClickAdd(event);
        },
        expandRowDetails: function(routeParam) {
            if (routeParam) {
                var row = $('#' + routeParam);
                row.click();
                var windowHeight = $(window).height();
                var scrollPosition = row.offset().top;
                if ((scrollPosition + row.next().height() + 50) > windowHeight) {
                    $('html, body').animate({
                        scrollTop: scrollPosition - 100
                    }, 0);
                }
            }
        },
        showFilterView: function() {
            var filterText = SessionStorage.getAppletStorageModel(this.expandedAppletId, 'filterText', true, this.parentWorkspace);
            if (this.dataGridOptions.filterEnabled === true && filterText !== undefined && filterText !== null && filterText.length > 0) {
                this.$el.find('#grid-filter-' + this.appletConfig.instanceId).toggleClass('collapse in');
                this.$el.find('input[name=\'q-' + this.appletConfig.instanceId + '\']').val(filterText);
                this.filterView.showClearButtonMaybe();
            } else if (this.dataGridOptions.filterDateRangeEnabled && this.appletConfig.fullScreen) {
                this.$el.find('#grid-filter-' + this.appletConfig.instanceId).toggleClass('collapse in');
            }
        },
        onDestroy: function() {
            try {
                if (this.loadingView && !this.loadingView.isDestroyed) {
                    this.loadingView.destroy();
                    this.loadingView = null;
                }
            } catch (e) {
                console.error('Error destroying loadingView in applet:', this.appletConfig.id, e);
            }

            try {
                if (this.dataGridView && !this.dataGridView.isDestroyed) {
                    this.dataGridView.destroy();
                    this.dataGridView = null;
                }
            } catch (e) {
                console.error('Error destroying dataGridView in applet:', this.appletConfig.id, e);
            }
        }
    });
});
