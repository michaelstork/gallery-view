describe('galleryViewNavMenu', function () {
	var element, $scope;

    beforeEach(module('galleryView'));

    var template = window.__html__['partials/gallery-view-nav.html'];
    var base = '<div gallery-view-nav-menu="galleries" class="gallery-view-nav-menu"></div>';

	beforeEach(inject(function ($rootScope, $compile, $templateCache) {
        $templateCache.put('partials/gallery-view-nav.html', template);
        $scope = $rootScope;
        $scope.galleries = ['Gallery Title 1', 'Gallery Title 2', 'Gallery Title 3'];
        element = $compile(base)($scope);
    }));

    it('should generate a list item for each gallery', function () {
        $scope.$digest();
        expect(element.find('li').length).toBe(3);
    });

    it('should split the menu into columns of 5 items each', function () {
        //Add more items to list
        for (var i = 4; i < 16; i++) {
            $scope.galleries.push('Gallery Title ' + i);
        }
        $scope.$digest();
        expect(element.find('li').length).toBe(15);
        expect(element.children().scope().menuStyle.minWidth).toBe('750px');
        expect(element.children().scope().menuStyle.columnCount).toBe(3);
    });

});