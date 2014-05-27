describe('BaseCtrl', function() {

    beforeEach(module('galleryView'));

    var $scope, $rootScope, createController, mockGalleryViewService;

    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        mockPhotoFrameService = {
            dimensions: [1000, 1000]
        };
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('BaseCtrl', {
                '$scope': $scope,
                'photoFrameService': mockPhotoFrameService,

            });
        };
    }));

    it('should initialize pageTitle and fullscreen scope props', function() {
        var controller = createController();
        expect($scope.pageTitle).toEqual('Gallery-View');
        expect($scope.fullscreen).toEqual(false);
    });

    it('should update fullscreen/pageTitle props on route change', function() {
        var controller = createController();
        $rootScope.$broadcast('$stateChangeStart', {}, {gallery:'the gallery', photo: undefined});
        expect($scope.fullscreen).toEqual(false);
        expect($scope.pageTitle).toEqual('the gallery');
        $rootScope.$broadcast('$stateChangeStart', {}, {gallery:'the gallery', photo: 'the photo'});
        expect($scope.fullscreen).toEqual(true);
        expect($scope.pageTitle).toEqual('the gallery - the photo');
    });

    it('should get dimensions from photoFrameService and set mainHeight', function() {
        var controller = createController();
        expect($scope.mainHeight).toEqual('1000px');
    });

    it('should update mainHeight on resize event', function() {
        var controller = createController();
        // check that initial value is correct
        expect($scope.mainHeight).toEqual('1000px');
        // modify dimensions to simulate resize
        mockPhotoFrameService.dimensions = [1000, 2000];
        // inform controller that resize has happened and check if value updates
        $rootScope.$broadcast('resize');
        expect($scope.mainHeight).toEqual('2000px');
    });

});