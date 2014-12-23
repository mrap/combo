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
          src: ['partials/**'],
          dest: 'client/dist/assets/',
        }],
      },
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
    'useminPrepare',
    'concat:generated',
    'ngAnnotate',
    'uglify:generated',
    'copy',
    'usemin'
  ]);
};
