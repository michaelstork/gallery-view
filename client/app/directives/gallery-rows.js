app.directive('galleryRows', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {'photos': '=galleryPhotos', 'sort': '=gallerySort'},
        templateUrl: 'partials/gallery-rows.html',
        controller: 'GalleryRowsCtrl',
        link: function($scope, element) {

            $scope.rows = [],
            $scope.rowHeights = [];

            $scope.reflowGallery = function(maxHeight) {

                // Maximum row height in pixels
                // Final image height is adjusted to make things fit, but won't exceed this value
                if (maxHeight === undefined) maxHeight = $scope.zoom * 400;

                var rows = [[]],
                    rowHeights = [],
                    galleryWidth = element[0].clientWidth,
                    borderWidth = 8,
                    rowIndex = 0,
                    rowWidth = 0;

                angular.forEach($scope.photos, function (photo) {
                    // Add photo to row and update row width
                    rows[rowIndex].push(photo);
                    rowWidth += (photo.dimensions.width / photo.dimensions.height) * maxHeight;

                    // Calculate what the height of this row would be if it were as wide as the screen
                    var rowHeight = (maxHeight / rowWidth) * (galleryWidth - (borderWidth * (rows[rowIndex].length + 1)));

                    if (rowHeight <= (maxHeight - borderWidth)) {
                    // If rowHeight does not exceed maxHeight, this row is full enough

                        rowHeights.push(rowHeight + 1);

                        // Reset counters and start a new row
                        rowIndex++;
                        rowWidth = 0;
                        rows[rowIndex] = [];
                    }
                });

                /**
                *  Update each row in place, rather than reassigning the whole array
                *  DOM elements get reused, rather than recreated each time
                */
                if ($scope.rows.length > rows.length) {
                    // Remove rows that are no longer needed
                    $scope.rows.splice(rows.length);
                    $scope.rowHeights.splice(rowHeights.length);
                } else {
                    // Add new rows
                    while (rows.length - $scope.rows.length > 0) {
                        $scope.rows.push([]);
                    }
                }

                for (var i = 0; i < rows.length; i++) {

                    // Empty the row
                    $scope.rows[i].splice(0);

                    /**
                    *  Update row height -
                    *  If last row isn't full, set height = height of the previous row
                    *  If only one row exists and is not full, set height = maxHeight
                    */
                    $scope.rowHeights[i] = rowHeights[i] || rowHeights[i - 1] || maxHeight;

                    // Push new photos to row
                    for (var ii = 0; ii < rows[i].length; ii++) {
                       $scope.rows[i].push(rows[i][ii]);
                    }
                }
            }
        }
    };
}]);