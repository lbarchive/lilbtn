/**
 * @preserve jknav
 * @name      jquery.jknav.js
 * @author    Yu-Jie Lin http://lmgtfy.com/?q=livibetter
 * @version   0.2
 * @date      09-15-2010
 * @copyright (c) 2010 Yu-Jie Lin <livibetter@gmail.com>
 * @license   BSD License
 * @homepage  http://lilbtn.blogspot.com/2010/05/js-jquery-jknav-jk-binding-navigation.html
 * @example   http://lilbtn.googlecode.com/hg/src/static/js/jquery/jquery.jknav.demo.html
*/
(function ($) {
	/**
	 * Add jQuery objects to navgation list
	 *
	 * @param {Function} callback Callback function to be invoked after plugin scroll to item
	 * @param {String} name Navagation set name
	 * @return {jQuery} <code>this</code> for chaining
	 */
	$.fn.jknav = function (callback, name) {
		if (name == null)
			name = 'default';
		if ($.jknav.items[name] == null)
			$.jknav.items[name] = [];
		return this.each(function () {
			$.jknav.items[name].push([this, callback]);
			$.jknav.items[name].sort(function (a, b) {
				var a_top = $(a[0]).offset().top;
				var b_top = $(b[0]).offset().top;
				if (a_top < b_top)
					return -1;
				if (a_top > b_top)
					return 1;
				if (a_top == b_top) {
					var a_left = $(a[0]).offset().left;
					var b_left = $(b[0]).offset().left;
					if (a_left < b_left)
						return -1;
					if (a_left > b_left)
						return 1;
					return 0;
					}
				});
			});
		};

	/**
	 * A helper to do callback
	 * @param {Number} index of the item navgation set
	 * @param {Object} opts Options
	 */
	function do_callback(index, opts) {
		var callback = $.jknav.items[opts.name][index][1];
		if (callback)
			callback($.jknav.items[opts.name][index][0]);
		}

	/**
	 * Calculate the index of next item
	 * @param {Number} offset Indicates move forword or backward
	 * @param {Object} opts Options
	 */
	function calc_index(offset, opts) {
		var index = $.jknav.index[opts.name];
		if (index == null) {
			// Initialize index
			var top = $($.jknav.TARGET).scrollTop();
			$.each($.jknav.items[opts.name], function (idx, item) {
				// Got a strange case: top = 180, item_top = 180.35...
				var item_top = Math.floor($(item).offset().top);
				if (top >= item_top)
					index = idx;
				});
			if (index == null) {
				if (offset > 0)
					index = 0
				else
					index = $.jknav.items[opts.name].length - 1;
				}
			else {
				if (offset > 0 && ++index >= $.jknav.items[opts.name].length)
					index = 0
				else if (offset < 0 && top == Math.floor($($.jknav.items[opts.name][index]).offset().top) && --index < 0)
					index = $.jknav.items[opts.name].length - 1;
				}
			}
		else {
			index += offset;
			if (index >= $.jknav.items[opts.name].length)
				index = 0;
			if (index < 0)
				index = $.jknav.items[opts.name].length - 1;
			}
		$.jknav.index[opts.name] = index;
		return index;
		}
		
	/**
	 * Keyup handler
	 * @param {Event} e jQuery event object
	 * @param {Object} opts Options
	 */
	function keyup(e, opts) {
		if (e.target.tagName.toLowerCase() != $.jknav.TARGET)
			return
		var ch = String.fromCharCode(e.keyCode).toLowerCase();
		if (ch == opts.up.toLowerCase() || ch == opts.down.toLowerCase()) {
			if (opts.reevaluate)
				$.jknav.index[opts.name] = null;
			var index = calc_index((ch == opts.down.toLowerCase()) ? 1 : -1, opts);
			var $item = $($.jknav.items[opts.name][index][0]);
			$($.jknav.TARGET).animate(
				{
					scrollLeft: Math.floor($item.offset().left),
					scrollTop: Math.floor($item.offset().top)
					},
				opts.speed,
				opts.easing,
				function () {
					do_callback(index, opts)
					}
				);
			}
		}

	$.jknav = {
		index: {},
		items: {},
		default_options: {
			up: 'k',
			down: 'j',
			name: 'default',
			easing: 'swing',
			speed: 'normal',
			reevaluate: false
			},
		TARGET: ($.browser.mozilla)?'html':'body',
		/**
		 * Initialization function
		 * @param {Object} options Options
		 */
		init: function (options) {
			var opts = $.extend($.extend({}, $.jknav.default_options), options);
			$.jknav.index[opts.name] = null;
			$($.jknav.TARGET).keyup(function (e) {
				keyup(e, opts);
				});
			}
		};
	})(jQuery);
// vim: ts=2: sw=2
