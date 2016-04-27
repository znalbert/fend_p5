var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var htmlmin = require('gulp-html-minifier');
var inlinesource = require('gulp-inline-source');

gulp.task('default', [
	'copy-html',
	'copy-images', 
	'styles', 
	'lint',
	'scripts'],
	function() {
	gulp.watch('src/sass/**/*.scss', ['styles'])
		.on('change', browserSync.reload);
	gulp.watch('src/js/**/*.js', ['lint', 'scripts'])
		.on('change', browserSync.reload);
	gulp.watch('src/index.html', ['copy-html'])
		.on('change', browserSync.reload);

	browserSync.init({
		server: './dist'
	});
});

gulp.task('styles', function() {
	gulp.src('src/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/'))
});

gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
	return gulp.src(['**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
		.pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
		.pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
		.pipe(eslint.failAfterError());
});

gulp.task('copy-html', function() {
	gulp.src('src/**/*.html')
		.pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
		.pipe(inlinesource())
		.pipe(gulp.dest('./dist'))
});

gulp.task('copy-images', function() {
	return gulp.src('src/**/*.{jpg,jpeg,png,gif}')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function() {
	gulp.src('src/js/**/*.js')
		.pipe(concat('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
	gulp.src('src/views/js/**/*.js')
		.pipe(concat('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/views/js'));
});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'lint',
	'scripts',
]);
