"use strict";function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}(function(a){'use strict';a.fn.ajaxPager=function(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},c=this;b=a.extend(!0,{totalPages:1,data:{},url:"",method:"GET",field:"page"},b);var d={currentPage:0,isRunning:!1},e=function(a){for(var b=arguments.length,d=Array(1<b?b-1:0),e=1;e<b;e++)d[e-1]=arguments[e];c.trigger.apply(c,["ap.".concat(a)].concat(d))},f=function(){return a.extend(b.data,_defineProperty({},b.field,c.currentPage()))},g=function(){for(var g=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},h=arguments.length,i=Array(1<h?h-1:0),j=1;j<h;j++)i[j-1]=arguments[j];c.hasMore()&&!d.running&&(d.running=!0,e.apply(void 0,["request.before"].concat(i)),a.ajax({method:b.method||"GET",url:b.url,data:f()}).then(function(a,b,c){d.currentPage++,e.apply(void 0,["request.done",a,b,c].concat(i))}).fail(function(a,b,c){e.apply(void 0,["request.catch",a,b,c].concat(i))}).always(function(){d.running=!1,e.apply(void 0,["request.finally"].concat(i))}))};return c.currentPage=function(){return d.currentPage},c.hasMore=function(){return c.currentPage()<b.totalPages},c.loadMore=function(a){for(var b=arguments.length,c=Array(1<b?b-1:0),d=1;d<b;d++)c[d-1]=arguments[d];g.apply(void 0,[a].concat(c))},c.setPage=function(a){return isNaN(a)||(d.currentPage=parseInt(a)),d.currentPage},c.resetPage=function(){return c.setPage(0)},c.updatePayload=function(c){return b.data=a.extend(b.data,c),b.data},c.updateOptions=function(d){var e=c.updatePayload(d.data||{});return b=a.extend(b,d),c.updatePayload(e),b},c.resetPage(),setTimeout(function(){return c.loadMore()},10),c}})(jQuery||window.jQuery);