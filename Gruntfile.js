module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //grunt task configuration will go here     
    ngAnnotate: {
      options: {
        singleQuotes: true,
        add: true,
        separator: ';\n'
      },
      app: {
        files: {
          './client/min-safe/app.annotated.js': ['./client/app.js'],
          './client/min-safe/apis.annotated.js': ['./client/modules/apis.js'],
          './client/min-safe/teams.annotated.js': ['./client/modules/teams.js'],
          './client/min-safe/badges.annotated.js': ['./client/modules/badges.js'],
          './client/min-safe/nav.annotated.js': ['./client/modules/nav.js'],
          './client/min-safe/search.annotated.js': ['./client/modules/search.js'],
          './client/min-safe/datastore.annotated.js': ['./client/modules/datastore.js']
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: true
        }
      },
      angular: {
        src: ['./client/min-safe/app.annotated.js', './client/min-safe/apis.annotated.js', './client/min-safe/teams.annotated.js', 
        './client/min-safe/badges.annotated.js', './client/min-safe/nav.annotated.js', './client/min-safe/search.annotated.js', './client/min-safe/datastore.annotated.js'],
        dest: './client/min/ngapp.min.js'
      }
    },
    concat: {
      angular: {
        src: ['./client/js/angular.min.js', './client/js/moment.min.js', './client/js/angular-moment.min.js', 
        './client/js/angular-ui-router.min.js', './client/js/ui-bootstrap-tpls.min.js', './client/js/promise.min.js', './client/min/ngapp.min.js'],
        dest: './dist/splusapp.min.js'
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          './dist/output.css': ['./client/css/bootstrap.css', './client/css/styles.css', './client/css/ui-bootstrap-csp.css']
        }
      }
    }
  });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'uglify', 'concat', 'cssmin']);
}