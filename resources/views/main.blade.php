<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />

    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
      crossorigin=""
    />
    <link rel="shortcut icon" type="image/x-icon" href="images/icon.jpg">
    <title>Fit Admin</title>
</head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>

        <div id="root"></div>
        <!--
          This HTML file is a template.
          If you open it directly in the browser, you will see an empty page.
          You can add webfonts, meta tags, or analytics to this file.
          The build step will place the bundled scripts into the <body> tag.
          To begin the development, run `npm start` or `yarn start`.
          To create a production bundle, use `npm run build` or `yarn build`.
        -->
        <script src="{{ url('/js/index.js') }}"></script>
    </body>
</html>