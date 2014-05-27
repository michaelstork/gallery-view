app.controller('GalleryCtrl', ['$scope', '$stateParams', 'galleryViewService', '$location', '$interval', function ($scope, $stateParams, galleryViewService, $location, $interval) {

    init();

    $scope.gallery = {
        title: $stateParams.gallery
    };

    /**
     *  Gallery sorting
     *      terms: thumbnail object properties to sort by
     *      sortGallery: applies a sort by specified property
     *      clearActiveSort: unsets active property of each sort term
     *      reset: resets thumbnail order
     */
    $scope.sort = {
        terms: [
            {term: 'title', label:'Title', active:false, reversed:true},
            {term: 'mtime', label: 'Date', active:false, reversed:true}
        ],
        sortGallery: function(i) {
            var term = this.terms[i].term;
            var reversed = this.terms[i].reversed;
            $scope.gallery.photos.sort(function(a, b) {
                return a[term] < b[term] ? reversed ? 1 : -1 : a[term] > b[term] ? reversed ? -1 : 1 : 0;
            });

            this.clearActiveSort();
            this.terms[i].active = true;
            this.terms[i].reversed = !this.terms[i].reversed;
            // Reflow gallery rows
            $scope.$broadcast('resize');
        },
        clearActiveSort: function() {
            for (var i = 0; i < this.terms.length; i++) { this.terms[i].active = false; }
        },
        reset: function() {
            this.clearActiveSort();
            init(true);
        }
    };

    /**
     *  Slideshow methods
     *       start: Opens the first photo in gallery and calls resume
     *      resume: Starts interval to cycle photo every 2 seconds
     *        stop: Cancels the interval
     */
    $scope.slideshowControls = {
        slideshowInterval: null,
        resume: function() {
            this.stop();

            $scope.$broadcast('slideshowIterate');
            this.slideshowInterval = $interval(function () {
                $scope.$broadcast('slideshowIterate');
            }, 3500);
        },
        stop: function() {
            if (this.slideshowInterval !== null) {
                $interval.cancel(this.slideshowInterval);
                this.slideshowInterval = null;
            }
        },
        start: function() {
            $location.path($scope.gallery.title + '/' + $scope.gallery.photos[0].filename);
            this.resume();
        }
    };

    // Clean up slideshow intervals
    $scope.$on('$destroy', function () {
        $scope.slideshowControls.stop();
    });
    $scope.$on('$stateChangeStart', function (event, state) {
        if (state.name !== 'view') {
            $scope.slideshowControls.stop();
        }
    });

    function init(reset) {
        galleryViewService
            .getGalleryPhotos($stateParams.gallery, reset)
            .then(function(data) {
                $scope.gallery.photos = data;
            }).catch(function(error) {
                console.error(error);
                $location.path('/');
            });
    }

}]);