# myGeoBeerMap

A simple web page to map out my brewery visits.

## Introduction

Combining the data from the [geoBeer repo](https://github.com/devNoiseConsulting/geoBeer) and the geobeer.json file a brewery map can be generated.

### Map Legend

| Status |Color|Hex Code|Size|
|---|---|---|---|---|
|visited|blue|#0047AB|large|
|visiting soon|green|#009688|medium|
|brewery |gray|#607D8B|small|
|not yet open|DarkOrange|#FF8C00|small|

## Build

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Type `npm install` to install all the needed packages to build the website.

### NPM commands

Script to add in the creation of the map website.

* npm run refresh
 * Get the latest version of the geoBeer repository.
* npm run breweries
 * Script to build a customized list of breweries.
* npm run build
 * Will run the breweries script and the gulp build to create the updated website.
* npm run fullbuild
 * Runs the refresh, breweries and gulp build.
* npm run start
 * Will start the live-server so you can test the map before deployment.
