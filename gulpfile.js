var gulp = require('gulp'),
    paths = {
        html: ['src/*.html'],
        js: [
            'node_modules/jquery/dist/jquery.js',
            'src/js/*.js'
        ],
        less: [
            'src/less/vars.less',
            'src/less/main.less',
            'src/less/responsive.less'
        ],
        images: ['src/images/**/*'],
        lib: ['src/lib/**/*']
    };

/////////////////////////
var del = require('del');

gulp.task('delete', function(cb){
    del(['dist/*.html', 'dist/css/*.css', 'dist/js/bundle.js', 'dist/images/*.*', 'dist/lib/*.*']).then(paths => {
       console.log('Deleted files and folders:\n', paths.join('\n'));
    }),
    cb;
});

////////////////////////////////////////////////////////
var w3cValidation = require('gulp-w3c-html-validation');

gulp.task('html', function(cb){
    pump([
        gulp.src(paths.html),
        w3cValidation({
            generateCheckstyleReport: 'w3cErrors/validation.xml',
            relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.',
                            'Element title must not be empty.']
        }),
        gulp.dest('dist')
        ],
        cb
    );
});

///////////////////////
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');

gulp.task("script", function (cb) {
    pump([
        gulp.src(paths.js),
        concat('bundle.js'),
        uglify(),
        gulp.dest('dist/js')
        ],
        cb
    );    
});

//////////////////////////////
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var path = require('path');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var rename = require('gulp-rename');

gulp.task('style', function(cb) {
    pump([
        gulp.src(paths.less),
        less({
            plugins: [autoprefix],
            paths: [path.join(__dirname, 'less', 'includes')]
        }),
        cleanCSS({compatibility: 'ie10'}),
        concat('style.css'),
        rename({suffix: '.min'}),
        gulp.dest('dist/css')
        ],
        cb
    );
});
//////////////////////////////////
gulp.task('images', function(cb) {
    pump([
        gulp.src(paths.images),
        gulp.dest('dist/images')
    ]);
});
//////////////////////////////////
gulp.task('lib', function(cb) {
    pump([
        gulp.src(paths.lib),
        gulp.dest('dist/lib')
    ]);
});

var eventFn = function(event){ console.log('File ' + event.path + ' was ' + event.type + ', running tasks...'); };

gulp.task('default', ['delete', 'style', 'script', 'images', 'lib', 'html']);

gulp.task('watch', function(){
    gulp.run('default');
    gulp.watch('src/less/*.less', ['style']).on('change', eventFn);
    gulp.watch('src/js/*.js', ['script']).on('change', eventFn);
    gulp.watch('src/*.html', ['html']).on('change', eventFn);
    gulp.watch('src/images/*.*', ['images']);
    gulp.watch('src/lib/**/*.*', ['lib']);
});
