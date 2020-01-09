const { src, dest, pipe, watch, start, done, series } = require('gulp')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')

const transpile = (done) => {
    src('src/*.js')
        .pipe(babel())
        .on('error', (e) => {
            console.log(`Error: ${e.name}\nMessage: ${e.message}\nLine: ${e.loc.line} Col: ${e.loc.column}`) // handle error for babel
        })
        .pipe(dest('js'))
    done()
}

const copyHTML = (done) => {
    src('src/new.html')
        .pipe(rename('index.html'))
        .pipe(dest('./'))
    done()
}

const minifyCSS = (done) => {
    src('src/*.css')
        .pipe(cleanCSS())
		.pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('css'))
    done()
}

const minifyJS = (done) => {
    src('src/*.js')
        .pipe(babel())
        .on('error', (e) => {
            console.log(`Error: ${e.name}\nMessage: ${e.message}\nLine: ${e.loc.line} Col: ${e.loc.column}`) // handle error for babel
        })
        .pipe(dest('js'))
        .pipe(uglify())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(dest('js'))
    done()
}

const brs = () => {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false,
        port: 8080,
        ui: {
            port: 8081
        },
        logLevel: "silent"
    })
}

const brel = (done) => {
    browserSync.reload()
    done()
}

exports.mywatch = () => {
    brs()
    watch('src/*.js', series(transpile, brel))
    watch('src/*.css', brel)
    watch('src/*html', brel)
}

exports.default = () => console.log('nothing here..')
exports.minifyCSS = minifyCSS
exports.minifyJS = minifyJS
exports.transpile = transpile
exports.build = series(copyHTML, minifyCSS, minifyJS)
/*
if (process.env.NODE_ENV === 'production') {
    exports.build = series(transpile, minifyCSS)
} else {
    exports.build = transpile
}
*/
