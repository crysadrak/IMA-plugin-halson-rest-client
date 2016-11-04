require('babel-core/register.js')({
	'plugins': [
		'babel-plugin-transform-es2015-modules-commonjs'
	].map(require.resolve) // fixes the issue with babel loader & linked modules
});

let del = require('del');
let gulp = require('gulp');
let babel = require('gulp-babel');
let jasmine = require('gulp-jasmine');

exports.build = gulp.series(
	clean,
	gulp.parallel(
		build_js,
		copy
	)
);

function build_js() {
	return gulp
		.src('./src/**/!(*Spec).js')
		.pipe(babel({
			moduleIds: true,
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./dist'));
}

function copy() {
	return gulp
		.src(['./package.json', './LICENSE', './README.md'])
		.pipe(gulp.dest('./dist'));
}

function clean() {
	return del('./dist');
}

exports.test = test;
function test() {
	return gulp
		.src('./src/**/*Spec.js')
		.pipe(jasmine({ includeStackTrace: true }));
}

exports.dev = dev;
function dev() {
	return gulp.watch(['./src/**/*.js'], test);
}
