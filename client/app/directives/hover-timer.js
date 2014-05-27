app.directive('hoverTimer', ['$timeout', function ($timeout) {
    return {
        restrict:'A',
        link: function($scope, element, attrs) {

            var hoverTimer = null,
            hoverClass = attrs.hoverClass,
            hoverDelay = attrs.hoverTimer;

            element[0].addEventListener('mouseenter', function () {

                element.addClass(hoverClass);

                if (hoverTimer !== null) $timeout.cancel(hoverTimer);

            }, false);

            element[0].addEventListener('mouseleave', function () {

                hoverTimer = $timeout(function() {
                    element.removeClass(hoverClass);
                    hoverTimer = null;
                }, parseInt(hoverDelay));

            }, false);

            element[0].addEventListener('touchend', function () {
                element.toggleClass(hoverClass);
            }, false);

            $scope.$on('$destroy', function () {
                if (hoverTimer !== null) $timeout.cancel(hoverTimer);
            });

        }
    };
}]);