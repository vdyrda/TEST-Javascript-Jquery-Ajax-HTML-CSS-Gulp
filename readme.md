# Test task for CamoIT

by [Vladimir Dyrda] (mailto:vdyrda@gmail.com)

## Technologies

- Javascript
- Jquery
- Ajax
- JSON
- HTML5
- CSS3
- Gulp
- Git

## Pre-requirements

### Should be installed globally

- nodejs v.>=6.11
- npm v.>=3.10
- git v.>=2.13.windows
- gulp v.>=3.9.1
- gulp-cli v.>=1.3
- live-server

## Run this project in development mode

once:
> npm install

during the development:
> gulp watch

> live-server dist/

All the changes to theese files are watching by gulp to run and do ...

- less (.less) files from /src folder are compiling, minifying and moving into /dist/css/*.css files
- javascript (.js) files from /src folder are minimizing and moving into /dist/js/bundle.js file
- html (.html) files from /src folder are validating by W3C validator and are moving to /dist folder. Folder /w3cErrors contains errors information.
- images from /images are moving to dist/images
- any other files from /lib are moving to dist/lib

## Prepare this project for the production

> npm install
> gulp

## All the production files are in the dist/ folder
