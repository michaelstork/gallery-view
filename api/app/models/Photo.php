<?php

class Photo {

	public function __construct($gallery, $image)
	{
		$this->gallery = $gallery;
		$this->filename = $image;
		$this->image_path = Config::get('gallery-view.images_path') . $gallery . '/' . $image;

		if (!file_exists($this->image_path))
		{
			throw new Exception('Image not found');
		}

		$this->thumbnail_path = Config::get('gallery-view.thumbnails_path') . $gallery . '/' . $image;
		$this->thumbnail_uri  = Config::get('gallery-view.thumbnails_uri') .  $gallery . '/' . $image;
		$this->title = basename($image, '.' . pathinfo($image, PATHINFO_EXTENSION));
		$this->mtime = filemtime($this->image_path);
		$this->size = getimagesize($this->image_path);
	}

	/**
	 * Generate thumbnail at height specified in config
	 */
	public function generate_thumbnail()
	{
		$thumbnail_size = Config::get('gallery-view.thumbnail_max_height');

		$thumb = Image::make($this->image_path);

		$thumb->resize(NULL, $thumbnail_size, TRUE, FALSE)->save($this->thumbnail_path, 60);
	}

	/**
	 * Resize photo and return response object
	 * @param  array $dimensions	Maximum width and height of photo
	 * @return Response             Response object with content-type image/jpeg
	 */
	public function display($dimensions)
	{
		if (is_string($dimensions) && preg_match('/^\d{3,5}x\d{3,5}$/', $dimensions))
		{
			$d = explode('x', $dimensions);
			$w = $d[0] == 0 ? NULL : $d[0];
			$h = $d[1] == 0 ? NULL : $d[1];

			$path = $this->image_path;

			// Cache photo at this size
			$i = Image::cache(function($image) use ($w, $h, $path) {

			   return $image->make($path)->resize($w, $h, TRUE, FALSE);

			}, 120, FALSE);

		} else
		{
			// Get photo at full size
			$i = file_get_contents($this->image_path);
		}

		$response = Response::make($i, 200);
		$response->headers->set('content-type', 'image/jpeg');
		$response->headers->set('Cache-Control', 'public; max-age=31536000');

		return $response;

	}

}