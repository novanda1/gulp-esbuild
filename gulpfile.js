const { src, dest, watch, series } = require('gulp')

const babel = require('gulp-babel')
const concat = require('gulp-concat')
const gulpEsbuild = require('gulp-esbuild')

const sass = require('gulp-sass')
const postcss = require("gulp-postcss");
const cleanCSS = require('gulp-clean-css')
const sassPlugin = require('esbuild-plugin-sass');
const tailwindcss = require('tailwindcss');
const autoprefixer = require("gulp-autoprefixer");
const tailwindConfig = require('./tailwind.config')



sass.compiler = require('node-sass')


function editorStyle(cb) {
  return src('./src/**/editor.s[ca]ss')
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(postcss([
      tailwindcss(tailwindConfig),
      require('autoprefixer'),
    ]))
    .pipe(
      autoprefixer({
        browserlist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(concat('blocks.editor.css'))
    .pipe(dest('./dist'));
  cb()
}

function feStyle(cb) {
  return src('./src/**/style.s[ca]ss')
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(postcss([
      tailwindcss(tailwindConfig),
      require('autoprefixer'),
    ]))
    .pipe(
      autoprefixer({
        browserlist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(concat('blocks.style.css'))
    .pipe(dest('./dist'));
  cb()
}

function build(cb) {
  return src('./src/index.js')
    .pipe(babel({
      presets: ['@babel/preset-env', '@babel/preset-react']
    }))
    .pipe(gulpEsbuild({
      outfile: 'bundle.js',
      bundle: true,
      loader: {
        '.js': 'jsx',
      },
      plugins: [sassPlugin()]
    }))
    .pipe(concat('blocks.build.js'))
    .pipe(dest('./dist'))
  cb()
}

function watchTask() {
  watch('./src/**/*.js', build)
  watch('./src/**/*.editor[ca]ss', editorStyle)
  watch('./src/**/*.style[ca]ss', feStyle)
}

exports.default = series(build, watchTask)
exports.watch = series(editorStyle, feStyle, watchTask)
exports.build = build