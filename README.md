# jQuery AJAX paginator ¯\\_(ツ)_/¯

⚠️ Very much a work in progress ⚠️

"A glorified ajax request"

## Quick start

**1.** Include the plugin via jsDelivr CDN 
```html
<script src=“https://cdn.jsdelivr.net/gh/thelevicole/ajax-pager@0.0.1/dist/ajax-pager.js”></script>
```
**2.** Attach to an element
```javascript
const $gallery = $( '.gallery' ).ajaxPager( {
    url: 'https://example.com/api/gallery',
    totalPages: 10,
    data: { /* ..additional data to send with request.. */ }
} );
```
**3.** Rig the DOM
```html
<div class="gallery"></div>
<button id="load">Load more</button>
```

```javascript
$( '#load' ).on( 'click', function() {
    $gallery.loadMore();
} );

$gallery.on( 'ap-request_successful', function( data ) {
    $gallery.append( data.html );
} );
```