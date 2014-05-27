app.filter('currentGalleryFirst', ['$stateParams', function ($stateParams) {
    return function (titles) {
        var i = titles.indexOf($stateParams.gallery);
        if (i >= 0) {
            titles.splice(i, 1);
            titles.unshift($stateParams.gallery);
        }
        return titles;
    };
}]);