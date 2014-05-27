describe('GalleryFooterCtrl', function () {

    beforeEach(module('galleryView'));

    var $scope, $rootScope, createController, mockGalleryViewService, $timeout, mockStateParams;

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $timeout = $injector.get('$timeout');
        var $q = $injector.get('$q');
        mockGalleryViewService = {
            getGalleryPreviews: function(n) {
                var deferred = $q.defer();
                deferred.resolve(previewReturnData);
                return deferred.promise;
            }
        };
        mockStateParams = {
            gallery: 'the gallery 1'
        };
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('GalleryFooterCtrl', {
                '$scope': $scope,
                '$stateParams': mockStateParams,
                'galleryViewService': mockGalleryViewService,
                '$timeout': $timeout
            });
        };
    }));

    it('should have scope property numPreviews, a number greater than 0', function () {
        var controller = createController();
        expect($scope.numPreviews).toBeGreaterThan(0);
    });
    it('should have scope property activePreview, a random number between 0 and numPreviews', function () {
        var controller = createController();
        expect($scope.activePreview).not.toBeLessThan(0);
        expect($scope.activePreview).toBeLessThan($scope.numPreviews);
    });
    it('should get gallery previews from galleryViewService after waiting 1000ms', function () {
        var controller = createController();
        expect($scope.previews.length).toBe(0);
        $timeout.flush(1000);
        expect($scope.previews.length).toBeGreaterThan(0);
    });
 
    var previewReturnData = [
        [
            {
                "gallery":"the gallery 1",
                "title":"PhotoTitle1",
                "filename":"PhotoTitle1.jpg",
                "src":"http://photo1src.jpg",
                "dimensions":{"width":1000,"height":1000},
                "mtime":0
            },
            {
                "gallery":"the gallery 1",
                "title":"PhotoTitle2",
                "filename":"PhotoTitle2.jpg",
                "src":"http://photo2src.jpg",
                "dimensions":{"width":1000,"height":1000},
                "mtime":0
            },
            {
                "gallery":"the gallery 1",
                "title":"PhotoTitle3",
                "filename":"PhotoTitle3.jpg",
                "src":"http://photo3src.jpg",
                "dimensions":{"width":1000,"height":1000},
                "mtime":0
            }
        ],
        [
            {
                "gallery":"the gallery 2",
                "title":"PhotoTitle1",
                "filename":"PhotoTitle1.jpg",
                "src":"http://photo1src.jpg",
                "dimensions":{"width":1000,"height":1000},
                "mtime":0
            },
            {
                "gallery":"the gallery 2",
                "title":"PhotoTitle2",
                "filename":"PhotoTitle2.jpg",
                "src":"http://photo2src.jpg",
                "dimensions":{"width":1000,"height":1000},
                "mtime":0
            },
            {
                "gallery":"the gallery 2",
                "title":"PhotoTitle3",
                "filename":"PhotoTitle3.jpg",
                "src":"http://photo3src.jpg",
                "dimensions":{"width":1000,"height":1000},
                "mtime":0
            }
        ]
    ];
 
});