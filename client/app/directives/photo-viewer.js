app.directive('photoViewer', ['galleryViewService', '$stateParams', '$document', '$location', '$timeout', function (galleryViewService, $stateParams, $document, $location, $timeout) {
    return {
        restrict:'A',
        scope:{'slideshowControls' : '='},
        replace:true,
        templateUrl:'partials/view.html',
        controller: 'PhotoViewerCtrl',
        link: function link($scope, element) {

            /**
             *  DOM event bindings
             */
            Hammer(element[0]).on('drag', function (ev) {
                ev.preventDefault();
                if (!ev.gesture) { return; }
                if (ev.gesture.deltaX >= 125) {
                    $scope.changePhoto(-1);
                } else if (ev.gesture.deltaX <= -125) {
                    $scope.changePhoto(1);
                }
                $scope.$apply();
            });

            $scope.keyHandler = keyHandler.bind(null, $scope);
            $document.on('keydown', $scope.keyHandler);

            // Click on background closes photo
            element.on('click', backToGallery);

            // Resize and fade in photo when loaded
            element.find('img').on('load', function () {
                $scope.photoLoaded = true;
                $scope.$digest();
            }).on('error', function () {
                backToGallery();
            }).on('click', function (e) {
            // prevent close when clicking photo
                e.stopPropagation();
            });

            $scope.$on('$destroy', function () {
            // clean up keybinding
                $document.off('keydown', $scope.keyHandler);
            });

            // Next/Previous arrows
            Array.prototype.slice.call(element[0].querySelectorAll('.nav')).forEach(function (el, i) {
                el.addEventListener('click', function (e) {
                    e.stopPropagation();
                    $scope.slideshowControls.stop();
                    $scope.$apply(function() {
                        $scope.changePhoto(i === 0 ? -1 : 1);
                    });
                });
            });
        }
    };

    /**
     *  Misc functions
     *      keyHandler: handler for left/right keys, a/d keys, escape and enter
     *      backToGallery: closes the photo-viewer
     */
    function keyHandler($scope, e) {
        var key = e.which || e.keyCode,
            modifiers = (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey);
        if (!modifiers && [65, 68, 37, 39, 13, 27].indexOf(key) >= 0) {
            $scope.slideshowControls.stop();
            if (key === 27) {
                backToGallery();
            } else {
                $scope.$apply(function () {
                    $scope.changePhoto(key === 68 || key === 39 || key === 13 ? 1 : -1);
                });
            }
        }
    }
    function backToGallery() {
        $timeout(function () {
            $location.path($stateParams.gallery);
        });
    }

}]);