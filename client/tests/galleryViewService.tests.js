describe('galleryViewService', function () {
    var galleryViewService,
            httpBackend,
            galleryViewAPI;

    // Mock data
    var galleriesReturnData = ['Gallery Title 1', 'Gallery Title 2', 'Gallery Title 3'];
    var galleryReturnData = {'Gallery Title 1': [{
        "gallery":"Gallery Title 1",
        "title":"Photo1Title",
        "filename":"Photo1Title.jpg",
        "src":"http://photo1src.jpg",
        "dimensions":{"width":1000,"height":1000},
        "mtime":1399660074
    },
    {
        "gallery":"Gallery Title 1",
        "title":"Photo2Title",
        "filename":"Photo2Title.jpg",
        "src":"http://photo2src.jpg",
        "dimensions":{"width":1000,"height":1000},
        "mtime":1399660074
    }]};

    beforeEach(function (){

        module('galleryView');

        inject(function($httpBackend, _galleryViewService_, _galleryViewAPI_) {
            galleryViewService = _galleryViewService_;
            httpBackend = $httpBackend;
            galleryViewAPI = _galleryViewAPI_;
        });
    });

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should have getNextPhotoFilename function', function () {
        httpBackend.expectGET(galleryViewAPI + 'galleries').respond(200);
        httpBackend.flush();
        expect(angular.isFunction(galleryViewService.getNextPhotoFilename)).toBe(true);
    });
    it('should have getPhotoURI function', function () {
        httpBackend.expectGET(galleryViewAPI + 'galleries').respond(200);
        httpBackend.flush();
        expect(angular.isFunction(galleryViewService.getPhotoURI)).toBe(true);
    });

    it('should get the gallery titles', function () {

        httpBackend.expectGET(galleryViewAPI + 'galleries').respond(galleriesReturnData);

        var returnedPromise = galleryViewService.galleryTitlesPromise;

        var result;
        returnedPromise.then(function (response) {
            result = response;
        });
        httpBackend.flush();

        expect(result.data).toEqual(galleriesReturnData);
    });

    it('should get the gallery thumbnails', function (){
        httpBackend.expectGET(galleryViewAPI + 'galleries').respond(galleriesReturnData);
        httpBackend.expectGET(galleryViewAPI + 'Gallery Title 1').respond(galleryReturnData['Gallery Title 1']);

        var returnedPromise = galleryViewService.getGalleryPhotos('Gallery Title 1');

        var result;
        returnedPromise.then(function (response) {
            result = response;
        });

        httpBackend.flush();

        expect(result).toEqual(galleryReturnData['Gallery Title 1']);
    });

    it('should get the gallery previews', function (){
        var galleriesReturnData = ['Gallery Title 1', 'Gallery Title 2', 'Gallery Title 3'];
        var previewsReturnData = ['preview', 'preview', 'preview', 'preview', 'preview'];
        var n = 5;
        httpBackend.expectGET(galleryViewAPI + 'galleries').respond(galleriesReturnData);
        httpBackend.expectGET(galleryViewAPI + 'previews' + '/' + n).respond(previewsReturnData);

        var returnedPromise = galleryViewService.getGalleryPreviews(n);

        var result;
        returnedPromise.then(function (response) {
            result = response;
        });

        httpBackend.flush();

        expect(result).toEqual(previewsReturnData);
        expect(result.length).toEqual(n);
    });

});
