# jQuery AJAX paginator ¯\\_(ツ)_/¯

⚠️ Very much a work in progress ⚠️

"A glorified ajax request"

## Quick start

**1.** Download and include the plugin 
```html
<script src=“ajax-pager.js”></script>
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

$galler.on( 'ap-request_successful', function( data ) {
    $gallery.append( data.html );
} );
```