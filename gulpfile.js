var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var fileinclude = require('gulp-file-include');
var bower = require('gulp-bower');
var plumber = require('gulp-plumber');

var src_paths = {
    js: 'src/js/',
    scss: 'src/scss/',
    tpl: 'src/',
    bower: './bower_components' 
};
var build_paths = {
    js: 'build/js/',
    scss: 'build/css/',
    tpl: 'build/'
}

gulp.task('templates', function () {
    gulp.src(src_paths.tpl + 'index.html')
        .pipe(plumber())
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest(build_paths.tpl));
});

gulp.task('scripts', function () {
    gulp.src(src_paths.js + '*.js')
        .pipe(plumber())
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest(build_paths.js));
});

gulp.task('sass', function () {
    gulp.src(src_paths.scss + 'main.scss')
        .pipe(plumber())
        .pipe(sass({
             includePaths: [
                 src_paths.bower + '/bootstrap-sass/assets/stylesheets',
                 src_paths.bower + '/font-awesome/scss',
             ]
         }))
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(gulp.dest(build_paths.scss));
});

gulp.task('bower', function() { 
    return bower()
        .pipe(plumber())
         .pipe(gulp.dest(src_paths.bower)) 
});

gulp.task('icons', function() { 
    return gulp.src(src_paths.bower + '/fontawesome/fonts/**.*') 
        .pipe(plumber())
        .pipe(gulp.dest(build_paths.scss + 'fonts/')); 
});

gulp.task('watch', function() {
    gulp.watch(src_paths.tpl + 'index.html', ['templates']);
    gulp.watch(src_paths.tpl + '**/*.html', ['templates']);
    gulp.watch(src_paths.js + '**/*.js', ['scripts']);
    gulp.watch(src_paths.scss + '**/*.{sass,scss}', ['sass']);
    gulp.watch(src_paths.bower + '**/*', ['bower', 'icons']);
});

gulp.task('default', ['scripts', 'sass', 'templates', 'bower', 'icons']);