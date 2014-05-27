app.service('galleryViewService', ['$http', '$q', 'galleryViewAPI', 'photoFrameService', '$window', '$timeout', '$rootScope', function ($http, $q, galleryViewAPI, photoFrameService, $window, $timeout, $rootScope) {

    var galleryPhotoData = {},
        galleryPreviews;

    this.galleryTitlesPromise = $http({
        url: galleryViewAPI + 'galleries',
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).error(function (error) {
        console.log(error);
    });

    this.getGalleryPhotos = function(gallery, reset) {

        var deferred = $q.defer();

        if (reset || galleryPhotoData[gallery] === undefined) {

            $http({
                url: galleryViewAPI + gallery,
                method: 'GET',
            }).success(function (data) {
                galleryPhotoData[gallery] = data;
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.resolve(galleryPhotoData[gallery]);
        }

        return deferred.promise;
    };

    this.getGalleryPreviews = function(n) {

        var deferred = $q.defer();

        if (galleryPreviews === undefined) {

            $http({
                url: galleryViewAPI + 'previews' + (n ? '/' + n : ''),
                method: 'GET',
            }).success(function (data) {
                galleryPreviews = data;
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.resolve(galleryPreviews);
        }

        return deferred.promise;
    };

    this.getNextPhotoFilename = function(gallery, filename, offset) {

        if (galleryPhotoData[gallery] === undefined) { return false; }

        var n, photos = galleryPhotoData[gallery];

        for (var i = 0; i < photos.length; i++) {

            if (photos[i].filename !== filename) continue;

            n = i + offset;
            break;
        }
        var y = n < 0 ? photos.length + n : n >= photos.length ? (n - photos.length) : n;

        return photos[y] ? photos[y].filename : false;
    };

    this.getPhotoURI = function(gallery, filename, offset) {
        if (offset) filename = this.getNextPhotoFilename(gallery, filename, offset);
        if (filename) {
            return [galleryViewAPI + gallery, filename, photoFrameService.dimensions.join('x')].join('/');
        } else {
            return false;
        }
    };

}]);