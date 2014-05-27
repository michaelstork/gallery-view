### Gallery-View is a creatively named application for organizing and displaying galleries of photos.

The project consists of an image processing API written in PHP with [Laravel 4](http://laravel.com), and a client-side app created with [AngularJS](http://angularjs.org). Currently just a side project, and a work in progress.

The objective is to provide a simple photo gallery application that is capable of displaying large, high resolution photos in an efficient manner. The API allows for images to be requested at dimensions specific to the client/device and takes advantage of caching in order to reduce bandwith and loading times. Thumbnails are generated automatically from full resolution photo files, the location of which can be set in _/api/app/config/gallery-view.php._

---
### [Try it out](http://mstork.info/gallery-view)

For demo purposes, the galleries have been populated with my personal photography and a collection of images from the following stock photo sites:

* [Gratisography](http://gratisography.com)

* [morgueFile](http://morguefile.com)

* [Stock Vault](http://stockvault.com)

---
### API Routes

##### _gallery-view-api/..._

* ##### /galleries
Get all gallery titles

* ##### /{gallery}
Get thumbnails from specified gallery

* ##### /{gallery}/{filename}
Get specified photo at full resolution

* ##### /{gallery}/{filename}/{width}x{height}
Get specified photo at maximum dimensions {width} and {height}

* ##### /previews/{n}
Get n randomly selected thumbnails from each gallery

* ##### /{gallery}/preview OR /preview/{gallery}
Get 3 randomly selected thumbnails from the specified gallery