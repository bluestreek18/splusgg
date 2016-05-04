module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //grunt task configuration will go here     
    ngAnnotate: {
      options: {
        singleQuotes: true
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
    concat: {
      angular: {
        src: ['./client/min-safe/*.js'],
        dest: './client/min/splusapp.js'
      },
      js: {
        src: ['./client/js/*.js'],
        dest: './client/dist/bundle.min.js'
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          './client/min/output.css': ['./client/css/bootstrap.css', './client/css/styles.css', './client/css/ui-bootstrap-csp.css']
        }
      }
    },
    uglify: {
      angular: {
        src: ['./client/min/splusapp.js'],
        dest: './client/dist/splusapp.min.js'
      }
    }
  });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify', 'cssmin']);
}