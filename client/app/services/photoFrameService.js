app.service('photoFrameService', ['$window', '$timeout', '$rootScope', function ($window, $timeout, $rootScope) {
    /**
     *  Record amount of screen space available
     *  Update on resize
     */
    var frame = {
        dimensions: null,
        resizing: null,

        /**
         *  Recalculate dimensions of screen
         *  Return a string indicating which dimensions have changed
         */
        updateDimensions: function() {
            var width =
                window.innerWidth
                || document.documentElement.clientWidth
                || document.getElementsByTagName('body')[0].clientWidth;
            var height =
                window.innerHeight
                || document.documentElement.clientHeight
                || document.getElementsByTagName('body')[0].clientHeight;

            var deltas, direction;
            if (this.dimensions !== null) {
                deltas = [(this.dimensions[0] - width), (this.dimensions[1] - height)];
                direction = deltas[0]
                    ? (deltas[1] ? 'both' : 'horizontal')
                    : (deltas[1] ? 'vertical' : 'none');
            }

            // leave room for ui elements
            this.dimensions = [Math.round(width * 0.94) - 16, Math.round(height * 0.92) - 16];

            return direction;
        },
        // update dimensions only after resizing stops
        resizeHandler: function() {
            if (this.resizing) $timeout.cancel(this.resizing);

            this.resizing = $timeout(function () {
                frame.resizing = null;
                $rootScope.$broadcast('resize', frame.updateDimensions());
            }, 200);
        }
    };

    // set initial frame dimensions
    frame.updateDimensions();
    // recalculate dimensions on window resize
    angular.element($window).on('resize', frame.resizeHandler.bind(frame));

    return frame;
}]);