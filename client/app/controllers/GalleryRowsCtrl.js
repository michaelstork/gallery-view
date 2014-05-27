app.controller('GalleryRowsCtrl', ['$scope', function ($scope) {

    $scope.galleryLoaded = false;
    $scope.hideLoader    = false;
    $scope.zoom = $scope.defaultZoom = 0.7;

    // Reflow gallery once data is loaded into scope, and whenever zoom changes
    $scope.$watchCollection('[photos, zoom]', function (n) {
        if (n[0] && n[0].length) {
            $scope.hideLoader = true;
            $scope.reflowGallery();
        }
    });

    // Reflow gallery when window is resized - event broadcast from galleryViewService
    $scope.$on('resize', function (event, direction) {
        if (direction !== 'vertical') $scope.reflowGallery();
    });

    // Fade in ui when all thumbnails have loaded
    var thumbnailsLoaded = 0;
    $scope.$on('thumbnailLoaded', function () {
        thumbnailsLoaded++;
        if (thumbnailsLoaded === $scope.photos.length) {
            $scope.galleryLoaded = true;
            $scope.$digest();
        }
    });

}]);