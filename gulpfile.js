const path = require('path');
const gulp = require('gulp');
const newer = require('gulp-newer');
const gutil = require('gulp-util');
const server = require('gulp-webserver');
const rollup = require('rollup');
const typescript =require('rollup-plugin-typescript');
const resolve =require('rollup-plugin-node-resolve');
const commonjs =require('rollup-plugin-commonjs');

const plugins = [
  resolve(),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'node_modules/react/index.js': ['Component', 'createElement', 'PropTypes'],
      'node_modules/react-dom/index.js': ['render']
    }
  }),
  typescript({
    typescript: require('typescript')
  }),
];

const globals = {
  'react': 'React',
  'react-dom': 'ReactDOM'
}

const distPath = path.join(__dirname, 'dist');

gulp.task('static', () => {
  return gulp.src([
    './index.html',
    './main.css',
    './src/lib/**/*'
  ])
  .pipe(newer(distPath))
  .pipe(gulp.dest(distPath));
});

gulp.task('build-main', () => {
  return rollup.rollup({
    input: 'src/main.tsx',
    external: ['react', 'react-dom'],
    plugins
  }).then(bundle => {
    return bundle.write({
      file: 'dist/main.js',
      format: 'iife',
      globals
    })
  });
});

gulp.task('build-worker', () => {
  return rollup.rollup({
    input: 'src/worker/main.ts',
    plugins
  }).then(bundle => {
    return bundle.write({
      file: 'dist/worker/main.js',
      format: 'iife'
    })
  });
});

gulp.task('server', () => {
  return gulp.src(distPath)
    .pipe(server({
      port: 8080,
      livereload: true,
      directoryListing: true,
      open: 'index.html'
    }));
});

gulp.watch(['./index.html', './main.css', 'src/lib/**/*'], gulp.series('static'));
gulp.watch(['src/**/*', '!src/worker/**/*', '!src/lib/**/*'], gulp.series('build-main'));
gulp.watch(['src/worker/**/*'], gulp.series('build-worker'));

gulp.task('dev', gulp.series([gulp.parallel(['build-main', 'build-worker', 'static']), 'server']));