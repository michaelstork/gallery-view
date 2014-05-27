describe('PhotoViewerCtrl', function () {

    beforeEach(module('galleryView'));

    var $scope,
    $rootScope,
    createController,
    $timeout,
    $location,
    mockGalleryViewService,
    mockFrame,
    mockStateParams;

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $timeout = $injector.get('$timeout');
        $location = $injector.get('$location');
        var $q = $injector.get('$q');
        mockPhotoFrameService = {};
        mockPhotoFrameService.dimensions = [1000, 1000];
        mockGalleryViewService = {
            getPhotoURI: function(gallery, photo) {
                return ['http://mockAPI/' + gallery, photo, mockPhotoFrameService.dimensions.join('x')].join('/');
            },
            getNextPhotoFilename: function(gallery, photo, offset) {
                return 'another photo';
            }
        };
        mockStateParams = {
            gallery: 'the gallery',
            photo: 'the photo'
        };
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('PhotoViewerCtrl', {
                '$scope': $scope,
                '$stateParams': mockStateParams,
                'galleryViewService': mockGalleryViewService,
                '$timeout': $timeout,
                '$location': $location
            });
        };
    }));

    it('should initialize a photoLoaded scope property to false', function () {
        var controller = createController();
        expect($scope.photoLoaded).toBeFalsy();
    });
    it('should get the photo title from $stateParams', function () {
        var controller = createController();
        expect($scope.photo.title).toEqual('the photo');
    });
    it('should get the photo uri from galleryViewService', function () {
        var controller = createController();
        expect($scope.photo.uri).toEqual('http://mockAPI/the gallery/the photo/1000x1000');
    });
    it('should get a new photo URI on resize', function () {
        var controller = createController();
        var oldURI = $scope.photo.uri;
        // simulate resize
        mockPhotoFrameService.dimensions = [2000, 2000];
        $scope.$broadcast('resize');
        expect($scope.photo.uri).not.toEqual(oldURI);
    });
    it('should have a changePhoto method that updates $location', function () {
        var controller = createController();
        expect(angular.isFunction($scope.changePhoto)).toBeTruthy();
        $scope.changePhoto(1);
        expect($location.path()).toBe('/the gallery/another photo');
    });
    it('should call changePhoto on slideshowIterate event', function () {
        var controller = createController();
        spyOn($scope, 'changePhoto');
        $scope.$broadcast('slideshowIterate');
        expect($scope.changePhoto.callCount).toEqual(1);
        $scope.$broadcast('slideshowIterate');
        expect($scope.changePhoto.callCount).toEqual(2);
    });

});