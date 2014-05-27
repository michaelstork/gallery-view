'use strict';

var app = angular.module('galleryView', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/MStork Photos');

    var nav = {
        view: {
            template:'<div gallery-view-nav-menu="galleries" class="gallery-view-nav-menu"></div>',
            controller: ['$scope', 'galleryTitlesData', function ($scope, galleryTitlesData) {
                $scope.galleries = galleryTitlesData.data;
            }]
        },
        resolve: {
            galleryTitlesData: ['galleryViewService', function (galleryViewService) {
                return galleryViewService.galleryTitlesPromise;
            }]
        }
    };

    $stateProvider
        .state('gallery', {
            url: '/{gallery:[^/]+\/?}',
            views: {
                'main' : {
                    templateUrl: 'partials/gallery.html',
                    controller: 'GalleryCtrl'
                },
                'nav' : nav.view,
                'footer' : {
                    template: '<div gallery-footer></div>'
                }
            },
            resolve:nav.resolve
        })
        .state('view', {
            parent: 'gallery',
            url: '/{photo:[^/]+\/?}',
            template: '<div photo-viewer slideshow-controls="slideshowControls"></div>'
        });
}]);


