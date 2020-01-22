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
    .pipe(
      sass({
        outputStyle: "compressed",
        includePaths: ["node_modules"]
      }).on("error", sass.logError)
    )
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
    .src("./src/js/")
    // eslint-disable-next-line global-require
    .pipe(webpack(require("./webpack.config.js")))
    .on("error", err => {
      console.log(err.toString());

      this.emit("end");
    })
    .pipe(gulp.dest("dist/js/"))
);

gulp.task("webpack:watch", () => {
  gulp.watch("./src/js/*.js", ["webpack"]);
});

// images
gulp.task("images", () =>
  gulp
    .src("src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"))
    .pipe(browserSync.stream())
);

gulp.task("images:watch", () => {
  gulp.watch("src/img/**", () => {
    gulp.run("images");
  });
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

// copy other files from /src to /dist
gulp.task("copy", () =>
  gulp.src("src/styles/fonts/*").pipe(gulp.dest("dist/styles/fonts/"))
);

gulp.task("copy:watch", () => {
  gulp.watch("src/styles/fonts/**", () => {
    gulp.run("copy");
  });
});
// browser-sync static server
gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch("dist/js/*.js", browserSync.reload);

  gulp.watch("*.html", browserSync.reload);

  gulp.watch("dist/styles/fonts/**", browserSync.reload);
});

gulp.task("default", ["sass", "webpack", "eslint", "images", "copy"]);

// default task
gulp.task("watch", [
  "default",
  "sass:watch",
  "sass:watch",
  "webpack:watch",
  "eslint:watch",
  "images:watch",
  "copy:watch",
  "browser-sync"
]);
