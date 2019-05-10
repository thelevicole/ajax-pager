/**
 * Simple jQuery plugin for handling ajax paging v1.0.0
 *
 * Copyright (c) 2018 Levi Cole <me@thelevicole.com>
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
( function( $ ) {
	'use strict';

	$.fn.ajaxPager = function( options = {} ) {
		let self = this;

		/**
		 * Merge user settings with defaults
		 * 
		 * @type {Object}
		 */
		options = $.extend( true, {
			totalPages: 1,		// At what point should we stop loading more
			data: {}, 			// Data to send with the request
			url: '',			// Request uri
			method: 'GET',		// Request type, get/post..etc
			field: 'page'		// The name of the variable sent with the request
		}, options );

		/**
		 * Internal global variable trackers
		 * 
		 * @type {Object}
		 */
		let trackers = {
			currentPage: 0,
			isRunning: false
		};

		/* Private functions
		-------------------------------------------------------- */

		/**
		 * Trigger an event on the element
		 *
		 * @param	{String}	name		Name will be prefixed
		 * @param	{Mixed}		...data		Arguments will be passed on the event
		 * @return	{Void}
		 */
		const trigger = ( name, ...args ) => {
			self.trigger( `ap.${name}`, ...args );
		};

		/**
		 * Merge plugin data with data passed in options
		 *
		 * @return	{Object}
		 */
		const payload = () => {
			return $.extend( options.data, {
				[ options.field ]: self.currentPage()
			} );
		};

		/**
		 * Handle the ajax request to the server
		 *
		 * @return {Void}
		 */
		const sendRequest = ( data = {}, ...args ) => {
			// Check if we have more pages to load
			if ( self.hasMore() ) {

				// If request is not already running
				if ( !trackers.running ) {

					// Set running tracker
					trackers.running = true;

					// Send event
					trigger( 'request.before', ...args );

					// Make request
					$.ajax( {
						method: options.method || 'GET',
						url: options.url,
						data: payload()
					} )

					// If request was successful
					.then( function( data, textStatus, jqXHR ) {
						trackers.currentPage++;
						trigger( 'request.done', data, textStatus, jqXHR, ...args );
					} )

					// If request failed
					.fail( function( jqXHR, textStatus, errorThrown ) {
						trigger( 'request.catch', jqXHR, textStatus, errorThrown, ...args );
					} )

					// Always run
					.always( function() {
						trackers.running = false;
						trigger( 'request.finally', ...args );
					} );
				}
			}
		};

		/* Public functions
		-------------------------------------------------------- */

		/**
		 * Return the current page
		 *
		 * @return	{Integer}
		 */
		self.currentPage = function() {
			return trackers.currentPage;
		};

		/**
		 * Check if there are any more pages to load
		 *
		 * @return {Boolean}
		 */
		self.hasMore = function() {
			return self.currentPage() < options.totalPages;
		};

		/**
		 * Send the ajax request
		 *
		 * @return	{Void}
		 */
		self.loadMore = function( data, ...args ) {
			sendRequest( data, ...args );
		};

		/**
		 * Manually override the current page count
		 *
		 * @param	{Integer}	page
		 * @return	{Integer}			The current page number
		 */
		self.setPage = function( page ) {
			if ( !isNaN( page ) ) {
				trackers.currentPage = parseInt( page );
			}
			return trackers.currentPage;
		};

		/**
		 * Reset the internal page counter. Alias of `setPage( 0 )`
		 *
		 * @return	{Integer}	Returns the page number ( 0 )
		 */
		self.resetPage = function() {
			return self.setPage( 0 );
		};

		/**
		 * Update the initial post data
		 *
		 * @param	{Object}	_data
		 * @return	{Object}
		 */
		self.updatePayload = function( _data ) {
			options.data = $.extend( options.data, _data );
			return options.data;
		};

		/**
		 * Update the initial options
		 *
		 * @param	{Object}	_options
		 * @return	{Object}
		 */
		self.updateOptions = function( _options ) {
			// Preserve and update payload
			const data = self.updatePayload( _options.data || {} );

			// Update opitons
			options = $.extend( options, _options );

			// Restore preserved payload
			self.updatePayload( data );

			return options;
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

} )( jQuery || window.jQuery );
