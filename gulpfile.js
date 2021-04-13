const __prod__ = process.env.NODE_ENV === 'production'
const { src, dest, watch, series, parallel } = require('gulp')

const noop = require('gulp-noop')
const merge = require('merge-stream')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const createGulpEsbuild = require('gulp-esbuild')

const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')

sass.compiler = require('node-sass')

const beScriptEsBuild = createGulpEsbuild({
  minify: __prod__,
  outfile: 'blocks.build.js',
  bundle: true,
  loader: {
    '.js': 'jsx'
  }
})

const feScriptEsBuild = createGulpEsbuild({
  minify: __prod__,
  outfile: 'blocks.build.frontend.js',
  bundle: true,
  loader: {
    '.js': 'jsx'
  }
})

const scripts = [
  {
    src: './src/index.js',
    esbuild: beScriptEsBuild
  },
  {
    src: './src/**/frontend.js',
    esbuild: feScriptEsBuild
  }
]

const styles = [
  {
    src: './src/**/editor.s[ca]ss',
    distName: 'blocks.editor.build.css'
  },
  {
    src: './src/**/style.s[ca]ss',
    distName: 'blocks.style.build.css'
  }
]

const _styles = () => {
  const task = styles.map((style) =>
    src(style.src)
      .pipe(
        sass({ outputStyle: 'compressed' }).on('error', sass.logError)
      )
      .pipe(postcss())
      .pipe(
        autoprefixer({
          browserlist: ['last 2 versions'],
          cascade: false
        })
      )
      .pipe(__prod__ ? cleanCSS({ compatibility: 'ie8' }) : noop())
      .pipe(concat(style.distName))
      .pipe(dest('./dist'))
  )

  return merge(task)
}

function _build() {
  const task = scripts.map(script =>
    src(script.src)
      .pipe(babel({
        presets: ['@babel/preset-env',
          [
            '@babel/preset-react',
            {
              development: !__prod__
            }
          ]
        ],
      }))
      .pipe(script.esbuild)
      .pipe(dest('./dist'))
  )

  return merge(task)
}

function watchTask(cb) {
  watch('./src/**/*.(js|jsx)', _build)
  watch('./src/**/*.s[ca]ss', _styles)
  cb()
}

exports.default = series(_build, _styles, watchTask)
exports.build = parallel(_build, _styles)
