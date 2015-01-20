module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jasmine : {
            src: 'src/controllers/DashboardController.js',
            options : {
                specs : 'spec/**/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfigFile: 'src/js/main.js',
                    requireConfig: {
                        baseUrl: 'src/js/'
                    }
				}
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/controllers/*.js',
                'spec/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
				'-W030': true,
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', 'jasmine');
    //grunt.registerTask('test', ['jshint', 'jasmine']);

    grunt.registerTask('default', ['test']);

};
