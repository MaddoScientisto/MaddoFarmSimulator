# AngularJS Phone Catalog Tutorial Application

## Overview

Figured I'd learn some angular so I started trying to make a little game, so here it is.

I wrote this over the angular tutorial so there might be some renmants around in the file structure.


### Installing dependencies

The application relies upon various node.js tools, such as Bower, Karma and Protractor.  You can
install these by running:

```
npm install
```

This will also run bower, which will download the angular files needed for the current step of the
tutorial.

Most of the scripts described below will run this automatically but it doesn't do any harm to run
it whenever you like.

### Running the app during development

- Run `npm start`
- navigate your browser to `http://localhost:8000/app/index.html` to see the app running in your browser.


## Application Directory Layout

    app/                --> all of the files to be used in production
      css/              --> css files
        app.css         --> default stylesheet
      img/              --> image files
      index.html        --> app layout file (the main html template file of the app)
      js/               --> javascript files
        app.js          --> the main application module
        controllers.js  --> application controllers
        directives.js   --> application directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
        animations.js   --> hooks for running JQuery animations with ngAnimate
      partials/         --> angular view partials (partial html templates) used by ngRoute
        partial1.html
        partial2.html
      bower_components  --> 3rd party js libraries, including angular and jquery

    scripts/            --> handy scripts
      update-repo.sh       --> pull down the latest version of this repos
                               (BE CAREFUL THIS DELETES ALL CHANGES YOU HAVE MADE)
      private/             --> private scripts used by the Angular Team to maintain this repo

