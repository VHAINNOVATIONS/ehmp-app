define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'backgrid',
    'backgrid.paginator'
], function(Backbone, Marionette, $, _, Backgrid) {
    'use strict';
    var Paginator = {};

    Paginator.create = function(options) {
        var PageHandle = Backgrid.Extension.PageHandle.extend({
            render: function (vars) {
              this.$el.empty();
              var elem;
              if(this.title !== 'Next' && this.title !== 'Previous'){
                elem = document.createElement("span");
              }else {
                elem = document.createElement("a");
                elem.href = '#';
              }

              elem.title = this.title;
              elem.innerHTML = this.label;
              this.el.appendChild(elem);

              var collection = this.collection;
              var state = collection.state;
              var currentPage = state.currentPage;
              var pageIndex = this.pageIndex;

              if (this.isRewind && currentPage == state.firstPage ||
                 this.isBack && !collection.hasPreviousPage() ||
                 this.isForward && !collection.hasNextPage() ||
                 this.isFastForward && (currentPage == state.lastPage || state.totalPages < 1)) {
                this.$el.addClass("disabled");
              }
              else if (!(this.isRewind ||
                         this.isBack ||
                         this.isForward ||
                         this.isFastForward) &&
                       state.currentPage == pageIndex) {
                this.$el.addClass("active");
              }

              this.delegateEvents();
              return this;
            }
        });

        var paginatorOptions = {
            slideScale: 0,
            pageHandle: PageHandle
        };
        _.extend(paginatorOptions, options);
        var paginatorView = new Backgrid.Extension.Paginator(paginatorOptions);
        return paginatorView;
    };

    return Paginator;
});
