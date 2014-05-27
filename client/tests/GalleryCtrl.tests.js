describe('GalleryCtrl', function () {

    beforeEach(module('galleryView'));

    var $scope, $rootScope, createController, mockGalleryViewService, $location, $interval, mockStateParams;

    var galleryReturnData = {'the gallery': [{
        "gallery":"the gallery",
        "title":"PhotoTitle1",
        "filename":"PhotoTitle1.jpg",
        "src":"http://photo1src.jpg",
        "dimensions":{"width":1000,"height":1000},
        "mtime":0
    },
    {
        "gallery":"the gallery",
        "title":"PhotoTitle2",
        "filename":"PhotoTitle2.jpg",
        "src":"http://photo2src.jpg",
        "dimensions":{"width":1000,"height":1000},
        "mtime":1
    }]};

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        var $q = $injector.get('$q');
        var $location = $injector.get('$location');
        var $interval = $injector.get('$interval');

        spyOn($rootScope, '$broadcast').andCallThrough();

        mockGalleryViewService = {
            getDimensions: function() {
                return [1000, 1000];
            },
            getGalleryPhotos: function(gallery) {
                var deferred = $q.defer();
                deferred.resolve(galleryReturnData[gallery]);
                return deferred.promise;
            }
        };
        mockStateParams = {
            gallery: 'the gallery'
        };
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('GalleryCtrl', {
                '$scope': $scope,
                '$stateParams': mockStateParams,
                'galleryViewService': mockGalleryViewService,
                '$location': $location,
                '$interval': $interval
            });
        };
    }));

    it('should initialize the title prop', function () {
        var controller = createController();
        expect($scope.gallery.title).toEqual('the gallery');
    });

    it('should get the right photos from galleryViewService', function () {
        var controller = createController();
        $scope.$apply();
        expect($scope.gallery.photos).toEqual(galleryReturnData['the gallery']);
    });

    it('should have a slideshowControls object with the proper methods', function () {
        var controller = createController();
        expect($scope.slideshowControls).toBeDefined();
        expect(angular.isFunction($scope.slideshowControls.resume)).toBeTruthy();
        expect(angular.isFunction($scope.slideshowControls.stop)).toBeTruthy();
        expect(angular.isFunction($scope.slideshowControls.start)).toBeTruthy();
        expect($scope.slideshowControls.slideshowInterval).toBe(null);
    });

    it('should set an $interval when slideshow is started', function () {
        var controller = createController();
        $scope.$apply();
        $scope.slideshowControls.start();
        expect($scope.slideshowControls.slideshowInterval).not.toBe(null);
    });

    it('should cancel the interval when slideshow is stopped', function () {
        var controller = createController();
        $scope.$apply();
        $scope.slideshowControls.start();
        expect($scope.slideshowControls.slideshowInterval).not.toBe(null);
        $scope.slideshowControls.stop(); 
        expect($scope.slideshowControls.slideshowInterval).toBe(null);
    })

    it('should have a sort object with the proper methods', function () {
        var controller = createController();
        expect($scope.sort).toBeDefined();
        expect($scope.sort.terms.length).toBeGreaterThan(0);
        expect(angular.isFunction($scope.sort.sortGallery)).toBeTruthy();
        expect(angular.isFunction($scope.sort.clearActiveSort)).toBeTruthy();
        expect(angular.isFunction($scope.sort.reset)).toBeTruthy();
    });

    it('should broadcast a resize event when gallery is sorted', function () {
        var controller = createController();
        $scope.$apply();
        $scope.sort.sortGallery(0);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('resize');
    });

    it('should change the order of gallery photos when sorted', function () {
        var controller = createController();
        $scope.$apply();
        $scope.sort.sortGallery(0);
        var first = $scope.gallery.photos[0].title;
        $scope.sort.sortGallery(0);
        expect($scope.gallery.photos[0].title).not.toEqual(first);
    });

});