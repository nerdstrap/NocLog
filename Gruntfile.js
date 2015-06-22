module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		jasmine : {
			src : 'src/controllers/DashboardController.js',
			options : {
				specs : 'src/specs/goToStationEntryLogListSpec.js',
				template : require('grunt-template-jasmine-requirejs'),
				templateOptions : {
					requireConfigFile : 'src/js/spec-main.js',
					requireConfig : {
						baseUrl : 'src/js/'
					}
				}
			}
		},
		jshint : {
			all : [
				'Gruntfile.js',
				'src/collections/*.js',
				'src/controllers/*.js',
				'src/enums/*.js',
				'src/fakes/*.js',
				'src/models/*.js',
				'src/js/app/*.js',
				'src/routers/*.js',
				'src/views/*.js',
				'src/specs/*.js'
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
						cwd : 'src/scss',
						src : ['*.scss'],
						dest : 'src/css/',
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
	//grunt.registerTask('test', ['sass', 'jasmine']);
	grunt.registerTask('test', ['jasmine']);
	grunt.registerTask('default', ['test']);
};
