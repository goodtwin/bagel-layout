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
        css_include: '../../init.css'
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

grunt.registerTask('default', ['build']);
grunt.registerTask('distcss', ['sass:dist', 'myth:dist']);
grunt.registerTask('build', ['shared_config', 'distcss', 'sass:styleguide', 'dss']);

};
