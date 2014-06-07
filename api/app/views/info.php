<html>
    <head>
        <title>Gallery-View API Routes</title>
    </head>
    <style>
        body { font-family:'Trebuchet MS' sans-serif; color:#777; width:600px; }
        span { background-color:#999; color:#FFF; padding:0.15em 0.25em; margin:0 0.25em; border-radius:0.25em; }
        p { border-bottom:1px dotted #999; padding-bottom:0.5em; }
        li { background-color:#EAEAEA; padding:0.5em 0.25em; }
    </style>
    <body>
        <div class="api-info">

            <h2>API Routes:</h2>

            <h4>gallery-view-api/...</h4>

            <ul>
                <li>/galleries</li>
                <p>Get all gallery titles</p>

                <li>/<span>{gallery}</span></li>
                <p>Get all thumbnails from specified gallery</p>

                <li>/<span>{gallery}</span>/<span>{filename}</span></li>
                <p>Get specified photo at full resolution</p>

                <li>/<span>{gallery}</span>/<span>{filename}</span>/<span>{width}</span>x<span>{height}</span></li>
                <p>Get specified photo at maximum dimensions {width} and {height}</p>

                <li>/previews/<span>{n}</span></li>
                <p>Get n randomly selected thumbnails from each gallery</p>

                <li>/<span>{gallery}</span>/preview</li>
                <p>Get 3 randomly selected thumbnails from the specified gallery</p>
            </ul>

        </div>
    </body>
</html>