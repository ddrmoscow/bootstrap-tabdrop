/* =========================================================
 * bootstrap-tabdrop.js
 * http://www.eyecon.ro/bootstrap-tabdrop
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Copyright 2013 Jenna Schabdach
 * Copyright 2014 Jose Ant. Aranda
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function ($) {

    var WinResizer = (function () {
        var registered = [];
        var inited = false;
        var timer;
        var resize = function () {
            clearTimeout(timer);
            timer = setTimeout(notify, 100);
        };
        var notify = function () {
            for (var i = 0, cnt = registered.length; i < cnt; i++) {
                registered[i].apply();
            }
        };
        return {
            register: function (fn) {
                registered.push(fn);
                if (inited === false) {
                    $(window).bind('resize', resize);
                    inited = true;
                }
            },
            unregister: function (fn) {
                var registeredFnIndex = registered.indexOf(fn);
                if (registeredFnIndex > -1) {
                    registered.splice(registeredFnIndex, 1);
                }
            }
        }
    }());

    var TabDrop = function (element, options) {
        this.element = $(element);
        this.options = options;

        if (options.align === "left")
            this.dropdown = $('<li class="dropdown hidden pull-left tabdrop"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="display-tab"></span><b class="caret"></b></a><ul class="dropdown-menu"></ul></li>');
        else
            this.dropdown = $('<li class="dropdown hidden pull-right tabdrop"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="display-tab"></span><b class="caret"></b></a><ul class="dropdown-menu"></ul></li>');

        this.dropdown.prependTo(this.element);
        if (this.element.parent().is('.tabs-below')) {
            this.dropdown.addClass('dropup');
        }

        var boundLayout = $.proxy(this.layout, this);

        WinResizer.register(boundLayout);
        //check for bs 2 or 3 usage.
        if (!this.options.usingBootstrap3 && !this.options.usingBootstrap2) {
            this.element.on('click', 'li:not(.tabdrop)', boundLayout);
        }
        else {
            if (this.options.usingBootstrap3) {
                //this will wait for bs v3+ event to finish and then run.
                this.element.on('shown.bs.tab', boundLayout);
            } else {
                // this will wait for bs 2 event
                this.element.on('shown', boundLayout);
            }
        }


        this.teardown = function () {
            WinResizer.unregister(boundLayout);
            //check for bs 2 or 3 usage.
            if (!this.options.usingBootstrap3 && !this.options.usingBootstrap2) {
                this.element.off('click', 'li:not(.tabdrop)', boundLayout);
            }
            else {
                if (this.options.usingBootstrap3) {
                    //this will wait for bs v3+ event to finish and then run.
                    this.element.off('shown.bs.tab', boundLayout);
                } else {
                    // this will wait for bs 2 event
                    this.element.off('shown', boundLayout);
                }
            }
        };

        this.layout();
    };

    TabDrop.prototype = {
        constructor: TabDrop,

        layout: function () {
            var self = this;
            var collection = [];
            var isUsingFlexbox = function (el) {
                return el.element.css('display').indexOf('flex') > -1;
            };

            function setDropdownText(text) {
                self.dropdown.find('a span.display-tab').html(text);
            }

            function setDropdownDefaultText(collection) {
                var text;
                if (jQuery.isFunction(self.options.text)) {
                    text = self.options.text(collection);
                } else {
                    text = self.options.text;
                }
                setDropdownText(text);
            }

            // Flexbox support
            function handleFlexbox() {
                if (isUsingFlexbox(self)) {
                    if (self.element.find('li.tabdrop').hasClass('pull-right')) {
                        self.element.find('li.tabdrop').css({ position: 'absolute', right: 0 });
                        self.element.css('padding-right', self.element.find('.tabdrop').outerWidth(true));
                    }
                }
            }

            function checkOffsetAndPush(recursion) {
                self.element.find('> li:not(.tabdrop)')
					.each(function () {
					    if (this.offsetTop > self.options.offsetTop) {
					        collection.push(this);
					    }
					});

                if (collection.length > 0) {
                    if (!recursion) {
                        self.dropdown.removeClass('hidden');
                        self.dropdown.find('ul').empty();
                    }
                    self.dropdown.find('ul').prepend(collection);

                    if (self.dropdown.find('.active').length == 1) {
                        self.dropdown.addClass('active');
                        setDropdownText(self.dropdown.find('.active > a').html());
                    } else {
                        self.dropdown.removeClass('active');
                        setDropdownDefaultText(collection);
                    }
                    handleFlexbox();
                    collection = [];
                    checkOffsetAndPush(true);
                } else {
                    if (!recursion) {
                        self.dropdown.addClass('hidden');
                    }
                }
            }

            self.element.append(self.dropdown.find('li'));
            checkOffsetAndPush();
        }
    };

    $.fn.tabdrop = function (option) {
        return this.each(function () {
            var $this = $(this),
				data = $this.data('tabdrop'),
				options = typeof option === 'object' && option;
            if (!data) {
                options = $.extend({}, $.fn.tabdrop.defaults, options);
                data = new TabDrop(this, options);
                $this.data('tabdrop', data);
            }
            if (typeof option == 'string') {
                data[option]();
            }
        })
    };

    $.fn.tabdrop.defaults = {
        text: '<i class="fa fa-align-justify"></i>',
        offsetTop: 0,
        //added flags for bs 2 and 3.
        usingBootstrap2: false,
        usingBootstrap3: false
    };

    $.fn.tabdrop.Constructor = TabDrop;

}(window.jQuery);
