
const del = require('del')
const { src, dest, parallel, series, watch } = require('gulp')
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const browserSync = require('browser-sync')
const bs = browserSync.create()
const data = {
    menus: [
      {
        name: 'Home',
        icon: 'aperture',
        link: 'index.html'
      },
      {
        name: 'Features',
        link: 'features.html'
      },
      {
        name: 'About',
        link: 'about.html'
      },
      {
        name: 'Contact',
        link: '#',
        children: [
          {
            name: 'Twitter',
            link: 'https://twitter.com/w_zce'
          },
          {
            name: 'About',
            link: 'https://weibo.com/zceme'
          },
          {
            name: 'divider'
          },
          {
            name: 'About',
            link: 'https://github.com/zce'
          }
        ]
      }
    ],
    pkg: require('./package.json'),
    date: new Date()
  }

  const clean = () => {
      return del(['dist'])
  }
const style = () => {
    return src('src/assets/styles/*.scss', {base: 'src'})
            .pipe(plugins.sass({ outputStyle: 'expanded' }))
            .pipe(dest('dist'))
}

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
            .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
            .pipe(dest('dist'))
}
const page = () => {
    return src('src/*.html', { base: 'src' })
            .pipe(plugins.swig({ data, default: { cache: false } }))
            .pipe(dest('dist'))
}

const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const font = () => {
    return src('src/assets/fonts/*', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const extra = () => {
    return src('src/public/**', { base: 'public' })
        .pipe(dest('dist'))
}
const serve = () => {
    watch('src/assets/styles/*.scss', style),
    watch('src/assets/scripts/*.js', script),
    watch('src/*html', page),
    watch([
     'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
    ], bs.reload)
    bs.init({
        notify: false,
        port: 2080,
        server: {
            baseDir: ['src'],
            routes: {
                '/node_modules': 'node_modules'
            }

        }
    })
}

const compile = parallel(style, script, page)
const build = series(clean,
     parallel(
    compile,
    image,
    font,
    extra
     ))
const develop = series(compile, serve)

module.exports = {
    compile,
    build,
    develop
}