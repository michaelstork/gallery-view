<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

// Displays API info
Route::get('/', 'GalleryViewController@info');

// Returns gallery names in JSON
Route::get('/galleries', 'GalleryViewController@gallery_list');

// Flush cache
Route::get('/flush', 'GalleryViewController@flush_cache');

// Returns URIs of n randomly selected thumbnails from each gallery
Route::get('/previews/{n?}', 'GalleryViewController@get_previews');

// Returns URIs of 3 randomly selected thumbnails from specified gallery in JSON
Route::get('/{gallery}/preview', 'GalleryViewController@get_gallery_preview');
Route::get('/preview/{gallery}', 'GalleryViewController@get_gallery_preview');

// Returns URIs of all gallery thumbnails in JSON
Route::get('/{gallery}', 'GalleryViewController@get_gallery');

// Restricts dimensions parameter to proper format
Route::pattern('dimensions', '^(0|\d{3,5})x(0|\d{3,5})$');
// Returns image resized according to maximum dimensions, or full-size if none provided
Route::get('/{gallery}/{photo}/{dimensions?}', 'GalleryViewController@get_photo');
