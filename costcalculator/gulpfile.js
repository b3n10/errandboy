const { src, dest, pipe, watch, start, done, series } = require('gulp')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()

const transpile = (done) => {
    src('src/**/*.js')
        .pipe(babel())
        .on('error', (e) => {
            console.log(`Error: ${e.name}\nMessage: ${e.message}\nLine: ${e.loc.line} Col: ${e.loc.column}`) // handle error for babel
        })
        .pipe(dest('dist'))
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
        }
    })
}

const brel = (done) => {
    browserSync.reload()
    done()
}

exports.mywatch = () => {
    brs()
    watch('src/**/*.js', series(transpile, brel))
    watch('**/*.html', brel)
}

exports.default = () => {
    console.log('nothing here..')
}

if (process.env.NODE_ENV === 'production') {
    exports.build = series(transpile, minify)
} else {
    exports.build = transpile
}
