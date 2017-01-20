var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  connect = require('gulp-connect');

gulp.task('compress', function(cb) {
  pump([
      gulp.src('./src/*.js'),
      uglify(),
      gulp.dest('./dist/')
    ],
    cb
  );
});

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    port: 3300,
    root: './'
  });
});
gulp.task('testServer', function() {
  connect.server({
    livereload: true,
    port: 3400,
    root: './testServer'
  });
});

gulp.task('html', function () {
  gulp.src('./example/*.html')
    .pipe(connect.reload());
});
 
gulp.task('watch', function () {
  gulp.watch(['./example/*.html'], ['html']);
});

gulp.task('dev', ['connect', 'watch', 'testServer']);