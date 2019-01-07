/**
 * Simple jQuery plugin for handling ajax paging v0.0.1
 * 
 * Copyright (c) 2018 Levi Cole <me@thelevicole.com>
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
(function($) {
	'use strict';

	$.fn.ajaxPager = function( options ) {
		const self = this;

		let current_page = 0;

		/**
		 * Merge user settings with defaults
		 * @type	{object}
		 */
		options = $.extend( true, {
			data: {}, // Data to send with the request
			url: '', // Request uri
			totalPages: 0, // At what point should we stop loading more
		}, options );

		/**
		 * Trigger an event on the element
		 *
		 * @param	{string}	event_name	Name will be prefixed
		 * @param	{mixed}		data...		Arguments will be passed on the event
		 * @return	{void}
		 */
		const trigger = ( event_name, ...args ) => {
			self.trigger( `ap-${event_name}`, ...args );
		};

		/**
		 * Merge plugin data with data passed in options
		 *
		 * @return	{object}
		 */
		const data_to_send = () => {
			return $.extend( options.data, {
				current_page: self.currentPage()
			} );
		};

		/**
		 * Handle the ajax request to the server
		 *
		 * @return {void}
		 */
		const send_request = () => {

			if ( self.hasMore() ) {

				trigger( 'before_request' );

				$.ajax( {
					method: 'POST',
					url: options.url,
					data: data_to_send()
				} ).then( function( data, textStatus, jqXHR ) {

					current_page++;
					trigger( 'request_successful', data, textStatus, jqXHR );

				}, function( jqXHR, textStatus, errorThrown ) {

					trigger( 'request_failed', jqXHR, textStatus, errorThrown );

				} ).always( function() {

					trigger( 'after_request' );

				} );

			}
		};

		/* Public functions
		-------------------------------------------------------- */

		/**
		 * Trigger the ajax request
		 *
		 * @return	{void}
		 */
		self.loadMore = function() {
			send_request();
		};

		/**
		 * Check if there are any more pages to load
		 *
		 * @return {boolean}
		 */
		self.hasMore = function() {
			return self.currentPage() < options.totalPages;
		};

		/**
		 * Return the current page
		 *
		 * @return	{integer}
		 */
		self.currentPage = function() {
			return current_page;
		};

		/* On initialize
		-------------------------------------------------------- */
		// Todo - fix initial trigger event
		// ================================
		// The initial `before_request` event is not triggered because
		// it is sent before returning `self`.
		// A quick fix has been applied by delaying the init function
		// by 10ms.
		setTimeout( () => self.loadMore(), 10 );

		return self;
	};
	
})(jQuery || window.jQuery);