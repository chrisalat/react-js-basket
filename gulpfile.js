
var args = require('yargs').argv,
	gulp = require('gulp'),
	del = require('del'),
    $   = require('gulp-load-plugins')(),
	sass = require('gulp-sass'),
	gutil = require('gulp-util'),
	plumber = require('gulp-plumber'),
	svgSprite = require('gulp-svg-sprite'),
	webpack = require('webpack-stream'),
	react = require('gulp-react'),
	connect = require('gulp-connect');
	cp = require('child_process');

//require('gulp-grunt')(gulp);

var isDev=true;	
var isBuild=false;	


if(args.build){
	isDev=false;	
	isBuild=true;	
}

var dirs=  {
	src:"src",
	dev:"assets",
	build:"build"
};


var sourceDir = dirs.src;
var targetDir = dirs.dev;


if(isBuild){
	targetDir=dirs.build;
}


var paths = {


	watch:{
		sass:["./"+sourceDir+"/sass/**/*"],
		js:["./"+sourceDir+"/js/**/*"],
		img:["./"+sourceDir+"/img/**/*"],
		jsx:["./"+sourceDir+"/react/**/*"],
		json:["./"+sourceDir+"/json/**/*"]
	},


	src:{
		sass:["./"+sourceDir+"/sass/**/*.scss"],
		js:["./"+sourceDir+"/js/**/*"],
		jsx:["./"+sourceDir+"/react/**/*"],
		img:["./"+sourceDir+"/img/**/*"],
		lib:["./"+sourceDir+"/libs/"],
		svg:["./"+sourceDir+"/img/svg/*.svg"],
		sprites:"./"+sourceDir+"/sprites/",
		json:["./"+sourceDir+"/json/**/*"],
	},

	target:{
		sass:"./"+targetDir+"/css/",
		sourcemaps:"../maps",
		js:"./"+targetDir+"/js/",
		jsx:"./"+targetDir+"/js/react/",
		img:"./"+targetDir+"/img/",
		index:"./"+targetDir+"/",
		json:"./"+targetDir+"/json/"
	},
	
	jekyll: ['index.html', '_posts/*', '_layouts/*', '_includes/*' , 'assets/*', 'assets/**/*']
};

var spriteConfig = {
	mode: {
		inline: true,
		symbol: {
			dest: '',
			sprite: 'sprite.svg'
		}
	}
};

// Rebuild Jekyll
gulp.task('build-jekyll', (code) => {
  return cp.spawn('C:\\Ruby22-x64\\bin\\jekyll.bat', ['build'], {stdio: 'inherit'})
    .on('error', (error) => gutil.log(gutil.colors.red(error.message)))
    .on('close', code)
});

// Setup Server
gulp.task('server', () => {
  connect.server({
    root: ['_site'],
    port: 4000
  });
});

gulp.task('svg', function() {
	console.log(paths.src.sprites);
	return gulp.src(paths.src.svg)
		.pipe(svgSprite( spriteConfig ))
		.pipe(gulp.dest(paths.src.sprites));
});

gulp.task('webpack', function() {
	return gulp.src('')
		.pipe(webpack( require('./webpack.config.js') ))
		.pipe(gulp.dest(''));
});

gulp.task('sass', function () {
	return gulp.src(paths.src.sass)
		.pipe($.sass().on('error', sass.logError))
		.pipe($.autoprefixer({
			browsers: [
				'Chrome >= 40',
				'IE >= 10',
				'Safari >= 8',
				'Firefox >= 36',
				'Android >= 5'
			],
			cascade: false
		}))
		.pipe(gulp.dest(paths.target.sass))
		.pipe($.livereload());
});

gulp.task('js', function () {

	gulp.src(paths.src.js)
	.pipe($.plumber())
	.pipe(gulp.dest(paths.target.js))
	.pipe($.if(isDev, $.jshint()))
  	.pipe($.if(isDev,$.jshint.reporter('gulp-jshint-file-reporter', {filename: __dirname + '/dev/jshint-output.log'})))
	.pipe($.livereload());
});

gulp.task('concatLibs', function() {
	gulp.src([
		paths.src.lib+"jquery/dist/jquery.min.js"])
		.pipe($.concat('libs.js'))
		.pipe(gulp.dest(paths.target.js));
});

gulp.task('img', function () {
	gulp.src(paths.src.img)
	.pipe($.plumber())
	.pipe(gulp.dest(paths.target.img))
	.pipe($.livereload());
});

gulp.task('json', function () {
	gulp.src(paths.src.json)
		.pipe($.plumber())
		.pipe(gulp.dest(paths.target.json))
		.pipe($.livereload());
});

gulp.task('clean', function (cb) {
	del(paths.target.index, cb);
});

gulp.task('default');

gulp.task('watch', function() {


	gulp.watch(paths.watch.sass, ['sass']);
	gulp.watch(paths.watch.js, ['js']);
	gulp.watch(paths.watch.img, ['img']);
	gulp.watch(paths.watch.jsx, ['webpack']);
	gulp.watch(paths.watch.json, ['json']);
	gulp.watch(paths.jekyll, ['build-jekyll']);
	

	$.livereload.listen({quiet:true});
});

gulp.task('default', ["concatLibs","js","webpack",'img','sass','svg','json', 'build-jekyll','server','watch']);

gulp.task('build', ['clean',"concatLibs","js",'sass','svg','json','img']);
