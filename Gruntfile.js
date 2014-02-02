module.exports = function(grunt) {
  grunt.initConfig({
  	pkg: grunt.file.readJSON('package.json'),

	  // minify & concat in one step
	  uglify: {
	  	options: {
	  		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
	  			'<%= grunt.template.today("yyyy-mm-dd") %> */' 
	  	},
	    files: {
	      'public/js/dist/build.js': ['public/js/lib/*.js', 'public/js/modules/HA.js', 'public/js/modules/HA.*.js', 'public/js/components/*.js', 'public/js/scenes/*.js', 'public/js/main_prod.js'],
	    }
	  }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

  	grunt.registerTask('default', 'uglify');
};