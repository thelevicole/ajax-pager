/**
 * Simple jQuery plugin for handling ajax paging v0.3.3
 *
 * Copyright (c) 2018 Levi Cole <me@thelevicole.com>
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
(function($) {
	'use strict';

	$.fn.ajaxPager = function( options ) {
		const self = this;

		/**
		 * Track current page number
		 * @type {Number}
		 */
		let current_page = 0;

		/**
		 * Check if request has already been made
		 * @type {Boolean}
		 */
		let running = false;

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
		const send_request = ( ...args ) => {

			if ( self.hasMore() ) {

				if ( !running ) {
					running = true;

					trigger( 'before_request', ...args );

					$.ajax( {
						method: 'POST',
						url: options.url,
						data: data_to_send()
					} ).then( function( data, textStatus, jqXHR ) {

						current_page++;
						trigger( 'request_successful', data, textStatus, jqXHR, ...args );

					}, function( jqXHR, textStatus, errorThrown ) {

						trigger( 'request_failed', jqXHR, textStatus, errorThrown, ...args );

					} ).always( function() {

						running = false;

						trigger( 'after_request', ...args );

					} );
				}

			}
		};

		/* Public functions
		-------------------------------------------------------- */

		/**
		 * Trigger the ajax request
		 *
		 * @return	{void}
		 */
		self.loadMore = function( ...args ) {
			send_request( ...args );
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

		/**
		 * Reset the counter
		 *
		 * @return	{integer}	Returns the page number ( 0 )
		 */
		self.resetPage = function() {
			return self.setPage( 0 );
		};

		/**
		 * Manually override the current page count
		 *
		 * @param	{integer}	page
		 * @return	{integer}			The current page number
		 */
		self.setPage = function( page ) {
			if ( !isNaN( page ) ) {
				current_page = parseInt( page );
			}
			return current_page;
		};

		/**
		 * Update the initial post data
		 *
		 * @param	{object}	updated
		 * @return	{void}
		 */
		self.updatePayload = function( updated ) {
			options.data = $.extend( options.data, updated );
		};

		/**
		 * Update the initial options
		 *
		 * @param	{object}	updated
		 * @return	{void}
		 */
		self.updateOptions = function( updated ) {
			// Preserve payload
			const data = options.data;

			// Update opitons
			options = $.extend( options, updated );

			// Restore preserved payload
			self.updatePayload( data );
		};

		/* On initialize
		-------------------------------------------------------- */
		self.resetPage();

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
