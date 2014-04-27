module.exports = function(grunt) {
	
	grunt.initConfig({
		browserify: {
			all: {
				src: 'static/js/src/main.js',
				dest: 'static/js/main.js'
			}
		},
		jshint: {
			all: {
				src: ['static/js/src/**/*.js', 'Gruntfile.js'],
			},
			options: {
				expr: true
			}
		},
		compass: {
			all: {
				options: {
					sassDir: 'static/sass',
					cssDir: 'static/css'
				}
			}
		},
		watch: {
			js: {
				files: ['static/js/src/**/*.js'],
				tasks: ['jshint', 'browserify']
			},
			sass: {
				files: ['static/sass/**/*.sass'],
				tasks: ['compass']
			},
			options: {
			  spawn: false,
			  livereload: true
			}
		}
			
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compass');
};

