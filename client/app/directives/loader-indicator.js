app.directive('loaderIndicator', ['$timeout', function ($timeout) {
    return {
        restrict:'A',
        replace:true,
        scope:{ 'loader': '=loaderIndicator'},
        templateUrl:'partials/loader.html',
        link: function($scope, element) {
            // Show indicator after 200ms
            var showLoader = $timeout(function () { element[0].style.display = 'block'; }, 200);
            // Hide it when loader value changes
            $scope.$watch('loader', function (n) {
                if (n) {
                    element[0].style.display = 'none';
                    $timeout.cancel(showLoader);
                }
            });

            $scope.$on('$destroy', function () {
                $timeout.cancel(showLoader);
            });
        }
    };
}]);