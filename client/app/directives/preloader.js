app.directive('preloader', ['galleryViewService', '$timeout', '$stateParams', function (galleryViewService, $timeout, $stateParams) {
    return {
        restrict:'A',
        replace:true,
        scope:{},
        template:'<img ng-src="{{ uri }}" class="preloader" />',
        controller: ['$scope', function ($scope) {

            $scope.uri = null;

            var loaded = [],
                lazyTimer = null;

            $scope.$on('$stateChangeSuccess', function (event, state) {
                if (state.name === 'view' || state.name === 'gallery') {
                   preload();
                }
            });

            $scope.$on('$destroy', function () {
                if (lazyTimer) { $timeout.destroy(lazyTimer); }
            });

            function preload() {

                if ($stateParams.photo) {
                    // When in photo state, preload next photo and add current photo to loaded array

                    var i = 1;

                    while (i >= 0) {

                        var uri = galleryViewService.getPhotoURI($stateParams.gallery, $stateParams.photo, i);

                        if (uri && loaded.indexOf(uri) === -1) {
                            loaded.push(uri);
                            if (i > 0) $scope.uri = uri;
                        }

                        i--;
                    }

                } else {
                    // When in gallery state, lazy load the first photo so slideshow starts smoothly

                    lazyTimer = $timeout(function () {

                        lazyTimer = null;
                        galleryViewService.getGalleryPhotos($stateParams.gallery).then(function (data) {

                            var uri = galleryViewService.getPhotoURI($stateParams.gallery, data[0].filename, 0);

                            if (uri && loaded.indexOf(uri) === -1) {
                                $scope.uri = uri;
                                loaded.push(uri);
                            }

                        });

                    }, 500);

                }

            }

        }],
        link: function($scope, element) {
            element.on('load', function() {
                console.log('preloading ' + element[0].src);
            });
            element.on('error', function () {
                console.error('error preloading image ' + $scope.uri);
            });

        }
    };
}]);