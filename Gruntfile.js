/*global module, require*/
module.exports = function (grunt) {
  'use strict';

  var globalConfig = {
    index: 'init',
    docs: 'docs',
    styleguide: 'guide',
    dist: {
      root: 'dist',
      docs: 'dist/docs',
      style: 'dist/style'
    }
  };

  grunt.initConfig({
    globalConfig: globalConfig,
    pkg: grunt.file.readJSON('./package.json'),
    assemble : {
      docs: {
        options: {
          assets: '<%= globalConfig.docs  %>/assets',
          flatten: false,
          partials: ['<%= globalConfig.docs  %>/partials/*.hbs'],
          layout: '<%= globalConfig.docs  %>/layouts/default.hbs',
          data: ['<%= globalConfig.docs  %>/data/*.{json,yml}','config.{json,yml}']
        },
        files: [{
          expand: true,
          cwd: '<%= globalConfig.styleguide  %>',
          src: ['**/*.hbs'],
          dest: '<%= globalConfig.dist.docs  %>'
        }]
      }
    },
    shared_config: {
      style: {
        options: {
          name: 'defaultConfig',
          cssFormat: 'dash',
          useSassMaps: true
        },
        src: ['node_modules/bagel-functions/config.yml', 'config.yml'], // order matters
        dest: [
          'config.scss'
        ]
      }
    },
    sass: {
      options: {
        loadPath: ['./', 'node_modules/']
      },
      styleguide: {
        files : {
          '<%= globalConfig.dist.docs  %>/stylesheets/guide.css': '<%= globalConfig.styleguide  %>/guide.scss'
        }
      },
      dist: {
        files : {
          '<%= globalConfig.dist.style %>/style.css': '<%= globalConfig.index %>.scss'
        }
      }
    },
    myth: {
      options: {
        sourcemap: true
      },
      dist: {
        files: {
          '<%= globalConfig.dist.style %>/style.css': '<%= globalConfig.dist.style %>/style.css'
        }
      }
    },
    dss: {
      docs: {
        files: {
          'dist/docs/': 'dist/style/style.css'
        }
      },
      options: {
        template: 'docs/',
        template_index: 'index.hbs',
        parsers: {
          // Finds @param in comment blocks
          param: function(i, line, block, file){
            var param = line.split(' - ');
            return {
              name: param[0],
              description: param[1],
              default: param[2]
            };
          },
          // Finds @type in comment blocks
          type: function(i, line, block, file){
            return line;
          },
          // Finds @example in comment blocks
          example: function(i, line, block, file){
            return {
              example: line
            };
          }
        }
      }
    },
    watch: {
      sass: {
        files: ['**/*.scss'],
        tasks: ['distcss']
      }
    }
  });

require('load-grunt-tasks')(grunt);
grunt.loadNpmTasks('assemble');

grunt.registerTask('default', ['build']);
grunt.registerTask('distcss', ['sass:dist', 'myth:dist']);
grunt.registerTask('build', ['shared_config', 'distcss', 'sass:styleguide', 'assemble:docs']);

};
