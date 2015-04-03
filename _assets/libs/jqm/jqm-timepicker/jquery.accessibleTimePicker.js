/*
    Author: @jsdev | Anthony Delorie June 2013
    Github: https://github.com/jsdev/mobile508datepicker
    MIT License: as is, feel free to fork =)
    Tested on: IOS, Android, Surface, Modern Browsers, IE10+, IE9
 */

(function ($) {
    "use strict";
    $.fn.extend({
        mobile508timepicker: function (options) {
            var _defaults = {
                    military: true,
                    min: { hours: 0, minutes: 0},
                    max: { hours: 23, minutes: 59},
                    increment: 5
                },
                defaults = null,
                /*jslint multistr: true */
                $el = $('<section class="datetime-picker" id="time-picker" data-role="popup" data-dismissible="false" data-overlay-theme="a"> \
                    <a href="#" data-rel="back" data-role="button" role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right cancel" title="close">Close</a> \
                    <div class="columns"><div role="presentation" aria-hidden="true" class="row-highlight"></div>\
                    <ul class="hours"></ul><ul class="minutes"></ul><ul class="ampm"></ul></div> \
                    <button id="set-btn" data-theme="b" class="ui-btn-hidden" data-disabled="false" title="Set"><span aria-hidden="true">Set</span></button> \
                    </section>'),
                buildEl = function () {
                    $('body').append($el);
                    $el.trigger('create');
                    $el.popup();
                    return $el;
                },
                $textbox = null,
                timeChosen = null,
                buildDOM = function () {
                    var i, n;

                    $hours.add($minutes).empty();
                    for(i = defaults.min.hours; i <= defaults.max.hours; i++) {
                        n = leadZero(i);
                        $hours.append('<li><button data-value="' + n + '">' + n + '</button></li>');
                    }
                    for(i = defaults.min.minutes; i <= defaults.max.minutes; i+= defaults.increment) {
                        n = leadZero(i);
                        $minutes.append('<li><button data-value="' + n + '">' + n + '</button></li>');
                    }

                    $ampm.html('<li><button data-value="AM">AM</button></li><li><button data-value="PM">PM</button></li>')
                    .toggleClass('hidden', defaults.military);
                },
                setTime = function () {
                    $('.selected').removeAttr('aria-label');
                    $('.selected').removeAttr('class');
                    $hours.find('[data-value="' + timeChosen.hours + '"]')
                        .add($minutes.find('[data-value="' + timeChosen.minutes + '"]'))
                        .addClass('selected')
                        .scrollTopMe();

                    $('.selected').each(function(i, element) {
                        $(this).attr('aria-label', 'Selected ' + $(this).text());
                    });
                },
                clicked = function ($this) {
                    var $li = $this.focus().parent(),
                        $ul = $li.parent(),
                        $focused = $(':focus'),
                        typ;

                    if (!$this.length || $this.prop('disabled') ) {
                        $focused.focus();
                        return false;
                    }
                    typ = $ul[0].className;
                    timeChosen[typ] = $this.data('value');
                    setTime();

                    var nextSelectedTime = $ul.next('ul').find('.selected');
                    if ( nextSelectedTime.length > 0 ) {
                        nextSelectedTime.focus();
                    } else {
                        $setBtn.focus();
                    }
                    return true;
                },
                focused = function ($this) {
                    var $li = $this.focus().parent(),
                        $ul = $li.parent(),
                        $focused = $(':focus'),
                        typ;

                    if (!$this.length || $this.prop('disabled') ) {
                        $focused.focus();
                        return false;
                    }
                    typ = $ul[0].className;
                    timeChosen[typ] = $this.data('value');
                    setTime();

                    return true;
                },
                scrolled = function ($ul, scrollToCurrent) {
                    var $lis = $ul.children(),
                        lineHeight = $lis.eq(0).height(),
                        top = $lis.eq(0).position().top - (2 * lineHeight),
                        n = Math.round(-top/lineHeight),
                        $buttons = $ul.find('button'),
                        $button = $lis.eq(n).find('button'),
                        $prevSelected = $ul.find('.selected'),
                        prevSelectedIndex = $buttons.index($prevSelected),
                        typ = $ul[0].className;

                    if (!$button.prop('disabled')) {
                        if (!scrollToCurrent && prevSelectedIndex === n) {
                            return;
                        }
                        $ul.scrollTop((n * lineHeight));
                        timeChosen[typ] = $button.data()['value'];
                        setTime();
                        return;
                    }

                    if (prevSelectedIndex > n ) {
                        $button = $ul.find('button:enabled').eq(0);
                        n = $buttons.index($button);
                        $ul.scrollTop((n * lineHeight));
                        timeChosen[typ] = $button.data()['value'];
                        setTime();
                        return;
                    }

                    if (prevSelectedIndex < n ) {
                        $button = $ul.find('button:enabled').eq(-1);
                        n = $buttons.index($button);
                        $ul.scrollTop((n * lineHeight));
                        timeChosen[typ] = $button.data()['value'];
                        setTime();
                        return;
                    }
                },
                destroy = function () {
                    timeChosen = null;
                },
                close = function () {
                    destroy();
                    $el.popup('close');
                    if (defaults.onClose) {
                        defaults.onClose();
                    }
                    $textbox.focus();
                },
                init = function () {
                    var val = $textbox.val().split(':'),
                        now = new Date(),
                        increment = defaults.increment,
                        floorMinutes = function(minutes) {
                            return Math.floor(minutes/increment) * increment;
                        };

                    /* jslint laxbreak: true */
                    timeChosen = val.length > 1
                        ? { hours: val[0], minutes: val[1] }
                        : { hours: leadZero(now.getHours()), minutes: leadZero(floorMinutes(now.getMinutes())) };

                    buildDOM();
                    $el.popup();
                },
                $hours = $el.find('ul.hours'),
                $minutes = $el.find('ul.minutes'),
                $ampm = $el.find('ul.ampm'),
                $columns = $el.find('.columns'),
                $cancel =  $el.find('.cancel'),
                $setBtn = $el.find('#set-btn'),
                leadZero = function (i) {
                    return ("0" + i).substr(-2);
                };

            $.extend(_defaults, options);

            $el.find('.hours')
                .on('scrollstop', function (e) {
                    var currentTarget = $(e.currentTarget);
                    scrolled(currentTarget);
                    clearTimeout($.data(this, 'scrollTimer'));
                    $.data(this, 'scrollTimer', setTimeout(function() {
                        scrolled(currentTarget, true);
                    }, 500));
                });
            $el.find('.minutes')
                .on('scrollstop', function (e) {
                    var currentTarget = $(e.currentTarget);
                    scrolled(currentTarget);
                    clearTimeout($.data(this, 'scrollTimer'));
                    $.data(this, 'scrollTimer', setTimeout(function() {
                        scrolled(currentTarget, true);
                    }, 500));
                });

            $el
                .on('click', '#set-btn', function () {
                    var h = timeChosen.hours,
                        m = timeChosen.minutes;

                    $textbox.val([h, m].join(':'));
                    close();
                })
                .on('keydown', '#set-btn', function (e) {
                    e.preventDefault();
                    switch (e.which) {
                        case 9:
                            if (e.shiftKey) {
                                $('.selected').eq(2).focus();
                            } else {
                                $cancel.focus();
                            }
                            break;
                        case 13:
                            e.currentTarget.click();
                            break;
                    }
                })
                .on('click', 'ul button', function (e) {
                    clicked($(e.currentTarget));
                })
                .on('keydown', 'ul', function (e) {
                    var $this = $(e.currentTarget),
                        tab = function (dir) {
                            var ifPossible = $this[dir]('ul').find('.selected').length;

                            if (ifPossible) {
                                $this[dir]('ul').find('.selected').focus();
                                return;
                            }

                            switch (dir) {
                                case "prev":
                                    $cancel.focus();
                                    break;
                                case "next":
                                    $setBtn.focus();
                                    break;
                            }
                        },
                        ifPossible = function (dir) {
                            var $possible = $this
                                .find('.selected')
                                .parents('li')
                                [dir]('li')
                                .find('button');
                            if ($possible.length && !$possible.prop('disabled')) {
                                focused($possible);
                            }
                        };
                    e.preventDefault(); //prevents scroll
                    switch (e.which) {
                        case 9:
                            if (e.shiftKey) {
                                tab('prev');
                            } else {
                                tab('next');
                            }
                            return false;
                            break;
                        case 37:
                            tab('prev');
                            break;
                        case 38:
                            ifPossible('prev');
                            break;
                        case 39:
                            tab('next');
                            break;
                        case 40:
                            ifPossible('next');
                            break;
                    }
                })
                .on('keydown', '.cancel', function (e) {
                    e.preventDefault();
                    switch (e.which) {
                        case 9:
                            if (e.shiftKey) {
                                $setBtn.focus();
                            } else {
                                $('.hours .selected').focus();
                            }
                            break;
                        case 13:
                            e.currentTarget.click();
                            break;
                    }
                })
                .on('click', '.cancel', function (e) {
                    e.preventDefault();
                    close();
                })
                .on('keydown', function (e) {
                    if (e.which === 27) {
                        close();
                    }
                });

            //Iterate over the current set of matched elements
            return this.each(function () {
                var $this = $(this),
                    $tp = $('#time-picker');

                //THIS WILL BUILD IT ONCE, vs. only once foreach in collection
                $tp.length || buildEl();

                $this
                    .on('click', function (e) {
                        $('.ui-popup-active .ui-popup').popup('close');
                        $textbox = $(e.currentTarget);
                        defaults = $.extend({}, _defaults);
                        $.extend(defaults, $textbox.data('options'));
                        init();
                        $el.popup('open');
                        setTime();
                        $el.find('.selected').eq(0).focus();
                    })
                    .on('keydown', function (e) {
                        var EnterOrNumberKeys =[13,48,49,50,51,52,53,54,55,56,57];
                        if (EnterOrNumberKeys.indexOf(e.which)+1) { e.currentTarget.click(); }
                    });
            });
        },

        scrollTopMe: function(){
            return this.each(function () {
                var $li = $(this).parent(),
                    $ul = $li.parent(),
                    scrollTop = $ul.children().index($li) * $li.height();

                $ul.scrollTop(scrollTop);
            });
        }
    });

})(jQuery);