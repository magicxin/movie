module.exports = function(grunt){
	
	grunt.initConfig({
		watch : {
			jade: {
				files : ['views/**'],
				options : {
					livereload : true
				}
			},
			js : {
				files : ['public/js/**' , 'models/**/*.js' , 'schemas/**/*.js'],
				//tasks : ['hshint'],
				options : {
					livereload : true
				}
			}
		},
		nodemon : {
			dev : {
				options : {
						file : 'app.js',
						args : [],
						ignoreFiles : ['README.md' , 'node_modules/**' , '.DS_Store'],
						watchedExtensions : ['js'],
						watchedFolders : ['app' , 'config'],
						debug : true,
						delayTime : 1,
						env : {
							POST : 3003
						},
						cwd : __dirname
					}
				}
			},
		concurrent : {
			tasks : ['nodemon' , 'watch'],
			options : {
				logConcurrentOutput : true
			}
		}
	});
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	
	
	grunt.option('force' , true);
	grunt.registerTask('default' , ['concurrent']);
};