<?php

    return array(

        // path to full resolution photos
        'images_path' => '',

        // path to thumbnails directory - must be public
        'thumbnails_path' => '',

        // uri to thumbnails directory
        'thumbnails_uri'  => asset('') . '/',

        // maximum height of generated thumbnails
        'thumbnail_max_height' => 400,

        // number of photos to return when requesting gallery previews
        'preview_length' => 3,

        // caching
        'enable_cache' => TRUE

    );
