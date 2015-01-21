module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		jasmine : {
			src : 'controllers/DashboardController.js',
			options : {
				specs : 'specs/**/*.js',
				template : require('grunt-template-jasmine-requirejs'),
				templateOptions : {
					requireConfigFile : 'js/spec-main.js',
					requireConfig : {
						baseUrl : 'js/'
					}
				}
			}
		},
		jshint : {
			all : [
				'Gruntfile.js',
				'collections/*.js',
				'controllers/*.js',
				'enums/*.js',
				'fakes/*.js',
				'models/*.js',
				'js/app/*.js',
				'routers/*.js',
				'views/*.js',
				'specs/*.js'
			],
			options : {
				"-W030": false
			}
		},
		sass : {
			dist : {
				options : {
					style : 'expanded'
				},
				files : [{
						expand : true,
						cwd : 'scss',
						src : ['*.scss'],
						dest : 'css/',
						ext : '.css'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('validate', ['jshint']);
	grunt.registerTask('test', ['sass', 'jasmine']);
	grunt.registerTask('default', ['test']);
};
