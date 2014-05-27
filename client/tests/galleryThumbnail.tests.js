describe('galleryThumbnail', function () {
    var element, $scope;

    beforeEach(module('galleryView'));

    var template = window.__html__['partials/thumbnail.html'];
    var loader = window.__html__['partials/loader.html'];
    var base = '<div gallery-thumbnail="photo" row-height="250" ></div>';

    beforeEach(inject(function ($rootScope, $compile, $templateCache) {
        $templateCache.put('partials/thumbnail.html', template);
        $templateCache.put('partials/loader.html', loader);
        $scope = $rootScope;
        $scope.photo = {
            dimensions: {height:1000,width:1000},
            filename: 'the photo.jpg',
            gallery: 'the gallery',
            mtime: 10000000,
            src: 'http://photouri',
            title: 'the photo'
        };
        element = $compile(base)($scope);
        $scope.$digest();
    }));

    it('should set imgStyle.height from rowHeight', function () {
        expect(element.children().scope().imgStyle.height).toBe('250px');
    });

    it('should update imgStyle.height when rowHeight changes', function () {
        element.children().scope().rowHeight = 500;
        $scope.$digest();
        expect(element.children().scope().imgStyle.height).toBe('500px');
    });
});