app.controller('BaseCtrl', ['$scope', 'photoFrameService', function ($scope, photoFrameService) {

    setMainHeight();

    $scope.pageTitle = 'Gallery-View';
    $scope.fullscreen = false;

    $scope.$on('resize', setMainHeight);
    $scope.$on('$stateChangeStart', function (event, state, params) {
        $scope.fullscreen = params.photo === undefined ? false : true;
        $scope.pageTitle = params.gallery ? params.gallery + (params.photo ? ' - ' + params.photo : '') : 'Gallery-View';
    });

    function setMainHeight() {
        $scope.mainHeight = photoFrameService.dimensions[1] + 'px';
    }

}]);