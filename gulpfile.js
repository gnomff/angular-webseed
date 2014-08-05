var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var gulpsync = require('gulp-sync')(gulp);
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var preprocess = require('gulp-preprocess');

var paths = {
	res: 'src/main/resources/',
	webapp: 'src/main/webapp/', 
	css: 'src/main/webapp/css/',
	extlibs : 'src/main/webapp/extlibs/',
	webinf: 'src/main/webapp/WEB-INF/',
	
	scripts : 'src/main/javascript/**/*.js',
	html: 'src/main/html/**/*.html',
	sass: 'src/main/sass/**/*.scss'
};

gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function(){
	return gulp.src(paths.sass)
	    .pipe(sass())
	    .pipe(gulp.dest(paths.css));
});

gulp.task('webxml', function(){
	return gulp.src(paths.res + 'web.xml').pipe(gulp.dest(paths.webinf));
});

gulp.task('bower-files', function() {
	return gulp.src(mainBowerFiles(), {base: 'bower_components'}).pipe(gulp.dest(paths.extlibs));
});

gulp.task('clean', function() {
	return gulp.src(paths.webapp, {read : false}).pipe(rimraf({ force: true }));
});

gulp.task('html', function(){
	return gulp.src(paths.html)
		.pipe(preprocess())
	    .pipe(fileinclude({
	      prefix: '@@',
	      basepath: '@file'
	    }))
	    .pipe(gulp.dest(paths.webapp));
});

gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
	    .pipe(concat('angular-webseed.js'))
	    .pipe(gulp.dest(paths.webapp))
	    .pipe(rename('angular-webseed.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(paths.webapp));
});

gulp.task('build', gulpsync.sync(['clean',['bower-files', 'webxml', 'html', 'scripts']]));

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.sass, ['sass']);
});
