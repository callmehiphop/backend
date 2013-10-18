'use strict';


var srcFiles = [
  'src/open.js',
  'src/helpers.js',
  'src/mocks.js',
  'src/xhr.js',
  'src/backend.js',
  'src/close.js'
];


module.exports = function(grunt) {
  // plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n\n\n\n",
        banner:
          "/*!\n" +
          " * backend.js\n" +
          " * v<%= pkg.version %> <%= grunt.template.today('m/d/yy') %>\n" +
          " * github.com/callmehiphop/backend.js\n" +
          " */\n"
      },
      build: {
        src: srcFiles,
        dest: 'backend.js'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'backend.js'
      ]
    },


    uglify: {
      options: {
        compress: true,
        preserveComments: 'some',
        sourceMap: 'backend.js.map'
      },
      build: {
        src: 'backend.js',
        dest: 'backend.min.js'
      }
    }

  });


  grunt.registerTask('build', [
    'concat:build',
    'jshint',
    'uglify:build'
  ]);

  grunt.registerTask('default', ['build']);

};