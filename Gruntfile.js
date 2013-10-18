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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n\n\n\n",
        banner:
          "/*!\n" +
          " * backend.js - v<%= pkg.version %>\n" +
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
      src: {
        options: {
          strict: false
        },
        files: {
          src: [
            'src/!(open|close).js'
          ]
        }
      },
      build: 'backend.js'
    },

    mocha: {
      all: 'test/index.html',
      options: {
        run: true,
        log: true
      }
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
    },

    watch: {
      all: {
        files: [
          'src/*.js',
          'test/spec/*.js'
        ],
        tasks: ['jshint:src', 'mocha']
      }
    }

  });


  grunt.registerTask('build', [
    'jshint:src',
    'mocha',
    'concat:build',
    'uglify:build',
    'jshint:build'
  ]);

  grunt.registerTask('default', ['build']);

};
