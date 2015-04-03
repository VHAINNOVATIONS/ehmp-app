/*
 * jQuery Mobile autocomplete widget (for jQM 1.3, jQuery 1.8/9+)
 * Author: alisa.ky.chen
 * Last Updated: 08/05/2014
 * Resource: x
 */

/*
 * JavaScript Last Call
 * Author: Pituki
 * Resource: https://github.com/pituki/LastCall
 */

var LastCall = function () {
	var index = 0;
	this.register = function (success) {
		var i = index++;
		return function () {
			if (i == index - 1) {
				return success.apply(this, Array.prototype.slice.call(arguments));
			} else {
				return;
			}
		};
	};
};

/*
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 *
 * Resource: learn.jquery.com/jquery-ui/widget-factory/extending-widgets
 */

(function ($, LastCall, window, document, undefined) {
	$.widget("mobile.accessibleautocomplete", $.mobile.listview, {
		options: {
			icon: false,
			shadow: false,
			filterInitialMessage: "",
			filterNoItemsMessage: "",
			filter: true,
			filterReveal: false,
			filterSubmit: false,
			filterMinLength: 0,
			filterMaxItems: 0,
			initSelector: ":jqmData(role='accessible-autocomplete')",
			filterOnPopulateList: false,
			// filterItem: this._filterItem,
			// focusItem: this._focusItem,
			// selectItem: this._selectItem
			// populateList,
			// latestPopulateList,
			// NOTE: Using tap (which is called by click) instead of vclick because
			// vclick potentially fires tap and click on a touchscreen
			// and there are elements behind the absolutely positioned list
			selectItemEvents: "tap"
		},
		_setOption: function (key, value) {
			var $element = this.element,
				op = {};

			value = (value === "false") ? false : value;

			op[ key ] = value;

			if (key === "filterCallback") {
				key = "filterItem";
			}
			this._super(key, value);

		},
		_create: function () {
			// listview
			var o = this.options,
				autocompleteClasses = "",
				listview = this,
				list = this.element,
			// input filter
				search, // = this.search,
				inputWrapper,
			// options
				isInset = o.inset,
				isRevealedOnFilter = o.filterReveal;

			// set default callbacks in options; can be overwritten
			$.extend(o, {
				filterItem: o.filterItem || o.filterCallback || this._filterItem,
				focusItem: o.focusItem || this._focusItem,
				selectItem: o.selectItem || this._selectItem,
				emptyList: o.emptyList || this._emptyList,
				latestPopulateList: new LastCall()
			});

			if (list.children().length === 0) {
				$(list).jqmData("ispopulated", false);
			}

			// create listview markup
			autocompleteClasses += o.inset ? " ui-listview-inset ui-accessible-autocomplete-inset" : "";

			if (isInset) {
				autocompleteClasses += o.corners ? " ui-corner-all" : "";
				autocompleteClasses += o.shadow ? " ui-shadow" : "";
			}

			if (!o.theme) {
				o.theme = $.mobile.getInheritedTheme(this.element, "c");
			}

			list.addClass(function (i, orig) {
				return orig + " ui-listview ui-accessible-autocomplete " + autocompleteClasses;
			});

			listview.refresh(true);

			// create input filter and its form wrapper
			inputWrapper = $("<form>", {
				"class": "ui-listview-filter ui-accessible-autocomplete-filter ui-bar-" + o.filterTheme,
				"role": "search"
			});

			search = $("<input>", {
				placeholder: o.filterPlaceholder
			})
				.attr("data-" + $.mobile.ns + "type", "search")
				.jqmData("lastval", "")
				.appendTo(inputWrapper);
			//.textinput();

			if (isInset) {
				inputWrapper.addClass("ui-listview-filter-inset ui-accessible-autocomplete-filter-inset");
			}

			inputWrapper.insertBefore(list);

			// add reference to input filter to widget
			$.extend(listview, { search: list.prev().find("input").textinput() });

			// create listview wrapper
			if (isInset && isRevealedOnFilter) {
				list.children().addClass("ui-screen-hidden");
				// Wrap the list in a div for absolute positioning
				list.wrapAll($('<div class="ui-listview-wrapper ui-accessible-autocomplete-wrapper ui-scrollable-wrapper"><div class="ui-scrollable + ' + (o.shadow ? "ui-shadow" : "") + '"></div></div>'));
			}

			listview._delegateEvents();
		},
		_resize: function () {
			var list = this.element,
				listScroller = $(list).closest(".ui-scrollable");

			if (listScroller.length > 0) {
				var listScrollHeight,
					container = list.closest(":jqmData(role=popup),:jqmData(role=content),:jqmData(role=panel),:jqmData(role=page)"),
					containerHeight,
					lastContainerHeight = list.jqmData("lastcontainerheight");

				if (typeof container !== "undefined") {
					var cssHeight = parseInt(container.css("height"), 10),
						cssMaxHeight = parseInt(container.css("max-height"), 10);

					containerHeight = ( cssMaxHeight < cssHeight ) ? cssMaxHeight : cssHeight;
				} else {
					containerHeight = window.innerHeight;
				}

				if (lastContainerHeight !== containerHeight) {
					listScrollHeight = containerHeight + container.offset().top - listScroller.offset().top - parseInt(listScroller.css('margin-bottom'), 10);
					list.jqmData("lastcontainerheight", containerHeight);

					listScroller.css({ "max-height": listScrollHeight });
				}
			}
		},
		refresh: function (create) {
			this.parentPage = this.element.closest(".ui-page");

			var o = this.options,
				$list = this.element,
				self = this,
				dividertheme = $list.jqmData("dividertheme") || o.dividerTheme,
				listsplittheme = $list.jqmData("splittheme") || o.splitTheme,
				listspliticon = $list.jqmData("spliticon") || o.splitIcon,
				listicon = $list.jqmData("icon") || o.icon,
				li = this._getChildrenByTagName($list[ 0 ], "li", "LI"),
				visibleLi = li.filter(":not(.ui-screen-hidden)"),
				ol = !!$.nodeName($list[ 0 ], "ol"),
				jsCount = !$.support.cssPseudoElement,
				start = $list.attr("start"),
				listItem,
				itemClassDict = {},
				item, itemClass, itemTheme,
				a, last, splittheme, counter, startCount, newStartCount, countParent, icon, imgParents, img, linkIcon;

			if (ol && jsCount) {
				$list.find(".ui-li-dec").remove();
			}

			if (ol) {
				// Check if a start attribute has been set while taking a value of 0 into account
				if (start || start === 0) {
					if (!jsCount) {
						startCount = parseInt(start, 10) - 1;
						$list.css("counter-reset", "listnumbering " + startCount);
					} else {
						counter = parseInt(start, 10);
					}
				} else if (jsCount) {
					counter = 1;
				}
			}

			if (!o.theme) {
				o.theme = $.mobile.getInheritedTheme(this.element, "c");
			}

			for (var pos = 0, numli = li.length; pos < numli; pos++) {
				item = li.eq(pos);
				itemClass = "ui-li";
				var ariaLink = item.attr('data-ariaLink');
				if (typeof ariaLink === 'undefined') {
					ariaLink = null;
				}

				// If we're creating the element, we update it regardless
				if (create || !item.hasClass("ui-li")) {
					itemTheme = item.jqmData("theme") || o.theme;
					a = this._getChildrenByTagName(item[ 0 ], "a", "A");
					var isDivider = ( item.jqmData("role") === "list-divider" );

					// As a filtered listview, every non-static item except headers should be clickable
					if (a.length === 0 && !isDivider && !item.hasClass("ui-li-static")) {
						a = $('<a href="#" class="ui-link-inherit"></a>');
						if (ariaLink) {
							a.attr('aria-labelledby',ariaLink);
						}
						item.contents().wrapAll(a);
					}

					if (a.length && !isDivider) {
						icon = item.jqmData("icon");

						item.buttonMarkup({
							wrapperEls: "div",
							shadow: false,
							corners: false,
							iconpos: "right",
							icon: (a.length > 1 || icon === false) ? false : icon || listicon || o.icon,
							theme: itemTheme
						});

						if (( icon !== false ) && ( a.length === 1 )) {
							item.addClass("ui-li-has-arrow");
						}

						a.first().removeClass("ui-link").addClass("ui-link-inherit");

						if (a.length > 1) {
							itemClass += " ui-li-has-alt";

							last = a.last();
							splittheme = listsplittheme || last.jqmData("theme") || o.splitTheme;
							linkIcon = last.jqmData("icon");

							last.appendTo(item)
								.attr("title", $.trim(last.getEncodedText()))
								.addClass("ui-li-link-alt")
								.empty()
								.buttonMarkup({
									shadow: false,
									corners: false,
									theme: itemTheme,
									icon: false,
									iconpos: "notext"
								})
								.find(".ui-btn-inner")
								.append(
									$(document.createElement("span")).buttonMarkup({
										shadow: true,
										corners: true,
										theme: splittheme,
										iconpos: "notext",
										// link icon overrides list item icon overrides ul element overrides options
										icon: linkIcon || icon || listspliticon || o.splitIcon
									})
								);
						}
					} else if (isDivider) {
						itemClass += " ui-li-divider ui-bar-" + ( item.jqmData("theme") || dividertheme );
						item.attr("role", "heading");

						if (ol) {
							//reset counter when a divider heading is encountered
							if (start || start === 0) {
								if (!jsCount) {
									newStartCount = parseInt(start, 10) - 1;
									item.css("counter-reset", "listnumbering " + newStartCount);
								} else {
									counter = parseInt(start, 10);
								}
							} else if (jsCount) {
								counter = 1;
							}
						}

					} else {
						itemClass += " ui-li-static ui-btn-up-" + itemTheme;
					}
				}

				if (ol && jsCount && itemClass.indexOf("ui-li-divider") < 0) {
					countParent = itemClass.indexOf("ui-li-static") > 0 ? item : item.find(".ui-link-inherit");

					countParent.addClass("ui-li-jsnumbering")
						.prepend("<span class='ui-li-dec'>" + ( counter++ ) + ". </span>");
				}

				// Instead of setting item class directly on the list item and its
				// btn-inner at this point in time, push the item into a dictionary
				// that tells us what class to set on it so we can do this after this
				// processing loop is finished.

				if (!itemClassDict[ itemClass ]) {
					itemClassDict[ itemClass ] = [];
				}

				itemClassDict[ itemClass ].push(item[ 0 ]);
			}

			// Set the appropriate listview item classes on each list item
			// and their btn-inner elements. The main reason we didn't do this
			// in the for-loop above is because we can eliminate per-item function overhead
			// by calling addClass() and children() once or twice afterwards. This
			// can give us a significant boost on platforms like WP7.5.

			for (itemClass in itemClassDict) {
				$(itemClassDict[ itemClass ]).addClass(itemClass).children(".ui-btn-inner").addClass(itemClass);
			}

			$list.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading")
				.end()

				.find("p, dl").addClass("ui-li-desc")
				.end()

				.find(".ui-li-aside").each(function () {
					var $this = $(this);
					$this.prependTo($this.parent()); //shift aside to front for css float
				})
				.end()

				.find(".ui-li-count").each(function () {
					$(this).closest("li").addClass("ui-li-has-count");
				}).addClass("ui-btn-up-" + ( $list.jqmData("counttheme") || this.options.countTheme) + " ui-btn-corner-all");

			// The idea here is to look at the first image in the list item
			// itself, and any .ui-link-inherit element it may contain, so we
			// can place the appropriate classes on the image and list item.
			// Note that we used to use something like:
			//
			//    li.find(">img:eq(0), .ui-link-inherit>img:eq(0)").each( ... );
			//
			// But executing a find() like that on Windows Phone 7.5 took a
			// really long time. Walking things manually with the code below
			// allows the 400 listview item page to load in about 3 seconds as
			// opposed to 30 seconds.

			this._addThumbClasses(li);
			this._addThumbClasses($list.find(".ui-link-inherit"));

			this._addFirstLastClasses(li, this._getVisibles(li, create), create);
			// autodividers binds to this to redraw dividers after the listview refresh
			this._trigger("afterrefresh");
		},
		_delegateEvents: function () {
			// listview
			var o = this.options,
				listview = this,
				list = listview.element,
			// input filter
				search = listview.search,
				input = search.get(0),
				inputWrapper = search.closest("form"),
			// delete icon
				clearBtn = search.next(),
			// if jQuery UI loaded, find next tabbable after input, ignoring ui-input-clear
				_focusNextTabbable = function (currentElement) {
					var nextTabbable,
						tabbables;

					if (typeof jQuery.ui !== "undefined") {

						nextTabbable = $(input).next(":tabbable:not(.ui-input-clear)");

						if (nextTabbable.length === 0) {
							tabbables = inputWrapper.closest(":jqmData(role=popup),:jqmData(role=panel),:jqmData(role=page)")
								.find(":tabbable:not(.ui-input-clear, .ui-accessible-autocomplete a)");
							nextTabbable = tabbables.eq(tabbables.index(input) + 1);
						}

						nextTabbable.focus();
					} else {
						currentElement.blur();
					}
				},
			// event handlers
				_inputkeyDownControls = function (e) {
					if (e.which === 13) {
						e.preventDefault();
						inputWrapper.trigger('submit');
					}
				},
				_keyDownControls = function (e) {
					var key = e.which,
						item = $(e.currentTarget).closest("li");

					switch (key) {
						case 13: // Enter
						case 32: // Space Bar
						case 39: // Right Arrow
							//item.removeClass("ui-focus");
							o.selectItem(search, item);
							$(list).blur();
							if (o.filterReveal) {
								list.trigger('hide');
							}
							_focusNextTabbable(this);
							break;
						case 27: // Escape
							e.preventDefault();
							listview._getVisibles(list.children(), false).each(function () {
								$(this).removeClass("ui-focus ui-btn-hover-" + $(this).jqmData("theme"))
									.addClass("ui-btn-up-" + $(this).jqmData("theme"));
							});
							search.focus();
							return false;
							break;
						case 38: // Up Arrow
							listview._focusPrevItem(item);
							break;
						case 40: // Down Arrow
							listview._focusNextItem(item);
							break;
						default:
							break;
					}
				},
				_inputKeyUpControls = function (e) {
					var key = e.which;

					switch (key) {
						case 27: // Escape
							e.preventDefault();
							$(list).blur();
							if (o.filterReveal) {
								list.trigger('hide');
							}
							_focusNextTabbable(this);
							return false;
							break;
						case 38: // Up Arrow
							listview._focusPrevItem();
							break;
						case 40: // Down Arrow
							listview._focusNextItem();
							break;
						default:
							// handled by input event
							break;
					}
				},
				_inputKeyUp = function (e) {
					if (!o.filterSubmit) {
						$(list).trigger("filter");
					} // else Enter handled by submit event
				},
				_blur = function (e) {
					setTimeout(function () {
						var li,
							listItems;

						if (!( search.is(":focus") ||
							$(list).is(":focus") || $(list).find("li.ui-focus").length > 0 || search.next().is(":focus") )) {
							// search.next() checks focus on delete icon
							li = list.children();
							listItems = listview._getVisibles(li, false);

							listItems.each(function () {
								$(this).removeClass("ui-focus ui-btn-hover-" + $(this).jqmData("theme"))
									.addClass("ui-btn-up-" + $(this).jqmData("theme"));
							});
							listview._addFirstLastClasses(li, listItems, false);

							listview._trigger("afterblur", "afterblur", listview.search[0]);
						}
					}, 200);
				};

			// delegate recalculating max-height to window
			if (o.filterReveal && o.filterInset) {
				$(window).on("resize", function (e) {
					clearTimeout(window.resizeEvent);
					window.resizeEvent = setTimeout(function () {
						listview._resize();
					}, 250);
				});
			}

			// delegate listview events
			listview._on(list, {
				"blur": _blur,
				"filter": listview._filterList,
				"empty": listview._emptyList,
				"show": listview._showList,
				"hide": listview._hideList
			});

			$(list).on("blur", "li", _blur)
				.on("keydown", "a", _keyDownControls)
				.on("click", "a", function (e) {
					e.preventDefault();
				})
				.on(o.selectItemEvents + " selectitem", "a", function (e) {
					e.preventDefault();
					var item = $(e.currentTarget).closest("li");
					item.removeClass("ui-focus");
					o.selectItem(search, item);
					if (o.filterReveal) {
						list.trigger('hide');
					}
				});

			// delegate form (wrapping filter) events
			inputWrapper.on({
				"submit": function (e) {
					e.preventDefault();
					list.trigger('filter');
					search.blur();
					return false;
				}
			});

			// delegate input filter events
			search.on({
				"blur": _blur,
				"keydown": _inputkeyDownControls,
				"keyup": _inputKeyUpControls,
				"change focus input": _inputKeyUp
			});

			//search.one( "focus click tap", listview._highlightInput )
			//.bind( "blur", function() {
			//	search.one( "focus click tap", listview._highlightInput );
			//})
			if (o.filterReveal && o.filterInset) {
				search.one("focus", function () {
					listview._resize();
				});
			}

			$("input").on("focus", function(){

			});

			// delegate input filter delete events
			clearBtn.on({
				"keydown": function (e) {
					switch (e.which) {
						case 13:
						case 32:
							$(list).trigger("filter");
					}
				},
				"click": function () {
					if (o.filterSubmit) {
						$(list).trigger("filter");
					}
				}
			});


		},
		// TODO: correct which event goes to this handler or wrap as needed
		_highlightInput: function (e) {
			$(this).select();
			e.preventDefault();
			return false;
		},
		_showList: function (e) {
			$(e.currentTarget).children().toggleClass("ui-screen-hidden", false);
		},
		_hideList: function (e) {
			$(e.currentTarget).children().toggleClass("ui-screen-hidden", true);
		},
		_emptyList: function (deferred, searchValue, list) {
			list.empty();

			return deferred.resolve();
		},
		_filterList: function (e) {
			// listview
			var list = e.currentTarget,
				$list = $(list),
				listview = $list.data("mobile-accessibleautocomplete"),
				o = listview.options,
				isPopulated = $list.jqmData("ispopulated"),
				li = $list.children(),
				listItems = null,
			// input filter
				search = listview.search,
				val = search.val().toLowerCase().trim(),
				lastVal = search.jqmData("lastval") || "",
				lastValToPopulate = search.jqmData("lastpopulatedval") || "",
			// options
				minValLength = o.filterMinLength,
				isRevealedOnFilter = !!o.filterReveal,
			// Check if a custom callback applies
				isRemotePopulate = typeof o.populateList === "function",
				populateListWrapper = o.latestPopulateList.register,
				isCustomFilterCallback = o.filterItem !== listview._filterItem,
			// options, initial and no items message
				initialMessage = o.filterInitialMessage.trim(),
				initialMessageItem = $list.children(".ui-li-initial-message"),
				noItemsMessageItem = $list.children(".ui-li-no-items-message"),
				prependInitialMessage = function () {
					if (initialMessage !== "") {
						if (initialMessageItem.length === 0) {
							// TODO: correct theming
							noItemsMessageItem = $('<li class="ui-li-static ui-li ui-btn-up-c ui-li-unfiltered ui-li-initial-message"></li>');
						}
						$list.prepend(initialMessageItem.text(initialMessage));
					} else {
						initialMessageItem.remove();
					}
				};

			// Execute the handler only once per value change
			if (!isRevealedOnFilter && lastVal && lastVal === val) {
				return;
			}

			listview._trigger("beforefilter", "beforefilter", { input: search.get(0) });

			// Change val as lastval for next execution
			search.jqmData("lastval", val);

			// Remove initial and no items messages
			initialMessageItem.remove();
			noItemsMessageItem.remove();

			// Check the trimmed value satisfies the min val length
			// Else filter

			if (val.length < minValLength) {

				if (isRemotePopulate) {

					if (lastValToPopulate !== "") {

						(function populateReady(deferred, searchValue, list) {

							$list.jqmData("ispopulated", false);
							return populateListWrapper(o.emptyList)(deferred, searchValue, list);

						})($.Deferred(), val, $list).then(function () {
								$list.jqmData("ispopulated", true);
								search.jqmData("lastpopulatedval", "");

								prependInitialMessage();

								listview.refresh(false);
								// Don't filter
							});
					}

					return;
				} else {

					prependInitialMessage();

					//filtervalue length is less than minimum => show all
					li.toggleClass("ui-screen-hidden", isRevealedOnFilter);
				}

			} else {

				// Determine if full list is needed or subset can be used
				// If remotely populated, make call only if value has changed or matches are outside current bucket
				// Else if val is a 'new string', then
				// Else val is equivalent to another character appended to the last val, then use currently visible
				if (isRemotePopulate && lastVal !== val && ( !isPopulated || !o.filterOnPopulateList || ( isPopulated && ( lastValToPopulate === "" || val.indexOf(lastValToPopulate) !== 0 || li.length >= o.filterMaxItems ) ) )) {
					(function populateReady(deferred, searchValue, list) {

						$list.jqmData("ispopulated", false);
						return populateListWrapper(o.populateList)(deferred, searchValue, list);

					})($.Deferred(), val, $list).then(function () {
							$list.jqmData("ispopulated", true);
							search.jqmData("lastpopulatedval", val);

							listview.refresh(false);
							li = $list.children();

							listItems = li;
							// Filter
							listview._filterListHelper(listItems);
						});

					return;
				} else if (isCustomFilterCallback || lastVal.length < minValLength || val.length < lastVal.length || val.indexOf(lastVal) !== 0) {

					// Custom filter callback applies or removed chars or pasted something totally different, check all items
					listItems = li;

				} else {

					// Only chars added, not removed, only use visible subset
					listItems = li.filter(":not(.ui-screen-hidden)");

					if (!listItems.length && o.filterReveal) {
						listItems = li.filter(".ui-screen-hidden");
					}
				}

				// Filter, calls _addFirstLastClasses()
				listview._filterListHelper(listItems);
				return;
			}

			listview._addFirstLastClasses(li, listview._getVisibles(li, false), false);
		},
		_filterListHelper: function (listItems) {
			// listview
			var listview = this,
				list = this.element,
				$list = $(list),
				o = listview.options,
				li, // = $list.children(),
				childItems = false,
			// list item
				itemtext = "",
				item,
			// input filter
				search = listview.search,
				val = search.val().toLowerCase().trim(),
			// Check if a custom callback applies
			// options, initial and no items message
				noItemsMessage = o.filterNoItemsMessage.trim(),
				noItemsMessageItem = $list.children(".ui-li-no-items-message"),
				appendNoItemsMessage = function () {
					if (noItemsMessage !== "") {
						if (noItemsMessageItem.length === 0) {
							// TODO: correct theming
							noItemsMessageItem = $('<li class="ui-li-static ui-li ui-btn-up-c ui-li-unfiltered ui-li-no-items-message"></li>');
						}
						$list.append(noItemsMessageItem.text(noItemsMessage));
					} else {
						noItemsMessageItem.remove();
					}
				};

			// Always show unfiltered list items
			$list.children(".ui-li-unfiltered").toggleClass("ui-screen-hidden", false);

			// Filter list or subset

			if (typeof val !== "undefined") {

				// This handles hiding regular rows without the text we search for
				// and any list dividers without regular rows shown under it

				if (o.filterOnPopulateList) {
					for (var i = listItems.length - 1; i >= 0; i--) {
						item = $(listItems[ i ]);
						itemtext = item.jqmData("filtertext") || item.text();

						if (item.is("li:jqmData(role=list-divider):not(.ui-li-unfiltered)")) {

							item.toggleClass("ui-filter-hidequeue", !childItems);

							// New bucket!
							childItems = false;

						} else if (!item.hasClass("ui-li-unfiltered") && o.filterItem(itemtext, val, item)) {

							//mark to be hidden
							item.toggleClass("ui-filter-hidequeue", true);
						} else {

							// There's a shown item in the bucket
							childItems = true;
						}
					}
				}

				// Show items, not marked to be hidden
				listItems
					.filter(":not(.ui-filter-hidequeue)")
					.toggleClass("ui-screen-hidden", false);

				// Hide items, marked to be hidden
				listItems
					.filter(".ui-filter-hidequeue")
					.toggleClass("ui-screen-hidden", true)
					.toggleClass("ui-filter-hidequeue", false);
			}

			if (listItems.filter(":not(.ui-screen-hidden,.ui-li-divider,.ui-li-unfiltered)").length === 0) {
				appendNoItemsMessage();
			} else {
				noItemsMessageItem.remove();
			}
			li = $list.children();
			listview._addFirstLastClasses(li, listview._getVisibles(li, false), false);
		},
		// default callbacks in options (filterItem, focusItem, selectItem)
		_filterItem: function (text, searchValue, item) {
			return text.toString().toLowerCase().indexOf(searchValue) === -1;
		},
		_focusItem: function (item) {
			item.find("a").focus();
		},
		_focusPrevItem: function (currItem) {
			var prevItem,
				listItems = this._getVisibles(this.element.children(":not(.ui-disabled, .ui-li-static, :jqmData(role='list-divider')) "), false);

			if (typeof currItem === "undefined" || currItem.length === 0 || currItem.index() === listItems.first().index()) {
				// Loop around to last visible item
				prevItem = listItems.last();
			} else {
				prevItem = listItems.eq(listItems.index(currItem) - 1);
			}

			// Return focus to search if nothing valid to focus on in list
			if (prevItem.length === 0) {
				this.search.focus();
				return;
			}

			if (typeof currItem !== "undefined") {
				currItem.removeClass("ui-focus ui-btn-hover-" + currItem.jqmData("theme"))
					.addClass("ui-btn-up-" + currItem.jqmData("theme"));
			}

			prevItem.removeClass("ui-btn-up-" + prevItem.jqmData("theme"))
				.addClass("ui-focus ui-btn-hover-" + prevItem.jqmData("theme"));

			this.options.focusItem(prevItem);

			return prevItem;
		},
		_focusNextItem: function (currItem) {
			var nextItem,
				listItems = this._getVisibles(this.element.children(":not(.ui-disabled, .ui-li-static, :jqmData(role='list-divider'))"), false);

			if (typeof currItem === "undefined" || currItem.length === 0 || currItem.index() === listItems.last().index()) {
				// Loop around to first visible item
				nextItem = listItems.first();
			} else {
				nextItem = listItems.eq(listItems.index(currItem) + 1);
			}

			// Return focus to search if nothing valid to focus on in list
			if (nextItem.length === 0) {
				this.search.focus();
				return;
			}

			if (typeof currItem !== "undefined") {
				currItem.removeClass("ui-focus ui-btn-hover-" + currItem.jqmData("theme"))
					.addClass("ui-btn-up-" + currItem.jqmData("theme"));
			}

			nextItem.removeClass("ui-btn-up-" + nextItem.jqmData("theme"))
				.addClass("ui-focus ui-btn-hover-" + nextItem.jqmData("theme"));

			this.options.focusItem(nextItem);

			return nextItem;
		},
		_selectItem: function (search, item) {
			search.val(item.find("a:first-of-type").text());
		}
	});

	$.mobile.document.bind("pagecreate create", function (e) {
		$.mobile.accessibleautocomplete.prototype.enhanceWithin(e.target);
	});
})(jQuery, LastCall, window, document);

(function ($, undefined) {

	$.mobile.accessibleautocomplete.prototype.options.autodividers = false;
	$.mobile.accessibleautocomplete.prototype.options.autodividersSelector = function (elt) {
		// look for the text in the given element
		var text = $.trim(elt.text()) || null;

		if (!text) {
			return null;
		}

		// create the text for the divider (first uppercased letter)
		text = text.slice(0, 1).toUpperCase();

		return text;
	};

	$.mobile.document.delegate("ul,ol", "accessibleautocompletecreate", function () {

		var list = $(this),
			listview = list.data("mobile-accessibleautocomplete");

		if (!listview || !listview.options.autodividers) {
			return;
		}

		var replaceDividers = function () {
			list.find("li:jqmData(role='list-divider')").remove();

			var lis = list.find('li'),
				lastDividerText = null, li, dividerText;

			for (var i = 0; i < lis.length; i++) {
				li = lis[i];
				dividerText = listview.options.autodividersSelector($(li));

				if (dividerText && lastDividerText !== dividerText) {
					var divider = document.createElement('li');
					divider.appendChild(document.createTextNode(dividerText));
					divider.setAttribute('data-' + $.mobile.ns + 'role', 'list-divider');
					li.parentNode.insertBefore(divider, li);
				}

				lastDividerText = dividerText;
			}
		};

		var afterListviewRefresh = function () {
			list.unbind('accessibleautocompleteafterrefresh', afterListviewRefresh);
			replaceDividers();
			listview.refresh();
			list.bind('accessibleautocompleteafterrefresh', afterListviewRefresh);
		};

		afterListviewRefresh();
	});

})(jQuery);