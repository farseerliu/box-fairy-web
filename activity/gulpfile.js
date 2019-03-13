var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var glob = require('glob')
var fs = require('fs')
var path = require('path')
var pngquant = require('imagemin-pngquant')
var gulpConfig = require('./config')
var connect = $.connectMulti()

var publicPath = __dirname.replace(/\\{1,2}/g, '/').split('/public/')

var config = {
    rootPath: [
        gulpConfig.rootPath ? path.join(__dirname, gulpConfig.rootPath) : (publicPath.length > 1 ? path.join(publicPath[0], 'public') : __dirname)
    ],
    openFile: publicPath.length > 1 ? path.join(publicPath[1], gulpConfig.openFile) : gulpConfig.openFile,
    htmlPath: gulpConfig.htmlPath,
    htmlName: gulpConfig.htmlName,
    pageClassName: gulpConfig.pageClassName,
    themes: gulpConfig.themes,
    devVendorJs: gulpConfig.vendorJs,
    devAppJs: [
        'src/main.js',
        'src/**/*.{js,html}',
        '!src/template.html',
        '!src/vendor/**/*.*',
        '!src/**/*@*.{js,html}'
    ],
    devAppCss: [
        'src/{common,component,page}/**/*.less',
        '!src/{common,component,page}/**/*@*.less'
    ],
    devHtml: 'src/page/!(*#*).html',
    prodJs: [
        'dist/*.js',
        '!dist/vendor.js'
    ],
    prodCss: [
        'dist/*.css'
    ]
}

gulp.task('dev', ['dev:vendor:js', 'dev:app:js', 'dev:app:css', 'dev:html', 'dev:theme'])
gulp.task('dev:vendor:js', devVendorJs)
gulp.task('dev:app:js', devAppJs)
gulp.task('dev:app:css', devAppCss)
gulp.task('dev:html', devHtml)
gulp.task('dev:theme', devTheme)
gulp.task('server', server())
gulp.task('prod', ['prod:js', 'prod:css', 'prod:html'])
gulp.task('prod:js', prodJs)
gulp.task('prod:css', prodCss)
gulp.task('prod:html', prodHtml)
gulp.task('watch', watch)
gulp.task('all', ['dev', 'watch', 'server'])
gulp.task('img', img)

function img () {
    return gulp.src(['static/**/*.{jpg,png,gif}'])
        .pipe($.imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('static'))
}

function watch () {
    $.watch(config.devVendorJs, function () {
        gulp.start(['dev:vendor:js'])
    })

    $.watch(config.devAppJs, function () {
        gulp.start(['dev:app:js'])
    })

    $.watch(config.devAppCss, function () {
        gulp.start(['dev:app:css'])
    })

    // 任意改变都要更新版本号
    $.watch(['src/**/*.*'], function () {
        gulp.start(['dev:html'])
    })

    $.watch(['src/{component,page}/*@*.{less,html,js}'], function () {
        gulp.start(['dev:theme'])
    })

    // 本文件改变了重新编译
    $.watch(['gulpfile.js'], function () {
        gulp.start(['dev'])
    })
}

function server () {
    return connect.server({
        root: config.rootPath,
        livereload: false, /*{
         enable: true,
         port: 20000 + parseInt(Math.random() * 10000)
         },*/
        port: 10000 + parseInt(Math.random() * 10000),
        open: {
            file: config.openFile
        }
    })
}

function prodJs () {
    return gulp.src(config.prodJs)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest('dist'))
}

function prodCss () {
    return gulp.src(config.prodCss)
        .pipe($.cssmin({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('dist'))
}

function devHtml () {
    renderHtml(false)
}

function prodHtml () {
    renderHtml(true)
}

function renderHtml (isProd) {
    glob(config.devHtml, function (err, files) {
        if (err) {
            console.error('[dev:html]: ', err)
            return
        }
        fs.readFile(path.join(__dirname, 'src/template.html'), function (err, data) {
            if (err) {
                console.error('[dev:html]: ', err)
                return
            }
            data = data.toString()
            var version = getVersion()
            files.forEach(function (file) {
                try {
                    var fileName = file.split('/').pop()
                    if (fileName.indexOf('@') === -1) {
                        renderHtml(data, {
                            version: version,
                            fileName: fileName
                        })
                    }
                } catch (e) {
                    console.error('[dev:html]: ', e)
                }
            })
        })
    })

    function renderHtml (tpl, data) {
        var pageName = data.fileName.replace('.html', '')
        var view = '<page-' + pageName + ' class="' + config.pageClassName + '"></page-' + pageName + '>'
        tpl = tpl.replace('{{view}}', view)
            .replace(/\{\{page\}\}/g, pageName)
            .replace(/\{\{base\}\}/g, '/' + publicPath[1] + '/')
            .replace(/\{\{version\}\}/g, data.version)
            // .replace(/\{\{version\}\}/g, isProd ? data.version : 'dev')

        fs.writeFile(path.join(__dirname, config.htmlPath, config.htmlName(data.fileName)), tpl, function (err) {
            // console.error(err)
        })
    }

    function getVersion () {
        var date = new Date()
        date = date.getFullYear() + twoStr(date.getMonth() + 1) + twoStr(date.getDate()) + twoStr(date.getHours()) + twoStr(date.getMinutes()) + twoStr(date.getSeconds())
        return date
    }

    function twoStr (v) {
        if (String(v).length == 1) {
            return '0' + v
        }
        return v
    }
}

function devAppCss () {
    return gulp.src(config.devAppCss)
        .pipe(plumber('dev:app:css'))
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.concat('app.css'))
        .pipe($.autoprefixer({
            browsers: ['> 0%']
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
}

function devTheme () {
    config.themes.forEach(function (theme) {
        // console.log(theme)

        var htmlFilter = $.filter('**/*.html', {restore: true})
        var cssFilter = $.filter('**/*.less', {restore: true})
        var jsFilter = $.filter('**/*.js', {restore: true})

        gulp.src(['src/{component,page}/*@' + theme + '.{less,html,js}'])
            .pipe(plumber('dev:theme'))

            .pipe($.sourcemaps.init())
            .pipe(cssFilter)
            .pipe($.less())
            .pipe($.concat('theme-' + theme + '.css'))
            .pipe($.autoprefixer({
                browsers: ['> 0%']
            }))
            .pipe(cssFilter.restore)
            .pipe($.sourcemaps.write('.'))

            .pipe($.sourcemaps.init())

            .pipe(htmlFilter)
            .pipe($.rename(function (file) {
                file.basename = file.basename.replace('@' + theme, '')
            }))
            .pipe($.angularTemplatecache('templates.js', {module: 'ued'}))
            .pipe(htmlFilter.restore)

            .pipe(jsFilter)
            .pipe($.wrap(';(function() {\n/* ========== <%= file.sourceMap.file %> ========== */\n\n<%= contents %>\n\n})();\n\n'))
            .pipe($.concat('theme-' + theme + '.js'))
            .pipe(jsFilter.restore)

            .pipe($.sourcemaps.write('.'))

            .pipe(gulp.dest('dist'))
    })
}

function devAppJs () {
    // var jsFilter = $.filter('**/*.js', {restore: true})
    var htmlFilter = $.filter('**/*.html', {restore: true})

    return gulp.src(config.devAppJs)
        .pipe(plumber('dev:app:js'))
        .pipe($.sourcemaps.init())

        .pipe(htmlFilter)
        .pipe($.angularTemplatecache('templates.js', {module: 'ued'}))
        .pipe(htmlFilter.restore)

        .pipe($.wrap(';(function() {\n/* ========== <%= file.sourceMap.file %> ========== */\n\n<%= contents %>\n\n})();\n\n'))
        .pipe($.concat('app.js'))

        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
}

function devVendorJs () {
    return gulp.src(config.devVendorJs)
        .pipe(plumber('dev:vendor:js'))
        .pipe($.sourcemaps.init())
        .pipe($.wrap(';<%= contents %>;\n'))
        .pipe($.concat('vendor.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
}

function plumber (name) {
    return $.plumber(function (err) {
        console.error('[' + name + ']: ', err)
        this.emit('end')
    })
}