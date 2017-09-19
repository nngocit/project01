/* */ 
(function(process) {
  var gulp = require('gulp');
  var del = require('del');
  var glob = require('glob');
  var karma = require('karma').server;
  var merge = require('merge-stream');
  var plato = require('plato');
  var plug = require('gulp-load-plugins')();
  var paths = {
    js: './toastr.js',
    less: './toastr.less',
    report: './report',
    build: './build'
  };
  var colors = plug.util.colors;
  var log = plug.util.log;
  gulp.task('help', plug.taskListing);
  gulp.task('analyze', function() {
    log('Analyzing source with JSHint, JSCS, and Plato');
    var jshint = analyzejshint([paths.js]);
    var jscs = analyzejscs([paths.js]);
    startPlatoVisualizer();
    return merge(jshint, jscs);
  });
  gulp.task('js', function() {
    log('Bundling, minifying, and copying the app\'s JavaScript');
    return gulp.src(paths.js).pipe(plug.sourcemaps.init()).pipe(plug.bytediff.start()).pipe(plug.uglify({})).pipe(plug.bytediff.stop(bytediffFormatter)).pipe(plug.sourcemaps.write('.')).pipe(plug.rename(function(path) {
      if (path.extname === '.js') {
        path.basename += '.min';
      }
    })).pipe(gulp.dest(paths.build));
  });
  gulp.task('css', function() {
    log('Bundling, minifying, and copying the app\'s CSS');
    return gulp.src(paths.less).pipe(plug.less()).pipe(gulp.dest(paths.build)).pipe(plug.bytediff.start()).pipe(plug.minifyCss({})).pipe(plug.bytediff.stop(bytediffFormatter)).pipe(plug.rename('toastr.min.css')).pipe(gulp.dest(paths.build));
  });
  gulp.task('default', ['js', 'css'], function() {
    log('Analyze, Build CSS and JS');
  });
  gulp.task('clean', function(cb) {
    log('Cleaning: ' + plug.util.colors.blue(paths.report));
    log('Cleaning: ' + plug.util.colors.blue(paths.build));
    var delPaths = [paths.build, paths.report];
    del(delPaths, cb);
  });
  gulp.task('test', function(done) {
    startTests(true, done);
  });
  function analyzejshint(sources, overrideRcFile) {
    var jshintrcFile = overrideRcFile || './.jshintrc';
    log('Running JSHint');
    return gulp.src(sources).pipe(plug.jshint(jshintrcFile)).pipe(plug.jshint.reporter('jshint-stylish'));
  }
  function analyzejscs(sources) {
    log('Running JSCS');
    return gulp.src(sources).pipe(plug.jscs('./.jscsrc'));
  }
  function startPlatoVisualizer() {
    log('Running Plato');
    var files = glob.sync('toastr.js');
    var options = {title: 'Plato Inspections Report'};
    var outputDir = './report/plato';
    plato.inspect(files, outputDir, options, platoCompleted);
    function platoCompleted(report) {
      var overview = plato.getOverviewReport(report);
      log(overview.summary);
    }
  }
  function startTests(singleRun, done) {
    karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: !!singleRun
    }, karmaCompleted);
    function karmaCompleted() {
      done();
    }
  }
  function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' + (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' + ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference;
  }
  function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
  }
})(require('process'));
