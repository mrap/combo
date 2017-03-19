'use strict';

const CLIENT_DEST = 'functions/api/build/client'

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    copy: {
      index: {
        src: 'client/src/index.html',
        dest: `${CLIENT_DEST}/index.html`,
      },
      assets: {
        files: [{
          expand: true,
          cwd: 'client/src/assets/',
          src: ['partials/**', 'img/**', 'audio/**'],
          dest: `${CLIENT_DEST}/assets/`,
        }],
      },
      materialize: {
        files: [{
          expand: true,
          cwd: 'bower_components/materialize/dist/',
          src: ['font/**'],
          dest: `${CLIENT_DEST}/assets/`,
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
      html: `${CLIENT_DEST}/index.html`,
      options: {
        assetsDirs: ['bower_components', 'client'],
      },
    },
    useminPrepare: {
      html: 'client/src/index.html',
      options: {
        dest: `${CLIENT_DEST}`,
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
