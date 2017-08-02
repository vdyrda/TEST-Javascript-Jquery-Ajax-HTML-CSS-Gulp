"use strict";

(function(){

/************************
*    Top navigation     *
************************/
    function Topnav(s) {
        var selector = s;

        if ($(selector).length === 0) {
            // Wrong selector
            console.log('There is no top navigation here.');
            return false;
        }

        $(selector + " .menu > li").each(function () {
            var source = $(this).attr('data-html-source') || '';
            source = source.trim();
            if (source === '') { return false; } // no submenu

            $(this).addClass('has_submenu');

            var $submenu = $(this).children('.submenu');

            if ($submenu.length === 0) {
                $submenu = $('<div class="submenu"></div>').appendTo(this);
            } else {
                $submenu.empty();
            }
            $submenu = $('<div class="container wrap"></div>').appendTo($submenu);

            // load submenu
            var jqxhr = $.getJSON( source, function () {
                console.log("submenu is downloaded");
            })
            .done(function(d) {
                var data = d.data;
                var width, cols, $sub, items, itemsLength, item;

                for(var i=0; i<data.length; i++) {

                    (i === 0) ? (width = 'w60p', cols = 'cols-3') // first column is 60% width and has 3 columns
                        :
                        (width = 'w40p', cols = 'cols-2'); // second column is 40% width and has 2 columns

                    $sub = $('<div class="sub '+width+'"></div>').appendTo($submenu);
                    $('<h4>'+data[i].title+'</h4>').appendTo($sub);
                    items = data[i].items;
                    itemsLength = items.length;
                    var menuItems = [];
                    for(var j=0; j<itemsLength; j++) {
                        item = items[j];
                        menuItems.push('<li><a href="' + item.url + '">' + item.name +'</a></li>');
                    }
                    $( "<ul/>", {
                        "class": "submenu cols "+cols,
                        html: menuItems.join("")
                    }).appendTo($sub);
                }
            })
            .fail(function() {
                console.log('submenu request failed');
            });
        });
    }


/************ 
* Dropdowns *
*************/
    function Dropdown(selector) {
        var selector = selector;

        if ($(selector).length === 0) { 
            // Wrong selector
            console.log('There is no dropdowns here.');
            return false;
        }

        $(selector).each(function(){
            // DOM manipulations
            $(this).wrapInner('<div/>');
            $(this).children('div').hide();
            var $options = $(this).children('div').children('span');
            var $selected = $options.filter('.selected');
            if ($selected.length === 0) {
                $selected = $($options[0]).addClass('selected');
            }
            var value = $selected.attr('data-html');
            var txt = $selected.text();
            $p = $('<p/>').prependTo(this);
            $p.text(txt).attr('data-html', value);

            // open/close a dropdown
            $p.on('click', function(e) {
                var $group = $(this).next();
                if($group.is(":visible")) {
                   $group.hide();
                } else {
                   $group.show();
                }
            });

            // click on the row of dropdown
            $options.on('click', function(e) {
                $(this).addClass('selected').siblings().removeClass('selected');
                var txt = $(this).text();
                var value = $(this).attr('data-html');
                $(this).parent().prev().text(txt).attr('html-data', value);
                $(this).parent().hide();
            });

            // close the dropdown except just clicked
            $(this).on('click', function(e) {
                $(selector).not(e.currentTarget).trigger('myclick');
                e.stopImmediatePropagation();
            });

            // close the dropdown
            $(this).on('myclick', function() {
                $(this).children('div').hide();
            });
        });

        // send blur 
        $(window).click(function(e){
            $(selector).trigger('myclick');
        });
    }

/************
*  Gallery  *
************/
    function Gallery(selector){
        var class_active = 'active';

        $(selector).each(function() {
            $(this).find('a').on('click', function(e) {
                e.preventDefault();
                var $thumb_li = $(this).parent();
                var ind = $thumb_li.prevAll().length;
                $thumb_li.addClass(class_active).siblings('.'+class_active).removeClass(class_active);
                $thumb_li.parent().parent().siblings('.full').children().children().removeClass(class_active).eq(ind).addClass(class_active);
            });
        });
    }

/************************
*  DOM Transformations  *
************************/
    var DomTransformations = function() {
        var bg = 'data-html-bg';
        $('['+bg+']').each(function() {
            $(this).css({'background-color': $(this).attr(bg)});
        });
    }


/***************
*   Quantity   *
****************/
    var Quantity = function(s) {
        var selector = s || '.quantity';
        $(selector).each(function() {
            $(this).children('button').on('click', function(e) {
                e.preventDefault();
                var $input = $(this).siblings('input');
                var value = parseInt( $input.val(), 10);
                var vMin = parseInt( $input.attr('data-html-min'), 10);
                var vMax = parseInt( $input.attr('data-html-max'), 10);
                var op = $(this).text().trim();
                switch (op) {
                    case '+':
                        value++;
                        break;
                    case '-':
                        value--;
                }
                if (value >= vMin && value <= vMax) {
                    $input.val(value);
                }
            });
        });
    }

/***********
*   Tabs   *
***********/
    var Tabs = function(s) {
        var class_active = 'active';
        var selector = s || '.tabs';

        $(selector).each(function() {
            $(this).children('nav').children('a').on('click', function(e) {
                e.preventDefault();
                var target = $(this).attr('href');
                $(this).addClass(class_active).siblings().removeClass(class_active);
                var $tabs = $(this).parent().siblings('.tab');
                $tabs.removeClass(class_active).filter(':visible').hide();
                $tabs.filter('[data-html-tab=' + target + ']').show(300);
            }).first().trigger('click');
        });
    }

/***********
*  Slider  *
***********/
    var CamoSlider = function(s){
        var class_first = 'first';
        var selector = s || '.CamoSlider';
        $(selector).each(function() {
            $(this).children('nav').children('b').on('click', function() {
                var $slides = $(this).parent().siblings('.slider').find('li');
                var items = $slides.length;
                var width = $slides.first().width();
                var ind = $slides.filter('.'+class_first).prevAll().length || 1;
                var containerWidth = $(this).parent().siblings('.slider').width();
                var quantity = Math.floor(parseInt(containerWidth, 10) / parseInt(width, 10));
                var maxInd = items - quantity + 1;
                var newInd = ($(this).is('.prev')) ? ind - quantity : ind + quantity;
                if (newInd <= 0) { newInd = 1; }
                if (newInd > maxInd) { newInd = maxInd; }
                if (newInd !== ind) {
                    var $ul = $(this).parent().siblings('.slider').find('ul');
                    // move slider
                    $slides.removeClass(class_first).eq(newInd).addClass(class_first);
                    var marginLeft = parseInt($slides.last().css('margin-left'), 10);
                    var offset = (newInd-1)*width + ((newInd === 1) ? 0 : (quantity-1)*marginLeft);
                    $ul.css({'margin-left': '-' + offset + 'px'});
                }
            });
        });
    }


// Page scripts initialization
    $(document).ready(function() {
        Topnav('#page_nav_top');
        Dropdown('.dropdown');
        Gallery('#prod_gallery');
        Quantity();
        Tabs();
        CamoSlider('.CamoSlider');
        DomTransformations();
    });
    
})();