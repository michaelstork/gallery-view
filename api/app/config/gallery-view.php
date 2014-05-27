<?php

    return array(
        // full resolution photos
        'images_path' => '/home/michael/gallery-view/photos/',
        // thumbnails directory - must be public
        'thumbnails_path' => '/home/michael/gallery-view/api/public/images/thumbnails/',
        // uri to thumbnails directory
        'thumbnails_uri'  => asset('images/thumbnails') . '/',
        // maximum height of generated thumbnails
        'thumbnail_max_height' => 400,
        // number of photos to return when requesting gallery previews
        'preview_length' => 3,
        // caching
        'enable_cache' => TRUE
    );