const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const webpack = require("webpack-stream");
const eslint = require("gulp-eslint");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

// sass
gulp.task("sass", () =>
  gulp
    .src("./src/styles/main.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ basename: "main.min" }))
    .pipe(gulp.dest("./dist/styles"))
    .pipe(browserSync.stream())
);

gulp.task("sass:watch", () => {
  gulp.watch("./src/styles/*.scss", ["sass"]);
});

// webpack
gulp.task("webpack", () =>
  gulp
    .src("src/js/")
    // eslint-disable-next-line global-require
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("dist/js/"))
    .pipe(browserSync.stream())
);

gulp.task("webpack:watch", () => {
  gulp.watch("./src/js/*.js", ["webpack"]);
});

// images
gulp.task("images", () =>
  gulp
    .src("src/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"))
    .pipe(browserSync.stream())
);

gulp.task("images:watch", () => {
  gulp.watch("./src/images/*", ["images"]);
});

// eslint
gulp.task("eslint", () =>
  gulp
    .src(["./src/js/*.js"])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
);

gulp.task("eslint:watch", () => {
  gulp.watch("./src/js/*.js", ["eslint"]);
});

// browser-sync static server
gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch("dist/js/*.js", browserSync.reload);

  gulp.watch("*.html").on("change", browserSync.reload);
});

// default task
gulp.task("default", [
  "sass:watch",
  "webpack:watch",
  "eslint:watch",
  "images:watch",
  "browser-sync"
]);
