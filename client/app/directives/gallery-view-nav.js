app.directive('galleryViewNavMenu', [function () {
    return {
        restrict:'A',
        scope:{galleries: '=galleryViewNavMenu'},
        templateUrl:'partials/gallery-view-nav.html',
        controller: ['$scope', function($scope) {
            // Split menu into 250px columns if more than 5 items
            var n = Math.ceil($scope.galleries.length / 5);
            if (n > 0) {
                $scope.menuStyle = {
                    minWidth: 250 * n + 'px',
                    columnCount: n,
                    '-webkit-column-count': n,
                    '-moz-column-count': n
                };
            }

        }]
    };
}]);