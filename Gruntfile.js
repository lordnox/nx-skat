var Path = require("path");

var project = require("./project");

module.exports = function(grunt) {

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    build: {
      templates: {
        files: project.files.templates
      }
    },

    concat: {
      styles: {
        dest: Path.join(project.buildpath, "assets/app.css"),
        src: project.files.styles
      },
      scripts: {
        options: {
          separator: ";"
        },
        dest: Path.join(project.buildpath, "assets/app.js"),
        src: project.files.app
      },
      vendor: {
        options: {
          separator: ";"
        },
        dest: Path.join(project.buildpath, "assets/vendor.js"),
        src: project.files.bower
      },
      templates: {
        dest: project.templatesPath + "/templates.js",
        src: project.templatesPath + "/template_*.js"
      }
    },

    connect: {
      options: {
        base: "app/",
        livereload: true
      },
      webserver: {
        options: {
          port: project.server.devPort,
          keepalive: true
        }
      },
      devserver: {
        options: {
          port: project.server.devPort
        }
      },
      testserver: {
        options: {
          port: project.server.testPort
        }
      },
      coverage: {
        options: {
          base: "coverage/",
          port: project.server.coveragePort,
          keepalive: true
        }
      }
    },

    clean: {
      build: project.buildpath,
      templates: project.templatesPath
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: project.appbase,
            src: [
              "**/templates/*.html"
            ],
            dest: project.buildpath,
          },
          {
            expand: true,
            cwd: project.appbase,
            src: [
              "assets/*.css"
            ],
            dest: project.buildpath,
          },
          {
            expand: true,
            cwd: project.appbase,
            src: [
              "*/**",
              "!bower_components/**",
              "!scripts/**",
              "!styles/**"
            ],
            dest: project.buildpath,
          }
        ]
      }
    },

    "gh-pages": {
      options: {
        base: project.buildpath
      },
      src: ["**"]
    },

    karma: {
      unit: {
        configFile: "./test/karma-unit.conf.js",
        autoWatch : false,
        singleRun : true,
        options   : {
          files     : [].concat(
            project.files.bower,
            project.files.test.lib,
            project.files.app,
            project.files.test.post,
            project.files.tests
          )
        }
      },
      unit_auto: {
        configFile: "./test/karma-unit.conf.js",
        options     : "<%= karma.unit.options %>"
      },
    },

    open: {
      devserver: {
        path: "http://localhost:" + project.server.devPort
      },
      coverage: {
        path: "http://localhost:" + project.server.coveragePort
      }
    },

    preprocess: {
      prod: {
        src: "app/index.preprocess.html",
        dest: Path.join(project.buildpath, "index.html")
      },
      dev: {
        src: "app/index.preprocess.html",
        dest: "app/index.html"
      }
    },

    shell: {
      options : {
        stdout: true
      },
      npm_install: {
        command: "npm install"
      },
      bower_install: {
        command: "./node_modules/.bin/bower install"
      },
      font_awesome_fonts: {
        command: "cp -R bower_components/components-font-awesome/font app"
      }
    },

    stylus: {
      compile: {
        options: {
          compress: false
        },
        files: {
          "app/styles/styles.css": ["app/styles/*.styl"]
        }
      }
    },

    watch: {
      assets: {
        files: ["app/styles/**/*.css","app/scripts/**"],
        tasks: ["module-templates", "concat"]
      },
      stylus: {
        files: ["app/**/*.styl"],
        tasks: ["stylus"],
        options: {
          livereload: true
        }
      },
      templates: {
        files: ["app/**/*.html"],
        tasks: ["module-templates"]
      }
    }
  });

  grunt.registerTask("test",        ["test:unit"]);
  grunt.registerTask("test:unit",   ["karma:unit"]);

  //keeping these around for legacy use
  grunt.registerTask("autotest",        ["autotest:unit"]);
  grunt.registerTask("autotest:unit",   ["module-templates", "connect:testserver", "karma:unit_auto"]);

  //installation-related
  grunt.registerTask("install",   ["shell:npm_install", "shell:bower_install", "shell:font_awesome_fonts"]);

  //defaults
  grunt.registerTask("default",   ["dev"]);

  grunt.registerTask("build",     ["clean:build", "concat:styles", "concat:scripts", "concat:vendor", "copy:build", "process:prod", "copy:build"]);

  //development
  grunt.registerTask("dev",       ["install", "concat", "connect:devserver", "open:devserver", "watch:assets"]);

  //development
  grunt.registerTask("dev-no",    ["install", "concat", "connect:devserver", "watch:assets"]);
  grunt.registerTask("dev-local", ["concat", "connect:devserver", "watch:assets"]);

  //preprocess
  grunt.registerTask("process",   ["process:dev", "process:prod"]);

  //server daemon
  grunt.registerTask("serve",     ["connect:webserver"]);

  //github pages
  grunt.registerTask("ghp",       ["gh-pages-clean", "gh-pages"]);

  grunt.registerTask("module-templates", "Create templates for all modules seperately", function() {
    // read the current config
    var ngtemplates = grunt.config.get("ngtemplates") || {};

    // read all subdirectories from your modules folder
    grunt.file.expand(project.apppath + "/modules/*").forEach(function (dir) {
      // get the module name
      var module = Path.basename(dir);

      // define a new ngtemplates definition to copy all templates into the test directory
      ngtemplates[module] = {
        cwd:      project.appbase,
        src:      ["**/" + module + "/**/*.html"],
        dest:     project.templatesPath + "/template_" + module + ".js",
      };
    });

    // set the "better" config
    grunt.config.set("ngtemplates", ngtemplates);

    // when finished run the concatinations
    grunt.task.run(["clean:templates", "ngtemplates", "concat:templates"]);
  });

  grunt.registerTask("process:prod", "Start the preprocess task as production", function() {
    process.env.TASK = "preprocess-prod";

    var task = {
      "appjs_hash"    : Path.join(project.buildpath, "assets/app.js")
    , "vendorjs_hash" : Path.join(project.buildpath, "assets/vendor.js")
    , "appcss_hash"   : Path.join(project.buildpath, "assets/app.css")
    };

    Object.keys(task).forEach(function(v) {
      var file = grunt.file.expand(task[v])[0];
      process.env[v] = Path.basename(file);
    });

    grunt.task.run("preprocess:prod");
  });

  grunt.registerTask("process:dev", "Start the preprocess task as development", function() {
    process.env.TASK = "preprocess-dev";

    var base = "app/"
      , js  = [].concat(
          project.files.bower,
          project.files.app
        )
      , css = [].concat(
          project.files.styles
        )
      ;

    process.env.script_tags = grunt.file.expand(js).map(function(v) {
      return "    <script src=\"" + (v.substr(base.length)) + "\"></script>";
    }).join("\n");

    process.env.style_tags = grunt.file.expand(css).map(function(v) {
      return "    <link rel=\"stylesheet\" type=\"text/css\" href=\"" + (v.substr(base.length)) + "\"/>";
    }).join("\n");

    grunt.task.run("preprocess:dev");
  });

  grunt.registerTask("xxx", function() {
    var files = grunt.config("karma.unit.options.files");

    console.log(grunt.file.expand(files));
  });

  //github pages - demo
  grunt.registerTask("demo",       ["build", "gh-pages-clean", "gh-pages"]);
};
