app.controller('GalleryFooterCtrl', ['$scope', 'galleryViewService', '$timeout', '$stateParams', function ($scope, galleryViewService, $timeout, $stateParams) {

    $scope.footerLoaded = false;
    $scope.previews = [];

    // Lazy load preview images from each gallery and randomly choose which to display
    $scope.numPreviews = 3;
    $scope.activePreview = Math.floor(Math.random() * $scope.numPreviews);

    var lazyPreviewsPromise = $timeout(function () {

       galleryViewService.getGalleryPreviews($scope.numPreviews).then(function (data) {

           for (var i = 0; i < data.length; i++) {

               if (data[i].length) {
                   // skip current gallery
                   if (data[i][0].gallery === $stateParams.gallery) { continue; }
                   $scope.previews.push(data[i]);
               }
           }

           lazyPreviewsPromise = null;
       });

    }, 1000);

    $scope.$on('$destroy', function () {
       if (lazyPreviewsPromise !== null) { $timeout.cancel(lazyPreviewsPromise); }
    });
}]);