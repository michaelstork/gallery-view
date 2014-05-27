app.controller('PhotoViewerCtrl', ['$scope', 'galleryViewService', '$stateParams', '$location', '$timeout', function ($scope, galleryViewService, $stateParams, $location, $timeout) {

    var ext = /\.(jpg|JPG)$/,
        photoTitle = $stateParams.photo.replace(ext, '');


    $scope.photoLoaded = false;
    $scope.photo = {
        title: photoTitle,
        uri: galleryViewService.getPhotoURI($stateParams.gallery, $stateParams.photo)
    };

    $scope.changePhoto = function(offset) {
        var filename = galleryViewService.getNextPhotoFilename($stateParams.gallery, $stateParams.photo, offset);
        $location.path($stateParams.gallery + '/' + filename);
    }

    /**
     *  Scope event bindings:
     *    resize: Broadcast from $rootScope by galleryViewService when window is resized
     *    slideshowIterate: Broadcast from GalleryCtrl on slideshow interval
     */
    $scope.$on('resize', function () {
        $scope.photo.uri = galleryViewService.getPhotoURI($stateParams.gallery, $stateParams.photo);
    });
    $scope.$on('slideshowIterate', function () {
        $scope.changePhoto(1);
    });

}]);