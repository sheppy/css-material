var DIST = "dist";

var gulp = require("gulp");

var del = require("del");
var browserSync = require("browser-sync");
var runSequence = require("run-sequence");

// load plugins
var $ = require("gulp-load-plugins")();

var onError = function (err) {
    $.notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);

    this.emit("end");
};

gulp.task("css", function () {
    return gulp.src("src/assets/scss/**/*.scss")
        .pipe($.plumber({errorHandler: onError}))
        //.pipe($.cached("css"))
        .pipe($.sass({
            style: "expanded"
        }))
        .pipe($.autoprefixer("last 2 version", "safari 5", "ie 9", "opera 12.1", "ios 6", "android 4"))
        .pipe(gulp.dest(DIST + "/assets/css"))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task("html", function () {
    return gulp.src("src/views/pages/**/*.hbs")
        .pipe($.plumber({errorHandler: onError}))
        //.pipe($.cached("html"))

        .pipe($.assemble({
            layoutdir: "src/views/layouts/",
            layout: "default.hbs",
            partials: [
                "src/views/partials/**/*.hbs",
                "src/views/components/**/*.hbs"
            ],
            data: "src/views/data/**/*.json"
        }))

        .pipe($.inject(gulp.src("assets/css/**/*.css", {
            read: false,
            cwd: DIST
        }), {addRootSlash: false}))

        .pipe(gulp.dest(DIST));
});


gulp.task("fonts", function () {
    return gulp.src("src/assets/font/**/*.*")
        .pipe(gulp.dest(DIST + "/assets/font/"));
});


gulp.task("clean", function (cb) {
    del([
        DIST + "/assets",
        DIST + "/**/*.html"
    ], cb);
});


// start server
gulp.task("browser-sync", function () {
    browserSync({
        server: {
            baseDir: DIST,
            directory: true,
            index: "index.html"
        },
        startPath: "/index.html"
    });
});


// Reload all Browsers
gulp.task("bs-reload", function () {
    browserSync.reload();
});


gulp.task("watch", ["browser-sync"], function () {
    // Watch sass files
    gulp.watch("src/assets/scss/**/*.scss", ["css"]);

    // Watch html files
    gulp.watch("src/views/**/*.hbs", ["html"]);

    // Reloading
    gulp.watch("dist/**/*.html", ["bs-reload"]);
});


gulp.task("build", function (callback) {
    runSequence(
        "clean",
        ["css", "fonts"],
        "html",
        callback
    );
});

gulp.task("default", ["build"]);