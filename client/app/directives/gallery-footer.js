app.directive('galleryFooter', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {},
        templateUrl: 'partials/gallery-footer.html',
        controller: 'GalleryFooterCtrl',
        link: function($scope, element) {
            // Show content when all images are loaded
            $scope.$watchCollection('previews', function (n) {
                if (n && n.length) {
                    var imgs = element.find('img');
                    var i = imgs.length;
                    imgs.on('load', function() {
                        i--;
                        if (i === 0) {
                            $scope.footerLoaded = true;
                            $scope.previewScroll.scroll(0);
                            $scope.$digest();
                        }
                    });
                }
            });
            // Pagination
            $scope.previewScroll = {
                plus: false,
                minus: false,
                style: { 'margin-top': 0 },
                scroll: function(d) {
                    var h = element[0].clientHeight,
                        e = element[0].querySelectorAll('.preview-wrap')[0].clientHeight,
                        o = parseInt(this.style['margin-top']),
                        oo = o + ((d === 0) ? 0 : (d > 0 ? (-1 * h) : h));
                    this.minus = (oo < 0);
                    this.plus = h === e ? false : (oo !== -1 * (e - h));
                    this.style['margin-top'] = h === e ? 0 : (oo + 'px');
                }
            };
        }
    };
}]);