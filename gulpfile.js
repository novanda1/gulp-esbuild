const __prod__ = process.env.NODE_ENV === "production";
const { src, dest, watch, series } = require("gulp");

const noop = require("gulp-noop");
const merge = require("merge-stream");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const createGulpEsbuild = require("gulp-esbuild");

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");

sass.compiler = require("node-sass");

const gulpEsbuild = createGulpEsbuild({
    minify: __prod__,
    outfile: "blocks.build.js",
    bundle: true,
    loader: {
        ".js": "jsx",
    },
});

const styles = [
    {
        src: "./src/**/editor.s[ca]ss",
        distName: "blocks.editor.css",
    },
    {
        src: "./src/**/style.s[ca]ss",
        distName: "blocks.style.css",
    },
];

const _styles = (cb) => {
    const task = styles.map((element) =>
        src(element.src)
            .pipe(postcss())
            .pipe(
                autoprefixer({
                    browserlist: ["last 2 versions"],
                    cascade: false,
                })
            )
            .pipe(__prod__ ? cleanCSS({ compatibility: "ie8" }) : noop())
            .pipe(concat(element.distName))
            .pipe(dest("./dist"))
    );

    return merge(task);
};

function _build(cb) {
    return src("./src/index.js")
        .pipe(
            babel({
                presets: ["@babel/preset-env", "@babel/preset-react"],
            })
        )
        .pipe(gulpEsbuild)
        .pipe(dest("./dist"));
    cb();
}

function watchTask() {
    watch("./src/**/*.js", _build);
    watch("./src/**/*.editor[ca]ss", _styles);
}

exports.default = series(_build, _styles, watchTask);
exports.build = series(_build, _styles);
