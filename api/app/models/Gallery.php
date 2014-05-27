<?php

class Gallery {

    public function __construct($gallery)
    {
        $this->gallery         = $gallery;
        $this->thumbnails      = array();
        $this->thumbnails_path = Config::get('gallery-view.thumbnails_path') . $gallery . '/';
        $this->thumbnails_uri  = Config::get('gallery-view.thumbnails_uri') . $gallery . '/';
        $this->photos_path     = Config::get('gallery-view.images_path') . $gallery . '/';

        if (!is_dir($this->photos_path))
        {
            throw new Exception('Gallery not found');
        }

        $this->photos = $this->get_photos();
    }

    /**
     * Get paths of all galleries
     * @return array
     */
    public static function get_paths()
    {
        return glob(Config::get('gallery-view.images_path') . '*', GLOB_ONLYDIR);
    }

    /**
     * Get all the thumbnails from this gallery
     * Generate them if they don't exist
     * @return array
     */
    public function get_thumbnails()
    {
        // Create thumbnails directory for this gallery if it doesn't exist
        if (!is_dir($this->thumbnails_path)) mkdir($this->thumbnails_path, 0777, TRUE);

        foreach ($this->photos as $p => $photo)
        {
            $img = new Photo($this->gallery, basename($photo));

            if (!file_exists($this->thumbnails_path . basename($photo)))
            {
                $img->generate_thumbnail();
            }

            $this->thumbnails[] =
                array(
                    'gallery'    => $this->gallery,
                    'title'      => $img->title,
                    'filename'   => $img->filename,
                    'src'        => $img->thumbnail_uri,
                    'dimensions' => array('width' => $img->size[0], 'height' => $img->size[1]),
                    'mtime'      => $img->mtime
                );
        }

        shuffle($this->thumbnails);

        return $this->thumbnails;
    }

    /**
     * Get the paths of all full sized photos in this gallery
     * @return array
     */
    public function get_photos()
    {
        return glob($this->photos_path . '*\.{jpg,JPG}', GLOB_BRACE);
    }


}