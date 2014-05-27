app.directive('galleryThumbnail', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        replace: true,
        scope: {'photo': '=galleryThumbnail', 'rowHeight' : '@'},
        templateUrl: 'partials/thumbnail.html',
        link: function($scope, element) {

            $scope.thumbnailLoaded = false;

            $scope.imgStyle = {
                height: $scope.rowHeight + 'px'
            };

            var img = element.find('img')[0];

            img.addEventListener('load', function() {
                $scope.thumbnailLoaded = true;
                $scope.$emit('thumbnailLoaded');
                $scope.$digest();
            }, false);

            $scope.$watch('rowHeight', function (n, o) {
                if (n && n !== o)  $scope.imgStyle.height = n + 'px';
            });

        }

    };
    
}]);