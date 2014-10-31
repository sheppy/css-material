module.exports = function (grunt) {
    var LIVERELOAD_PORT = 35730; //35729
    var CONNECT_PORT = 8080;

    grunt.initConfig({
        //----------------------------------------------------------------------
        // Compile the handlebars templates
        assemble: {
            options: {
                layoutdir: "src/views/layouts/",
                layout: "default.hbs",
                partials: [
                    "src/views/partials/**/*.hbs",
                    "src/views/components/**/*.hbs"
                ],
                data: ["src/views/data/*.json"],
                assets: "dist"
            },
            pages: {
                files: [{
                    cwd: "src/views/pages",
                    dest: "dist",
                    expand: true,
                    src: ["**/*.hbs"]
                }]
            }
        },

        //----------------------------------------------------------------------
        // Compile sass
        sass: {
            dist: {
                options: {
                    outputStyle: "nested",
                    sourceMap: false,
                    precision: 5
                },
                files: {
                    "dist/assets/css/main.css": "src/assets/scss/main.scss"
                }
            }
        },

        // Add vendor prefixes
        autoprefixer: {
            options: {
                browsers: ["last 4 versions", "> 5%", "ie 9", "Android >= 4", "OperaMini >= 5"]
            },
            "dist/assets/css/main.css": "dist/assets/css/main.css"
        },

        //----------------------------------------------------------------------
        // Start the connect server
        connect: {
            server: {
                options: {
                    base: "dist",
                    hostname: "0.0.0.0",
                    keepalive: true,
                    livereload: LIVERELOAD_PORT,
                    open: {
                        target: "http://localhost:" + CONNECT_PORT
                    },
                    port: CONNECT_PORT
                }
            }
        },

        //----------------------------------------------------------------------
        // Run multiple tasks
        concurrent: {
            dev: {
                tasks: ["connect", "watch"],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        watch: {
            assemble: {
                // Rebuild handlebars and reload
                files: ["src/views/**/*.hbs", "src/views/data/**/*.json"],
                tasks: ["html"],
                options: {
                    spawn: false,
                    livereload: LIVERELOAD_PORT
                }
            },
            sass: {
                // Compile sass and reload
                files: ["src/assets/scss/**/*.scss"],
                tasks: ["css"],
                options: {
                    spawn: false,
                    livereload: LIVERELOAD_PORT
                }
            }
        }
    });

    grunt.loadNpmTasks("assemble");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-autoprefixer");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-contrib-watch");


    grunt.registerTask("html", ["assemble"]);
    grunt.registerTask("css", ["sass", "autoprefixer"]);
    grunt.registerTask("js", []);

    grunt.registerTask("build", ["html", "css", "js"]);
    grunt.registerTask("dev", ["build", "concurrent"]);
    grunt.registerTask("default", ["build"]);
};
