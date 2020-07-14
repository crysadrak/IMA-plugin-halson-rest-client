let del = require('del');
let gulp = require('gulp');
let babel = require('gulp-babel');

exports.build = gulp.series(
	clean,
	gulp.parallel(
		buildJs,
		copy
	)
);

function buildJs() {
	return gulp
		.src('./src/**/!(*Spec).js')
		.pipe(
			babel({
				moduleIds: true,
				presets: ['@babel/react'],
				plugins: ['@babel/plugin-transform-modules-commonjs']
			})
		)
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

exports.dev = dev;
function dev() {
	return gulp.watch(['./src/**/*.js'], test);
}
