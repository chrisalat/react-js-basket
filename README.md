# Basket

Frontend of a basket for products.

Current features:

* jekyll
* js (just jshint and copy)
* images (just copy)
* livereload
* build and dev folders
* folder cleanup 
* .gitignore
* basic .jshint config
* svg sprite
* reactJS (with included modules like material-ui)
* webpack

Instruction of modules:

* del (commands for deleting files and more) 
* gulp-autoprefixer (support of older browsers to add prefix in CSS like webkit and compiler for LESS)
 * gulp-concat (concatenate all scripts in one output file)
 * gulp-if (for if-conditions inside gulp pipes) 
* gulp-inject (inject file references into index.html)
 * gulp-jshint (check if the scripts are semantic)
 * gulp-jshint-file-reporter (writes the output of js-hint in a file) 
* gulp-livereload (whatch for changes in files) 
* gulp-load-plugins (only loading of all gulp plugins in package.json) 
* gulp-notify (send messages based on vinyl files or errors) 
* gulp-plumber (prevend pipe breaking caused by errors from gulp plugins) 
* gulp-sass (compiler for SASS and more)
 * gulp-sourcemaps (inline source maps embedded in source file) 
* svg-sprite (generates a sprite.svg in "/src/zetzer/partials" out of all .svg in "./src/img/**")

## Get Started


### Install Ruby and jekyll

DONT FORGET TO ISTALL RUBYGEMS AND JEKYLL ON YOUR PC!
It is a must have for jekyll.

RubyGems: ```https://rubygems.org/pages/download```

jekyll: ```gem install jekyll bundler```

DONT FORGET TO CHANGE THE RUBYGEMS DIRECTORY IN GULPFILE AFTER YOU SETUP A NEW PROJECT OR GULPFILE WAS UPDATED!

### Developing


#### Setup a new project

git clone this repo

execute 

```npm i```

```bower install```

```npm start``` or just ```gulp```

#### Run from an existing project

git clone the project repo

on first run: ```npm i``` 


```npm update``` (only on needed)

```npm run clean```  (only on pull new data from git repo)

```npm start``` or just ```gulp```


### Build Sources 

```npm run clean```

```npm run build``` 



## Instructions
### Folder Structure



```
* _site (compiled files for development)
* assets
* node_modules (think this is clear)

```
(do not modify files directly in these folders )

* src (project files)
* _data (jekyll files)
* _includes (jekyll files)
* _layouts (jekyll files)
* _posts (jekyll files)





The Folders ``.sass-cache``, ``assets``, ``_site``, ``bower_components`` and ``node_modules`` are automatically generated and should be never in a Repository. 

The generated Files in ``src`` should be have no dependences. So that they can upload to a server or sended to a backend developer, without breaking the functionality or styling or whatever. 

For Frontend Development is the Folder ``_site``, there you will have help tools like sourcemaps, linting/hinting or tests.



### Existing Commands

#### npm commands

``` npm start ```  : Start the project alias of gulp

``` npm run dev ```  : Start the project alias of gulp

``` npm run build ```  : Compiles the Source to the build Folder

``` npm run clean ```  : Deletes the "dev" and "build Folder" 

#### gulp commands

``` gulp```  : Complies the sources and start the watcher

``` gulp build --build ```  : Compiles the Source to the build Folder

``` gulp clean ```  : deletes the "dev" folder

``` gulp clean --build ```  : deletes the "build" folder






