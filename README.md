create-pages项目的测试项目

1.项目中安装gulp
```
yarn add gulp --dev
```
2.项目根目录创建gulp 配置文件gulpfile.js
3.编辑gulpfile.js文件
```
 /**
 导入gulp提供的api函数
src 输入流文件
dest 输出流文件
parallel  并行队列任务函数
series  顺序执行队列函数
watch  实时监听函数
**/
const { src, dest, parallel, series, watch } = require('gulp') 

// 导入处理scss js 图片压缩的插件 
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')
// 如果导入 gulp-load-plugins 则安装的插件就会自动导入，以上gulp插件不用手动导入
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
// 静态node服务器插件
const browserSync = require('browser-sync')
const bs = browserSync.create()
```
处理sass文件任务
```
const style = () => {
// base: 'src' 基准路径 这样在生成的文件夹中会按照当前目录进行生成
// outputStyle: 'expanded'  输出的文件内容格式是标准空格格式
    return src('src/assets/styles/*.scss', {base: 'src'})
            .pipe(plugins.sass({ outputStyle: 'expanded' }))
            .pipe(dest('dist'))
}
```

处理其他文件
```

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
            .pipe(plugins.babel({ presets: ['@babel/preset-env'] })) // @babel/preset-env将js文件中的es6语法转换为浏览器可运行的es5语法
            .pipe(dest('dist'))
}
const page = () => {
    return src('src/*.html', { base: 'src' })
            .pipe(plugins.swig({ data, default: { cache: false } })) //swig data中数据可以对html中模板数据进行替换 
// cache: false 防止模板缓存导致页面不能及时更新 
            .pipe(dest('dist'))
}

const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())  // imagemin对图片进行无损压缩
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
```

node服务
```

const serve = () => {
// 监听 src下文件，当有改动时，则重新编译调用相应任务
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}
````

导出任务

```
const compile = parallel(style, script, page)
const build = series(clean,
     parallel(
    compile,
    image,
    font,
    extra
     )) // 生产调用任务
const develop = series(compile, serve) // 开发调用此任务

module.exports = {
    compile,
    build,
    develop
}
```

package.json
```
需要安装的插件库
  "devDependencies": {
    "@babel/core": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "browser-sync": "^2.26.7",
    "del": "^5.1.0",
    "gulp": "^4.0.2",
    "gulp-babel": "^8.0.0",
    "gulp-clean-css": "^4.2.0",
    "gulp-htmlmin": "^5.0.1",
    "gulp-if": "^3.0.0",
    "gulp-imagemin": "^6.1.0",
    "gulp-load-plugins": "^2.0.1",
    "gulp-sass": "^4.0.2",
    "gulp-swig": "^0.9.1",
    "gulp-uglify": "^3.0.2",
    "gulp-useref": "^3.1.6"
  }

````