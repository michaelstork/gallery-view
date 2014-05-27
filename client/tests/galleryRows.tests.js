describe('galleryRows', function () {
    var element, $scope;

    beforeEach(module('galleryView'));

    var template  = window.__html__['partials/gallery-rows.html'];
    var loader    = window.__html__['partials/loader.html'];
    var thumbnail = window.__html__['partials/thumbnail.html'];
    var base = '<section gallery-rows gallery-photos="gallery.photos" start-slideshow="slideshowControls.start()" gallery-sort="sort"></section>';

    beforeEach(inject(function ($rootScope, $compile, $templateCache) {
        $templateCache.put('partials/gallery-rows.html', template);
        $templateCache.put('partials/loader.html', loader);
        $templateCache.put('partials/thumbnail.html', thumbnail);
        $scope = $rootScope;
        // Mock data
        $scope.gallery = {};
        $scope.gallery.photos = [
            {dimensions:{width:1000,height:1000}},
            {dimensions:{width:1000,height:1000}},
            {dimensions:{width:1000,height:1000}}
        ];
        element = $compile(base)($scope);
        $scope.$digest();
        // get directive isolate scope
        isolateScope = element.children().scope();
    }));
    
    it('should populate the rows object', function () {
        expect(isolateScope.rows.length).toBeGreaterThan(0);
    });
    it('should calculate a rowHeight for each row', function () {
        expect(isolateScope.rowHeights.length).toEqual(isolateScope.rows.length);
    });
});