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

var env = 'dev';

gulp.task('setdev', function(){
	env = 'dev';
});

gulp.task('setprod', function(){
	env = 'prod';
});

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
	return gulp.src(mainBowerFiles({env:env}), {base: 'bower_components'}).pipe(gulp.dest(paths.extlibs));
});

gulp.task('clean', function() {
	return gulp.src(paths.webapp, {read : false}).pipe(rimraf({ force: true }));
});

gulp.task('html', function(){
	return gulp.src(paths.html)
		.pipe(preprocess({context: { NODE_ENV: env}}))
	    .pipe(fileinclude({
	      prefix: '@@',
	      basepath: '@file'
	    }))
	    .pipe(gulp.dest(paths.webapp));
});

gulp.task('scripts-dev', function() {
	return gulp.src(paths.scripts)
	    .pipe(concat('angular-webseed.js'))
	    .pipe(gulp.dest(paths.webapp));
});

gulp.task('scripts-prod', function() {
	return gulp.src(paths.scripts)
	    .pipe(concat('angular-webseed.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(paths.webapp));
});

gulp.task('watch', function() {
	  gulp.watch(paths.scripts, ['scripts-dev']);
	  gulp.watch(paths.html, ['html']);
	  gulp.watch(paths.sass, ['sass']);
	});

gulp.task('build-prod', gulpsync.sync([['clean', 'setprod'],['bower-files', 'webxml', 'html', 'scripts-prod']], 'prod'));
gulp.task('build-dev', gulpsync.sync([['clean', 'setdev'],['bower-files', 'webxml', 'html', 'scripts-dev']], 'dev'));




