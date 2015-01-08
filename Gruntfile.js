'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    copy: {
      index: {
        src: 'client/src/index.html',
        dest: 'client/dist/index.html',
      },
      assets: {
        files: [{
          expand: true,
          cwd: 'client/src/assets/',
          src: ['partials/**', 'img/**'],
          dest: 'client/dist/assets/',
        }],
      },
      materialize: {
        files: [{
          expand: true,
          cwd: 'bower_components/materialize/dist/',
          src: ['font/**'],
          dest: 'client/dist/assets/',
        }],
      },
    },
    jshint: {
      options: {
        globals: {
          angular: true,
        },
      },
      all: ['client/src/assets/js/**/*.js']
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/assets',
          src: '*/**.js',
          dest: '.tmp/concat/assets'
        }]
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'client/src/assets/stylesheets/',
          src: ['*.scss'],
          dest: 'client/src/assets/stylesheets',
          ext: '.css',
        }],
      }
    },
    usemin: {
      html: 'client/dist/index.html',
      options: {
        assetsDirs: ['bower_components', 'client'],
      },
    },
    useminPrepare: {
      html: 'client/src/index.html',
      options: {
        dest: 'client/dist',
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build'],
      },
      assets: {
        files: ['client/src/**/*'],
        tasks: ['build'],
      },
    },
  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', [
    'sass',
    'jshint',
    'useminPrepare',
    'concat:generated',
    'ngAnnotate',
    'uglify:generated',
    'cssmin:generated',
    'copy',
    'usemin'
  ]);
};
