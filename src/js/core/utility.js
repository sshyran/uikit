(function(UI) {

    "use strict";

    var stacks = [];

    UI.component('stackMargin', {

        defaults: {
            'cls': 'uk-margin-small-top'
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-uk-margin]", context).each(function() {

                    var ele = UI.$(this), obj;

                    if (!ele.data("stackMargin")) {
                        obj = UI.stackMargin(ele, UI.Utils.options(ele.attr("data-uk-margin")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.columns = this.element.children();

            if (!this.columns.length) return;

            UI.$win.on('resize orientationchange', (function() {

                var fn = function() {
                    $this.process();
                };

                UI.$(function() {
                    fn();
                    UI.$win.on("load", fn);
                });

                return UI.Utils.debounce(fn, 20);
            })());

            UI.$html.on("changed.uk.dom", function(e) {
                $this.columns  = $this.element.children();
                $this.process();
            });

            this.on("display.uk.check", function(e) {
                $this.columns = $this.element.children();
                if (this.element.is(":visible")) this.process();
            }.bind(this));

            stacks.push(this);
        },

        process: function() {

            var $this = this;

            UI.Utils.stackMargin(this.columns, this.options);

            return this;
        },

        revert: function() {
            this.columns.removeClass(this.options.cls);
            return this;
        }
    });


    // responsive element e.g. iframes

    (function(){

        var elements = [], check = function(ele) {

            if (!ele.is(':visible')) return;

            var width  = ele.parent().width(),
                iwidth = ele.data('width'),
                ratio  = (width / iwidth),
                height = Math.floor(ratio * ele.data('height'));

            ele.css({'height': (width < iwidth) ? height : ele.data('height')});
        };

        UI.component('responsiveElement', {

            defaults: {},

            boot: function() {

                // init code
                UI.ready(function(context) {

                    UI.$("iframe.uk-responsive-width, [data-uk-responsive]", context).each(function() {

                        var ele = UI.$(this), obj;

                        if (!ele.data("responsiveIframe")) {
                            obj = UI.responsiveElement(ele, {});
                        }
                    });
                });
            },

            init: function() {

                var ele = this.element;

                if (ele.attr('width') && ele.attr('height')) {

                    ele.data({

                        'width' : ele.attr('width'),
                        'height': ele.attr('height')

                    }).on('display.uk.check', function(){
                        check(ele);
                    });

                    check(ele);

                    elements.push(ele);
                }
            }
        });

        UI.$win.on('resize load', UI.Utils.debounce(function(){

            elements.forEach(function(ele){
                check(ele);
            });

        }, 15));

    })();



    // helper

    UI.Utils.stackMargin = function(elements, options) {

        options = UI.$.extend({
            'cls': 'uk-margin-small-top'
        }, options);

        options.cls = options.cls;

        elements = UI.$(elements).removeClass(options.cls);

        var skip         = false,
            firstvisible = elements.filter(":visible:first"),
            offset       = firstvisible.length ? (firstvisible.position().top + firstvisible.outerHeight()) - 1 : false; // (-1): weird firefox bug when parent container is display:flex

        if (offset === false) return;

        elements.each(function() {

            var column = UI.$(this);

            if (column.is(":visible")) {

                if (skip) {
                    column.addClass(options.cls);
                } else {

                    if (column.position().top >= offset) {
                        skip = column.addClass(options.cls);
                    }
                }
            }
        });
    };

})(UIkit);
