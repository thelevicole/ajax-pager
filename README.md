# jQuery AJAX paginator ¯\\_(ツ)_/¯

Easily rig a custom DOM for ajax pagination requests.

> ⚠️ This project is very much a work in progress and should not be used in production.

## Quick start

**1.** Include the plugin via jsDelivr CDN 
```html
<script src=“https://cdn.jsdelivr.net/gh/thelevicole/ajax-pager@1.0.2/dist/ajax-pager.js”></script>
```
**2.** Attach to an element
```javascript
const $gallery = $( '#gallery' ).ajaxPager( {
    url: 'https://example.com/api/gallery',
    totalPages: 10,
    data: { /* ..additional data to send with request.. */ }
} );
```
**3.** Rig the DOM
```html
<div id="gallery"></div>
<button id="load">Load more</button>
```

```javascript
$( '#load' ).on( 'click', function() {
    $gallery.loadMore();
} );

$gallery.on( 'ap.request.done', function( event, response ) {
    $gallery.append( response.html );
} );
```