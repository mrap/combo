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
    'uglify:generated',
    'copy:index',
    'usemin'
  ]);
};
