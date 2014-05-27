"use strict";var app=angular.module("galleryView",["ui.router"]);app.config(["$stateProvider","$urlRouterProvider",function(e,t){t.otherwise("/MStork Photos");var o={view:{template:'<div gallery-view-nav-menu="galleries" class="gallery-view-nav-menu"></div>',controller:["$scope","galleryTitlesData",function(e,t){e.galleries=t.data}]},resolve:{galleryTitlesData:["galleryViewService",function(e){return e.galleryTitlesPromise}]}};e.state("gallery",{url:"/{gallery:[^/]+/?}",views:{main:{templateUrl:"partials/gallery.html",controller:"GalleryCtrl"},nav:o.view,footer:{template:"<div gallery-footer></div>"}},resolve:o.resolve}).state("view",{parent:"gallery",url:"/{photo:[^/]+/?}",template:'<div photo-viewer slideshow-controls="slideshowControls"></div>'})}]),app.constant("galleryViewAPI","http://localhost/gallery-view-api/"),app.controller("BaseCtrl",["$scope","photoFrameService",function(e,t){function o(){e.mainHeight=t.dimensions[1]+"px"}o(),e.pageTitle="Gallery-View",e.fullscreen=!1,e.$on("resize",o),e.$on("$stateChangeStart",function(t,o,r){e.fullscreen=void 0===r.photo?!1:!0,e.pageTitle=r.gallery?r.gallery+(r.photo?" - "+r.photo:""):"Gallery-View"})}]),app.controller("GalleryCtrl",["$scope","$stateParams","galleryViewService","$location","$interval",function(e,t,o,r,n){function l(n){o.getGalleryPhotos(t.gallery,n).then(function(t){e.gallery.photos=t}).catch(function(e){console.error(e),r.path("/")})}l(),e.gallery={title:t.gallery},e.sort={terms:[{term:"title",label:"Title",active:!1,reversed:!0},{term:"mtime",label:"Date",active:!1,reversed:!0}],sortGallery:function(t){var o=this.terms[t].term,r=this.terms[t].reversed;e.gallery.photos.sort(function(e,t){return e[o]<t[o]?r?1:-1:e[o]>t[o]?r?-1:1:0}),this.clearActiveSort(),this.terms[t].active=!0,this.terms[t].reversed=!this.terms[t].reversed,e.$broadcast("resize")},clearActiveSort:function(){for(var e=0;e<this.terms.length;e++)this.terms[e].active=!1},reset:function(){this.clearActiveSort(),l(!0)}},e.slideshowControls={slideshowInterval:null,resume:function(){this.stop(),e.$broadcast("slideshowIterate"),this.slideshowInterval=n(function(){e.$broadcast("slideshowIterate")},3500)},stop:function(){null!==this.slideshowInterval&&(n.cancel(this.slideshowInterval),this.slideshowInterval=null)},start:function(){r.path(e.gallery.title+"/"+e.gallery.photos[0].filename),this.resume()}},e.$on("$destroy",function(){e.slideshowControls.stop()}),e.$on("$stateChangeStart",function(t,o){"view"!==o.name&&e.slideshowControls.stop()})}]),app.controller("GalleryFooterCtrl",["$scope","galleryViewService","$timeout","$stateParams",function(e,t,o,r){e.footerLoaded=!1,e.previews=[],e.numPreviews=3,e.activePreview=Math.floor(Math.random()*e.numPreviews);var n=o(function(){t.getGalleryPreviews(e.numPreviews).then(function(t){for(var o=0;o<t.length;o++)if(t[o].length){if(t[o][0].gallery===r.gallery)continue;e.previews.push(t[o])}n=null})},1e3);e.$on("$destroy",function(){null!==n&&o.cancel(n)})}]),app.controller("GalleryRowsCtrl",["$scope",function(e){e.galleryLoaded=!1,e.hideLoader=!1,e.zoom=e.defaultZoom=.7,e.$watchCollection("[photos, zoom]",function(t){t[0]&&t[0].length&&(e.hideLoader=!0,e.reflowGallery())}),e.$on("resize",function(t,o){"vertical"!==o&&e.reflowGallery()});var t=0;e.$on("thumbnailLoaded",function(){t++,t===e.photos.length&&(e.galleryLoaded=!0,e.$digest())})}]),app.controller("PhotoViewerCtrl",["$scope","galleryViewService","$stateParams","$location","$timeout",function(e,t,o,r){var n=/\.(jpg|JPG)$/,l=o.photo.replace(n,"");e.photoLoaded=!1,e.photo={title:l,uri:t.getPhotoURI(o.gallery,o.photo)},e.changePhoto=function(e){var n=t.getNextPhotoFilename(o.gallery,o.photo,e);r.path(o.gallery+"/"+n)},e.$on("resize",function(){e.photo.uri=t.getPhotoURI(o.gallery,o.photo)}),e.$on("slideshowIterate",function(){e.changePhoto(1)})}]),app.directive("galleryFooter",[function(){return{restrict:"A",replace:!0,scope:{},templateUrl:"partials/gallery-footer.html",controller:"GalleryFooterCtrl",link:function(e,t){e.$watchCollection("previews",function(o){if(o&&o.length){var r=t.find("img"),n=r.length;r.on("load",function(){n--,0===n&&(e.footerLoaded=!0,e.previewScroll.scroll(0),e.$digest())})}}),e.previewScroll={plus:!1,minus:!1,style:{"margin-top":0},scroll:function(e){var o=t[0].clientHeight,r=t[0].querySelectorAll(".preview-wrap")[0].clientHeight,n=parseInt(this.style["margin-top"]),l=n+(0===e?0:e>0?-1*o:o);this.minus=0>l,this.plus=o===r?!1:l!==-1*(r-o),this.style["margin-top"]=o===r?0:l+"px"}}}}}]),app.directive("galleryRows",[function(){return{restrict:"A",replace:!0,scope:{photos:"=galleryPhotos",sort:"=gallerySort"},templateUrl:"partials/gallery-rows.html",controller:"GalleryRowsCtrl",link:function(e,t){e.rows=[],e.rowHeights=[],e.reflowGallery=function(o){void 0===o&&(o=400*e.zoom);var r=[[]],n=[],l=t[0].clientWidth,i=8,a=0,s=0;if(angular.forEach(e.photos,function(e){r[a].push(e),s+=e.dimensions.width/e.dimensions.height*o;var t=o/s*(l-i*(r[a].length+1));o-i>=t&&(n.push(t+1),a++,s=0,r[a]=[])}),e.rows.length>r.length)e.rows.splice(r.length),e.rowHeights.splice(n.length);else for(;r.length-e.rows.length>0;)e.rows.push([]);for(var c=0;c<r.length;c++){e.rows[c].splice(0),e.rowHeights[c]=n[c]||n[c-1]||o;for(var u=0;u<r[c].length;u++)e.rows[c].push(r[c][u])}}}}}]),app.directive("galleryThumbnail",["$timeout",function(){return{restrict:"A",replace:!0,scope:{photo:"=galleryThumbnail",rowHeight:"@"},templateUrl:"partials/thumbnail.html",link:function(e,t){e.thumbnailLoaded=!1,e.imgStyle={height:e.rowHeight+"px"};var o=t.find("img")[0];o.addEventListener("load",function(){e.thumbnailLoaded=!0,e.$emit("thumbnailLoaded"),e.$digest()},!1),e.$watch("rowHeight",function(t,o){t&&t!==o&&(e.imgStyle.height=t+"px")})}}}]),app.directive("galleryViewNavMenu",[function(){return{restrict:"A",scope:{galleries:"=galleryViewNavMenu"},templateUrl:"partials/gallery-view-nav.html",controller:["$scope",function(e){var t=Math.ceil(e.galleries.length/5);t>0&&(e.menuStyle={minWidth:250*t+"px",columnCount:t,"-webkit-column-count":t,"-moz-column-count":t})}]}}]),app.directive("hoverTimer",["$timeout",function(e){return{restrict:"A",link:function(t,o,r){var n=null,l=r.hoverClass,i=r.hoverTimer;o[0].addEventListener("mouseenter",function(){o.addClass(l),null!==n&&e.cancel(n)},!1),o[0].addEventListener("mouseleave",function(){n=e(function(){o.removeClass(l),n=null},parseInt(i))},!1),o[0].addEventListener("touchend",function(){o.toggleClass(l)},!1),t.$on("$destroy",function(){null!==n&&e.cancel(n)})}}}]),app.directive("loaderIndicator",["$timeout",function(e){return{restrict:"A",replace:!0,scope:{loader:"=loaderIndicator"},templateUrl:"partials/loader.html",link:function(t,o){var r=e(function(){o[0].style.display="block"},200);t.$watch("loader",function(t){t&&(o[0].style.display="none",e.cancel(r))}),t.$on("$destroy",function(){e.cancel(r)})}}}]),app.directive("photoViewer",["galleryViewService","$stateParams","$document","$location","$timeout",function(e,t,o,r,n){function l(e,t){var o=t.which||t.keyCode,r=t.altKey||t.shiftKey||t.ctrlKey||t.metaKey;!r&&[65,68,37,39,13,27].indexOf(o)>=0&&(e.slideshowControls.stop(),27===o?i():e.$apply(function(){e.changePhoto(68===o||39===o||13===o?1:-1)}))}function i(){n(function(){r.path(t.gallery)})}return{restrict:"A",scope:{slideshowControls:"="},replace:!0,templateUrl:"partials/view.html",controller:"PhotoViewerCtrl",link:function(e,t){Hammer(t[0]).on("drag",function(t){t.preventDefault(),t.gesture&&(t.gesture.deltaX>=125?e.changePhoto(-1):t.gesture.deltaX<=-125&&e.changePhoto(1),e.$apply())}),e.keyHandler=l.bind(null,e),o.on("keydown",e.keyHandler),t.on("click",i),t.find("img").on("load",function(){e.photoLoaded=!0,e.$digest()}).on("error",function(){i()}).on("click",function(e){e.stopPropagation()}),e.$on("$destroy",function(){o.off("keydown",e.keyHandler)}),Array.prototype.slice.call(t[0].querySelectorAll(".nav")).forEach(function(t,o){t.addEventListener("click",function(t){t.stopPropagation(),e.slideshowControls.stop(),e.$apply(function(){e.changePhoto(0===o?-1:1)})})})}}}]),app.directive("preloader",["galleryViewService","$timeout","$stateParams",function(e,t,o){return{restrict:"A",replace:!0,scope:{},template:'<img ng-src="{{ uri }}" class="preloader" />',controller:["$scope",function(r){function n(){if(o.photo)for(var n=1;n>=0;){var a=e.getPhotoURI(o.gallery,o.photo,n);a&&-1===l.indexOf(a)&&(l.push(a),n>0&&(r.uri=a)),n--}else i=t(function(){i=null,e.getGalleryPhotos(o.gallery).then(function(t){var n=e.getPhotoURI(o.gallery,t[0].filename,0);n&&-1===l.indexOf(n)&&(r.uri=n,l.push(n))})},500)}r.uri=null;var l=[],i=null;r.$on("$stateChangeSuccess",function(e,t){("view"===t.name||"gallery"===t.name)&&n()}),r.$on("$destroy",function(){i&&t.destroy(i)})}],link:function(e,t){t.on("load",function(){console.log("preloading "+t[0].src)}),t.on("error",function(){console.error("error preloading image "+e.uri)})}}}]),app.filter("currentGalleryFirst",["$stateParams",function(e){return function(t){var o=t.indexOf(e.gallery);return o>=0&&(t.splice(o,1),t.unshift(e.gallery)),t}}]),app.service("galleryViewService",["$http","$q","galleryViewAPI","photoFrameService","$window","$timeout","$rootScope",function(e,t,o,r){var n,l={};this.galleryTitlesPromise=e({url:o+"galleries",method:"GET",headers:{"Content-Type":"application/json"}}).error(function(e){console.log(e)}),this.getGalleryPhotos=function(r,n){var i=t.defer();return n||void 0===l[r]?e({url:o+r,method:"GET"}).success(function(e){l[r]=e,i.resolve(e)}).error(function(e){i.reject(e)}):i.resolve(l[r]),i.promise},this.getGalleryPreviews=function(r){var l=t.defer();return void 0===n?e({url:o+"previews"+(r?"/"+r:""),method:"GET"}).success(function(e){n=e,l.resolve(e)}).error(function(e){l.reject(e)}):l.resolve(n),l.promise},this.getNextPhotoFilename=function(e,t,o){if(void 0===l[e])return!1;for(var r,n=l[e],i=0;i<n.length;i++)if(n[i].filename===t){r=i+o;break}var a=0>r?n.length+r:r>=n.length?r-n.length:r;return n[a]?n[a].filename:!1},this.getPhotoURI=function(e,t,n){return n&&(t=this.getNextPhotoFilename(e,t,n)),t?[o+e,t,r.dimensions.join("x")].join("/"):!1}}]),app.service("photoFrameService",["$window","$timeout","$rootScope",function(e,t,o){var r={dimensions:null,resizing:null,updateDimensions:function(){var e,t,o=window.innerWidth||document.documentElement.clientWidth||document.getElementsByTagName("body")[0].clientWidth,r=window.innerHeight||document.documentElement.clientHeight||document.getElementsByTagName("body")[0].clientHeight;return null!==this.dimensions&&(e=[this.dimensions[0]-o,this.dimensions[1]-r],t=e[0]?e[1]?"both":"horizontal":e[1]?"vertical":"none"),this.dimensions=[Math.round(.94*o)-16,Math.round(.92*r)-16],t},resizeHandler:function(){this.resizing&&t.cancel(this.resizing),this.resizing=t(function(){r.resizing=null,o.$broadcast("resize",r.updateDimensions())},200)}};return r.updateDimensions(),angular.element(e).on("resize",r.resizeHandler.bind(r)),r}]);