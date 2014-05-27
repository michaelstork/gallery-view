describe('GalleryRowsCtrl', function () {

    beforeEach(module('galleryView'));

    var $scope,
    $rootScope,
    $timeout,
    createController;
    
    beforeEach(inject(function ($injector) {
        
        $rootScope = $injector.get('$rootScope');
        $timeout   = $injector.get('$timeout');
        $scope     = $rootScope.$new();
        
        var $controller = $injector.get('$controller');
        
        // simulates data being loaded into scope during compile/linking phase
        mockData = function() {
            $scope.photos = [{},{},{}];
            $scope.reflowGallery = function() {};
        }
        createController = function() {
            return $controller('GalleryRowsCtrl', {
                '$scope': $scope
            });
        };
    }));

    it('should set hideLoader = true when photos are loaded into scope', function () {
        var controller = createController();
        expect($scope.photos).toBeUndefined();
        expect($scope.hideLoader).toBeFalsy();
        $scope.$apply(mockData);
        expect($scope.hideLoader).toBeTruthy();
    });
    it('should reflow gallery when photos are loaded into scope', function () {
        var controller = createController();
        expect($scope.photos).toBeUndefined();
        $scope.$apply(function () {
            mockData();
            spyOn($scope, 'reflowGallery');
        });
        expect($scope.reflowGallery.callCount).toBe(1);
    });
    it('should have zoom and defaultZoom scope properties', function () {
        var controller = createController();
        expect($scope.zoom).toBeDefined();
        expect($scope.defaultZoom).toEqual($scope.zoom);
    });
    it('should reflow gallery when zoom is changed', function () {
        var controller = createController();
        expect($scope.photos).toBeUndefined();
        mockData();
        spyOn($scope, 'reflowGallery');
        $scope.$apply(function () {
            $scope.zoom = 0.4;
        });
        expect($scope.reflowGallery.callCount).toEqual(1);
        $scope.$apply(function () {
            $scope.zoom = 1;
        });
        expect($scope.reflowGallery.callCount).toEqual(2);
    });
    it('should reflow gallery on resize', function () {
        var controller = createController();
        expect($scope.photos).toBeUndefined();
        $scope.$apply(function () {
            mockData();
            spyOn($scope, 'reflowGallery');
        });
        expect($scope.reflowGallery.callCount).toEqual(1);
        // simulate resize event
        $scope.$broadcast('resize', 'both');
        expect($scope.reflowGallery.callCount).toEqual(2);
    });
    it('should set galleryLoaded = true when all thumbnails have been loaded', function () {
        var controller = createController();
        $scope.$apply(mockData);
        expect($scope.photos.length).toBe(3);
        // simulate thumbnailLoaded event, emitted from thumbnail directive scope on image load
        for(var i = 0; i < 3; i++) {
            $scope.$broadcast('thumbnailLoaded');
        }
        expect($scope.galleryLoaded).toBeTruthy();
    });

});