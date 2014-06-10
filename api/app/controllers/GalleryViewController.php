<?php

class GalleryViewController extends BaseController {

    public function __construct()
    {
        $this->image_path = Config::get('gallery-view.images_path');
        $this->enable_cache = Config::get('gallery-view.enable_cache');
    }

    /**
     * Display API info
     */
    public static function info()
    {
        return View::make('info');
    }

    /**
     * Get all gallery titles
     * @return array
     */
    public function gallery_list()
    {
        $paths = Gallery::get_paths();

        return array_map(function($path) { return basename($path); }, $paths);
    }

    /**
     * Get all thumbnails from gallery
     * @param  string $title
     * @return array
     */
    public function get_gallery($title)
    {
        if ($this->enable_cache && Cache::has('tn' . $title))
        {
            $thumbnails = Cache::get('tn' . $title);

        } else {

            try
            {
                $gallery = new Gallery($title);

            } catch (Exception $e)
            {
                App::abort(404, $e->getMessage());
            }

            $thumbnails = $gallery->get_thumbnails();

            if ($this->enable_cache)
            {
                Cache::forever('tn' . $title, $thumbnails);
            }

        }
        return $thumbnails;
    }

    /**
     * Display a photo at specified maximum width/height
     * @param  string $gallery    Gallery title
     * @param  string $image      Photo filename
     * @param  string $dimensions Maximum width/height of returned photo
     * @return Response           Response with content-type image/jpeg
     */
    public function get_photo($gallery, $image, $dimensions = NULL)
    {
        try
        {
            $photo = new Photo($gallery, $image);

        } catch (Exception $e)
        {
            App::abort(404, $e->getMessage());
        }

        return $photo->display($dimensions);

    }

    /**
     * Get n random photos from each gallery
     * @param  int $n
     * @return array
     */
    public function get_previews($n = FALSE)
    {
        $paths = $this->gallery_list();

        foreach ($paths as $p => $path)
        {
            $title = basename($path);

            $arr[$title] = $this->get_gallery_preview($title, $n);
        }

        shuffle($arr);

        return $arr;
    }

    /**
     * Get n random photos from specified gallery
     * @param  string  $title
     * @param  int     $n
     * @return array
     */
    public function get_gallery_preview($title, $n = FALSE)
    {
        if (!$n)
        {
            $n = Config::get('gallery-view.preview_length');
        }

        $thumbnails = $this->get_gallery($title);

        $preview = array();

        if (!empty($thumbnails))
        {

            for ($i = 0; $i < $n; $i++)
            {
                $r = array_rand($thumbnails);

                if (!in_array($thumbnails[$r], $preview))
                {
                    $preview[] = $thumbnails[$r];
                } else
                {
                    $i--;
                }
            }

        }

        return $preview;
    }

    public function flush_cache()
    {
        Cache::flush();

        return 'Cache flushed';
    }

}
