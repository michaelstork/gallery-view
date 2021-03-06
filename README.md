### Gallery-View is a creatively named application for organizing and displaying galleries of photos.

The project consists of an image processing API written in PHP with [Laravel 4](http://laravel.com), and a client-side app created with [AngularJS](http://angularjs.org). Currently just a side project, and a work in progress.

The objective is to provide a simple photo gallery application that is capable of displaying large, high resolution photos in an efficient manner. The API  allows for images to be requested at specific dimensions and takes advantage of caching in order to reduce loading times. Thumbnails are generated automatically from full resolution photo files.

---
### [Try it out](http://mstork.info/gallery-view)

For demo purposes, the galleries have been populated with my personal photography and a collection of images from the following stock photo sites:

* [Gratisography](http://gratisography.com)

* [morgueFile](http://morguefile.com)

* [Stock Vault](http://stockvault.com)

---
### API Routes

##### `gallery-view-api` /

* ##### /galleries
Get all gallery titles

* ##### / `{gallery}`
Get all thumbnails from specified gallery

* ##### / `{gallery}` / `{filename}`
Get specified photo at full resolution

* ##### / `{gallery}` / `{filename}` / `{width}` x `{height}`
Get specified photo at maximum dimensions {width} and {height}

* ##### /previews/ `{n}`
Get n randomly selected thumbnails from each gallery

* ##### / `{gallery}` /preview
Get 3 randomly selected thumbnails from the specified gallery